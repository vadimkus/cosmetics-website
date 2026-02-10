# Session Changes - February 10, 2026

## Native Blog API for Mobile App

### Summary
Added two new API endpoints to support fully native blog reading and commenting in the iOS app. Previously, tapping a blog post in the app opened Safari. Now the app renders articles natively with full commenting support.

### New API Endpoints

#### 1. Blog Post Detail — `GET /api/mobile/blog/[slug]`

Returns the full blog post content with comments for native rendering.

**Headers:**
- `x-api-key` (required)
- `x-locale: en|ar|ru` (optional, default: en)

**Response:**
```json
{
  "post": {
    "id": "cmju2jrx...",
    "title": "Post Title",
    "slug": "post-slug",
    "excerpt": "Short description...",
    "content": "<div class=\"blog-content\">Full HTML...</div>",
    "featuredImage": "/blog/image.png",
    "authorName": "GENOSYS Team",
    "publishedAt": "2026-02-09T06:00:00.000Z",
    "views": 65,
    "tags": ["iOS App", "Mobile Shopping"]
  },
  "comments": [...],
  "commentCount": 5,
  "locale": "en"
}
```

**Features:**
- Localized content (EN/AR/RU via `titleAr`, `contentAr`, etc.)
- HTML sanitization via `sanitizeHtml()`
- Removes duplicate featured image from content body
- Parses `tags` JSON field
- Auto-increments view count (non-blocking `update()`)
- Returns only approved comments

**File:** `app/api/mobile/blog/[slug]/route.ts`

#### 2. Blog Comments — `GET/POST /api/mobile/blog/comments`

**GET** — Fetch approved comments for a post

Query params: `postId` (required)

**POST** — Submit a new comment (requires authentication)

Headers:
- `x-api-key` (required)
- `Authorization: Bearer <JWT_TOKEN>` (required)

Body:
```json
{
  "postId": "blog-post-id",
  "content": "Comment text"
}
```

**Features:**
- JWT token validation via `validateMobileAuth()`
- User lookup via `findUserByEmail()`
- Input sanitization via `sanitizeText()`
- Auto-approves comments from registered users
- Returns newly created comment in response

**File:** `app/api/mobile/blog/comments/route.ts`

### Security

| Endpoint | Auth Level |
|----------|------------|
| GET `/api/mobile/blog/[slug]` | API key only |
| GET `/api/mobile/blog/comments` | API key only |
| POST `/api/mobile/blog/comments` | API key + JWT token |

All endpoints:
- Validate `MOBILE_APP_KEY` via `x-api-key` header
- Return proper HTTP status codes (401, 404, 500)
- Log errors via `errorLog()`

### Database Models Used

```prisma
model BlogPost {
  id            String        @id @default(cuid())
  title         String
  titleAr       String?
  titleRu       String?
  slug          String        @unique
  excerpt       String?
  excerptAr     String?
  excerptRu     String?
  content       String        @db.Text
  contentAr     String?       @db.Text
  contentRu     String?       @db.Text
  featuredImage String?
  authorName    String?
  published     Boolean       @default(false)
  publishedAt   DateTime?
  views         Int           @default(0)
  tags          String?       // JSON array
  comments      BlogComment[]
}

model BlogComment {
  id        String   @id @default(cuid())
  postId    String
  userId    String?
  userName  String
  userEmail String?
  content   String   @db.Text
  approved  Boolean  @default(true)
  createdAt DateTime @default(now())
  post      BlogPost @relation(...)
}
```

### Files Added

```
app/api/mobile/blog/
├── route.ts              # Existing - blog list
├── [slug]/
│   └── route.ts          # NEW - blog post detail
└── comments/
    └── route.ts          # NEW - comments GET/POST
```

### Deployment

Pushed to `main` branch → Auto-deployed to Vercel.

Verified working:
```bash
curl -H "x-api-key: ..." "https://genosys.ae/api/mobile/blog/genosys-ios-app-2026"
# Returns full post JSON with content and comments
```

---

*Session completed: February 10, 2026*
