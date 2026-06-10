# Notification System Design
**Author:** Abirami (e0123011) | **Date:** June 2026

---

## Stage 1

### REST API Design — Campus Notification Platform

#### Base URL
```
http://localhost:3002/api
```

#### Authentication Header (all routes)
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Fetch all notifications for the logged-in student |
| GET | `/notifications/:id` | Get a single notification by ID |
| GET | `/notifications/unread` | Fetch only unread notifications |
| PATCH | `/notifications/:id/read` | Mark a notification as read |
| PATCH | `/notifications/read-all` | Mark all notifications as read |
| DELETE | `/notifications/:id` | Delete a notification |
| GET | `/notifications/priority` | Get top-N priority notifications |

---

#### GET `/notifications`

**Request Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22T17:51:18Z",
      "isRead": false
    }
  ]
}
```

---

#### PATCH `/notifications/:id/read`

**Request Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
    "isRead": true
  }
}
```

---

#### Real-Time Notification Design

**Chosen Mechanism: WebSockets (via Socket.IO)**

```
Client                         Server
  |                               |
  |--- WS Connect (with token) -->|
  |<-- Connection Acknowledged ---|
  |                               |
  |      [New Notification]       |
  |<-- emit('notification', data)-|
  |                               |
  |--- emit('mark_read', id) ---->|
  |<-- emit('notification_read') -|
```

**Why WebSockets over SSE or Long Polling:**
- Bi-directional: clients can also send "read" events
- Lower latency than polling
- Widely supported; Socket.IO provides fallback to HTTP long-polling

**Server-side emit on new notification:**
```javascript
io.to(`student_${studentId}`).emit('notification', {
  ID: notification.id,
  Type: notification.type,
  Message: notification.message,
  Timestamp: notification.timestamp,
  isRead: false
});
```

---

## Stage 2

### Database Selection

**Recommended DB: PostgreSQL (Relational)**

**Reasons:**
- Notifications have a predictable schema with strong typing (`notificationType` enum)
- Complex queries: filter by type, date range, unread status — SQL excels here
- ACID compliance ensures no notification is lost or double-delivered
- Supports indexes, partitioning, and connection pooling at scale

---

### DB Schema

```sql
-- Enum for notification types
CREATE TYPE notification_type AS ENUM ('Placement', 'Result', 'Event');

-- Notifications table
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    INTEGER NOT NULL,
  type          notification_type NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (reference)
CREATE TABLE students (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  roll_no    VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### Problems at Scale

| Problem | Cause |
|---------|-------|
| Slow queries | Full table scans on 5M rows without indexes |
| High write load | 50,000 inserts per "Notify All" event |
| Large table size | 5M rows × multiple columns = GBs of data |
| Lock contention | Concurrent reads/writes on the same table |

---

### Solutions

1. **Indexing** — Index `student_id`, `is_read`, `created_at` (see Stage 3)
2. **Table Partitioning** — Partition `notifications` by `created_at` (monthly)
3. **Message Queue** — Use Redis/Bull for bulk inserts instead of direct DB writes
4. **Read Replicas** — Route SELECT queries to replicas, writes to primary
5. **Archiving** — Move notifications older than 90 days to a cold storage table

---

### SQL Queries (based on Stage 1 APIs)

```sql
-- GET /notifications (all notifications for a student)
SELECT id, type, message, is_read, created_at
FROM notifications
WHERE student_id = $1
ORDER BY created_at DESC
LIMIT 50 OFFSET $2;

-- GET /notifications/unread
SELECT id, type, message, created_at
FROM notifications
WHERE student_id = $1 AND is_read = FALSE
ORDER BY created_at DESC;

-- PATCH /notifications/:id/read
UPDATE notifications
SET is_read = TRUE, updated_at = NOW()
WHERE id = $1 AND student_id = $2;

-- PATCH /notifications/read-all
UPDATE notifications
SET is_read = TRUE, updated_at = NOW()
WHERE student_id = $1 AND is_read = FALSE;

-- DELETE /notifications/:id
DELETE FROM notifications
WHERE id = $1 AND student_id = $2;
```

---

## Stage 3

### Query Analysis

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt DESC;
```

**Is this query accurate?**
Yes — logically it returns correct results: all unread notifications for student 1042, newest first. However it uses `SELECT *` which fetches all columns unnecessarily.

---

**Why is this slow?**

With 5,000,000 rows and no indexes:
- PostgreSQL performs a **full sequential scan** of the entire `notifications` table
- Every row is evaluated for `studentID = 1042 AND isRead = false`
- With millions of rows, this means scanning potentially hundreds of MB of data
- The `ORDER BY createdAt DESC` requires sorting the filtered result set

**Estimated cost:** O(N) scan where N = 5,000,000 rows → ~seconds per query at scale.

---

**What would you change?**

```sql
-- Step 1: Create a composite index
CREATE INDEX idx_notifications_student_unread
ON notifications (student_id, is_read, created_at DESC);

-- Step 2: Optimised query
SELECT id, type, message, created_at
FROM notifications
WHERE student_id = 1042
  AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 20;
```

**Changes made:**
- `SELECT *` → select only needed columns (avoids fetching large `message` text for every row during sort)
- Composite index on `(student_id, is_read, created_at DESC)` — allows index-only scan
- `LIMIT 20` — pagination prevents fetching thousands of rows at once

**Likely computation cost after fix:** O(log N + K) where K = rows returned (e.g. 20) → microseconds.

---

**Should you index every column?**

**No — this is bad advice.** Here's why:

| Concern | Explanation |
|---------|-------------|
| Write overhead | Every INSERT/UPDATE/DELETE must update ALL indexes — 50,000 inserts will be drastically slower |
| Storage cost | Each index is a B-tree copy of column data — multiplies storage use |
| Query planner confusion | PostgreSQL's query planner may pick a suboptimal index if too many exist |
| Low-cardinality columns | Indexing `is_read` (Boolean: only 2 values) alone is nearly useless |

**Rule:** Only index columns that appear in `WHERE`, `JOIN`, or `ORDER BY` clauses of frequent queries.

---

**Query: All students who got a Placement notification in the last 7 days**

```sql
SELECT DISTINCT s.id, s.name, s.email, s.roll_no
FROM students s
INNER JOIN notifications n ON n.student_id = s.id
WHERE n.type = 'Placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';
```

**With supporting index:**
```sql
CREATE INDEX idx_notifications_type_created
ON notifications (type, created_at DESC);
```

---

## Stage 4

### Performance Improvements — Caching Strategy

The core problem: DB overwhelmed by repeated reads of the same data (unread notifications) on every page load.

---

### Strategy 1: Redis Cache (Primary Recommendation)

```
Client → API Server → Redis Cache → PostgreSQL (on cache miss)
```

**Implementation:**
```javascript
async function getNotifications(studentId) {
  const cacheKey = `notifications:${studentId}:unread`;

  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss — query DB
  const notifications = await db.query(
    'SELECT ... FROM notifications WHERE student_id = $1 AND is_read = FALSE',
    [studentId]
  );

  // Store in cache for 60 seconds
  await redis.setex(cacheKey, 60, JSON.stringify(notifications));
  return notifications;
}
```

**Cache Invalidation:** When a notification is marked read or a new one arrives → `redis.del(cacheKey)`.

| Tradeoff | Detail |
|----------|--------|
| ✅ Reduces DB load by 90%+ | Repeated page loads served from memory |
| ✅ Sub-millisecond response | Redis in-memory reads |
| ⚠️ Stale data (up to TTL) | Student may briefly see outdated count |
| ⚠️ Cache invalidation complexity | Must invalidate on every write |
| ⚠️ Extra infrastructure | Redis server to maintain |

---

### Strategy 2: Pagination + Lazy Loading

Instead of fetching all notifications on page load, fetch only the first page (20 items) and load more on scroll.

```
GET /notifications?page=1&limit=20
```

| Tradeoff | Detail |
|----------|--------|
| ✅ Reduces data transferred | Only 20 rows per request |
| ✅ No extra infrastructure | Pure SQL with LIMIT/OFFSET |
| ⚠️ OFFSET degrades at high pages | OFFSET 10000 scans 10,000 rows |

**Fix:** Use cursor-based pagination:
```sql
SELECT * FROM notifications
WHERE student_id = $1 AND created_at < $cursor
ORDER BY created_at DESC LIMIT 20;
```

---

### Strategy 3: Unread Count Cache

Cache only the **unread count** (integer) separately — very cheap to cache and invalidate.

```javascript
await redis.setex(`unread_count:${studentId}`, 300, count);
```

| Tradeoff | Detail |
|----------|--------|
| ✅ Tiny memory footprint | Just an integer per student |
| ✅ Eliminates badge-refresh DB calls | Unread count shown in UI |
| ⚠️ Still need DB for full list | Only count is cached |

---

### Recommended Architecture

```
Client → WebSocket (real-time updates)
       → REST API → Redis (read cache, 60s TTL)
                  → PostgreSQL (authoritative store)
                  ↑ Write path: Queue → Worker → DB
```

---

## Stage 5

### Shortcomings in the Proposed Implementation

```python
function notify_all(student_ids, message):
    for student_id in student_ids:
        send_email(student_id, message)   # synchronous — blocks
        save_to_db(student_id, message)   # synchronous — blocks
        push_to_app(student_id, message)  # synchronous — blocks
```

| Problem | Impact |
|---------|--------|
| Synchronous loop over 50,000 students | Takes hours; blocks the server thread |
| No error isolation | One failure crashes the whole loop |
| No retry on failure | Failed emails are silently lost |
| No atomicity | Email sent but DB save failed → inconsistency |
| Memory pressure | All 50,000 IDs in memory at once |

---

**Logs show `send_email` failed for 200 students midway. What now?**

In the current design: **those 200 students get no notification and no retry**. There's no way to identify who failed without re-running from the beginning (which could double-send to the 49,800 who succeeded).

---

**Should DB save and email send happen together?**

**No — they should NOT be tightly coupled.** Reasons:
- Email is an external side effect; DB is the source of truth
- DB save should succeed first (creates audit trail with status = `PENDING`)
- Email is dispatched asynchronously after DB record is created
- If email fails, the DB record status → `FAILED` and can be retried independently

---

### Redesigned Architecture

```
HR clicks "Notify All"
         │
         ▼
API Server receives request
         │
         ▼
Create batch job record in DB (status: IN_PROGRESS)
         │
         ▼
Chunk 50,000 IDs into batches of 500
         │
         ▼
Push each batch to Message Queue (Redis Bull / RabbitMQ)
         │
         ▼
Return 202 Accepted to HR immediately
         │
    ┌────┴────┐
    ▼         ▼
Email      In-App
Worker     Worker
(async)    (async)
    │         │
    ▼         ▼
Mark DB:  Emit WS:
SENT/FAILED  push_to_app
```

---

### Revised Pseudocode

```javascript
async function notify_all(student_ids, message):

    // 1. Create audit record
    batchId = save_to_db({ status: 'IN_PROGRESS', total: student_ids.length, message })

    // 2. Chunk into batches of 500
    chunks = chunk(student_ids, 500)

    // 3. Enqueue each chunk (non-blocking)
    for chunk in chunks:
        await queue.add('notify_batch', {
            batchId,
            student_ids: chunk,
            message
        }, {
            attempts: 3,              // retry failed jobs up to 3 times
            backoff: { type: 'exponential', delay: 2000 }
        })

    return { batchId, status: 'QUEUED', message: 'Notifications being dispatched' }


// Worker processes each batch
async function process_batch(job):
    { batchId, student_ids, message } = job.data

    results = await Promise.allSettled(
        student_ids.map(async (student_id) => {
            // Save to DB first (source of truth)
            notifId = await save_to_db({ student_id, message, status: 'PENDING' })

            // Send email (async, independent of DB)
            emailResult = await send_email(student_id, message)
                .catch(err => ({ failed: true, error: err.message }))

            // Push to app (WebSocket)
            push_to_app(student_id, message)

            // Update status
            status = emailResult.failed ? 'FAILED' : 'SENT'
            await update_db(notifId, { status })

            return { student_id, status }
        })
    )

    // Log failures for retry
    failed = results.filter(r => r.value?.status === 'FAILED')
    if (failed.length > 0):
        await queue.add('retry_failed', { failed, message }, { delay: 30000 })

    await update_batch_status(batchId, results)
```

**Key improvements:**
- Non-blocking: HR gets immediate response
- Isolated failures: 200 failed emails don't affect the other 49,800
- Retry built-in: Failed jobs are re-queued with exponential backoff
- Audit trail: Every notification has a DB record with status tracking
- Chunked processing: Memory-safe, predictable load on DB/email provider

---

## Stage 6

### Priority Inbox Design

**Priority Score Formula:**
```
score = (typeWeight × 1,000,000) + unixTimestampSeconds
```

| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

**Why this formula:**
- Multiplying by 1,000,000 ensures type always dominates over recency
- Adding Unix timestamp ensures within the same type, newer notifications rank higher
- Simple, deterministic, O(1) to compute

---

### Top-N Algorithm — Min-Heap

To maintain the Top-N efficiently as new notifications stream in:

```
New notification arrives
        │
        ▼
Compute priority score
        │
    Heap full?
   /          \
 No            Yes
  │             │
Add to heap   score > heap.min?
              /              \
           Yes                No
            │                 │
      Replace min,       Discard
      heapify-up
```

**Time complexity:**
- Per insertion: **O(log N)** — heap push/pop
- Space: **O(N)** — only top-N notifications in memory

**vs naive sort:** O(n log n) over all notifications each time — not scalable with continuous updates.

---

### Implementation

See `notification_app_be/src/services/priorityInboxService.js` and `notification_app_be/src/priority_inbox.js` for working code.

**How continuous updates are handled:**
- A `MinHeap` of size N is maintained in memory
- On each new notification event (WebSocket push or poll), `heap.push(notification)` is called
- If heap size exceeds N, `heap.pop()` removes the lowest-priority notification
- The heap always contains exactly the top-N highest-priority notifications
- Retrieval is O(N log N) for sorted output, O(1) for just the top item
