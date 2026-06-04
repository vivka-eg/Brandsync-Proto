# Icons API — BrandSync Strapi
 
All endpoints are served from the BrandSync Strapi backend.
 
```
Base URL: <STRAPI_URL>/api
```
 
## Authentication
 
Two token types are used depending on the operation:
 
| Token | Header | Used for |
|---|---|---|
| Read-only token | `Authorization: Bearer <STRAPI_API_TOKEN>` | downloads etc  |
| Admin token | `Authorization: Bearer <STRAPI_API_ADMIN_TOKEN>` | Upload, publish, dashboard, tag generation |
 
---
 
## Note on Strapi response format
 
All **core CRUD** endpoints return Strapi's standard envelope:
 
```json
{
  "data": {
    "id": 1,
    "documentId": "abc123xyz",
    "icon_name": "arrow-right",
    "..."
  },
  "meta": {}
}
```
 
List endpoints return:
```json
{
  "data": [...],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 4, "total": 100 }
  }
}
```
 
`documentId` is the stable string identifier to use in all relation fields and custom endpoints.
 
---
 
## Common query parameters (core CRUD endpoints)
 
| Param | Example | Description |
|---|---|---|
| `populate` | `populate=*` or `populate[icon_type]=true` | Include related data |
| `filters` | `filters[status][$eq]=PUBLISHED` | Filter results |
| `filters` | `filters[icon_name][$containsi]=arrow` | Case-insensitive partial match |
| `pagination[page]` | `pagination[page]=2` | Page number (1-based) |
| `pagination[pageSize]` | `pagination[pageSize]=25` | Results per page |
| `sort` | `sort=downloads:desc` | Sort field and direction |
 
---
 
## Icons
 
### GET /icons
Returns a paginated list of icons.
 
**Auth:** None required
 
**Example with filters and relations:**
```
GET /api/icons?populate=*&filters[status][$eq]=PUBLISHED&pagination[page]=1&pagination[pageSize]=25&sort=downloads:desc
```
 
**Response `200`**
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123xyz",
      "icon_name": "arrow-right",
      "icon_content": "<svg>...</svg>",
      "downloads": 12,
      "status": "PUBLISHED",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "icon_type": { "id": 1, "documentId": "...", "type_name": "outline" },
      "icon_category": [{ "id": 1, "documentId": "...", "category_name": "arrows" }],
      "icon_tags": [{ "id": 1, "documentId": "...", "tag_name": "direction" }]
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 4, "total": 100 }
  }
}
```
 
---
 
### GET /icons/:id
Returns a single icon by `documentId`.
 
**Auth:** None required
 
**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | string | Icon `documentId` |
 
**Example:**
```
GET /api/icons/abc123xyz?populate=*
```
 
**Response `200`**
```json
{
  "data": {
    "id": 1,
    "documentId": "abc123xyz",
    "icon_name": "arrow-right",
    "icon_content": "<svg>...</svg>",
    "downloads": 12,
    "status": "PUBLISHED",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "icon_type": { "documentId": "...", "type_name": "outline" },
    "icon_category": [{ "documentId": "...", "category_name": "arrows" }],
    "icon_tags": [{ "documentId": "...", "tag_name": "direction" }]
  },
  "meta": {}
}
```
 
---
 
### POST /icons
Create a single icon.
 
**Auth:** Admin token
 
**Body**
```json
{
  "data": {
    "icon_name": "arrow-right",
    "icon_content": "<svg>...</svg>",
    "status": "UNPUBLISHED",
    "icon_type": "type-documentId",
    "icon_category": ["cat-documentId-1", "cat-documentId-2"],
    "icon_tags": ["tag-documentId-1"]
  }
}
```
 
**Response `200`**
```json
{
  "data": { "id": 1, "documentId": "abc123xyz", "icon_name": "arrow-right", "..." },
  "meta": {}
}
```
 
---
 
### PUT /icons/:id
Update an icon's metadata.
 
**Auth:** Admin token
 
**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | string | Icon `documentId` |
 
**Body** — same shape as POST, only include fields to change
```json
{
  "data": {
    "icon_name": "arrow-left",
    "icon_tags": ["tag-documentId-2"]
  }
}
```
 
**Response `200`** — updated icon object
 
---
 
### DELETE /icons/:id
Delete an icon.
 
**Auth:** Admin token
 
**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | string | Icon `documentId` |
 
**Response `200`** — deleted icon object
 
---
 
### POST /icons/upload
Upload one or more SVG files.
 
**Auth:** Admin token
 
**Content-Type:** `multipart/form-data`
 
**Query params**
| Param | Type | Description |
|---|---|---|
| `multiple_icons` | boolean | `true` when each file has its own metadata |
 
**Form fields — single icon upload (`multiple_icons=false` or omitted):**
| Field | Type | Description |
|---|---|---|
| `files` | File | SVG file |
| `tags` | string | Comma-separated tag names e.g. `"arrow,direction"` |
| `categories` | string | Comma-separated category IDs (integers) e.g. `"1,2"` |
| `type` | string | Type ID (integer) e.g. `"1"` |
 
**Form fields — multiple icons with individual metadata (`multiple_icons=true`):**
| Field | Type | Description |
|---|---|---|
| `files` | File[] | SVG files |
| `tags` | string[] | Per-file comma-separated tag names |
| `categories` | string[] | Per-file comma-separated category IDs |
| `type` | string[] | Per-file type ID |
 
**Response `200`**
```json
{
  "message": "Uploaded successfully",
  "documentIds": ["abc123xyz", "def456uvw"]
}
```
 
**Response `400`** — no files or non-SVG file
```json
{ "error": { "message": "Only SVG files are allowed: photo.png" } }
```
 
---
 
### GET /icons/:documentId/download
Download an icon as SVG, PNG, or PDF. Increments the download counter.
 
**Auth:** BrandSync JWT
 
**Path params**
| Param | Type | Description |
|---|---|---|
| `documentId` | string | Icon `documentId` |
 
**Query params**
| Param | Type | Default | Description |
|---|---|---|---|
| `filetype` | string | `svg` | `svg`, `png`, or `pdf` |
 
**Response** — Binary file with headers:
 
| filetype | Content-Type | Notes |
|---|---|---|
| `svg` | `image/svg+xml` | Raw SVG |
| `png` | `image/png` | Resized to 300×300 |
| `pdf` | `application/pdf` | SVG centered on page |
 
`Content-Disposition: attachment; filename="<icon_name>.<filetype>"`
 
---
 
### PUT /icons/publish
Bulk publish or unpublish icons.
 
**Auth:** Admin token
 
**Body**
```json
{
  "documentIds": ["abc123xyz", "def456uvw"],
  "status": "PUBLISHED"
}
```
 
`status` accepts `PUBLISHED` or `UNPUBLISHED`.
 
**Response `200`**
```json
{ "message": "2 icons updated to PUBLISHED" }
```
 
---
 
### POST /icons/schedule-publish
Schedule icons to be published or unpublished at a future time.
 
**Auth:** Admin token
 
**Body**
```json
{
  "documentIds": ["abc123xyz", "def456uvw"],
  "schedule_time": "2024-06-01T10:00:00.000Z",
  "status": "PUBLISHED"
}
```
 
| Field | Required | Description |
|---|---|---|
| `documentIds` | ✅ | Array of icon `documentId` values |
| `schedule_time` | ✅ | ISO 8601 datetime |
| `status` | ❌ | Defaults to `PUBLISHED` |
 
**Response `200`**
```json
{
  "message": "Publish job scheduled successfully",
  "scheduled_for": "2024-06-01T10:00:00.000Z"
}
```
 
---
 
## Icon Categories
 
### GET /icon-categories
Returns all categories.
 
**Auth:** None required
 
**Response `200`**
```json
{
  "data": [
    { "id": 1, "documentId": "...", "category_name": "arrows" }
  ],
  "meta": { "pagination": { "..." } }
}
```
 
---
 
### POST /icon-categories
Create a category.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "category_name": "arrows" } }
```
 
**Response `200`** — created category object
 
---
 
### PUT /icon-categories/:id
Update a category.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "category_name": "navigation" } }
```
 
**Response `200`** — updated category object
 
---
 
### DELETE /icon-categories/:id
Delete a category.
 
**Auth:** Admin token
 
**Response `200`** — deleted category object
 
---
 
## Icon Types
 
### GET /icon-types
Returns all types.
 
**Auth:** None required
 
**Response `200`**
```json
{
  "data": [
    { "id": 1, "documentId": "...", "type_name": "outline" }
  ],
  "meta": { "pagination": { "..." } }
}
```
 
---
 
### POST /icon-types
Create a type.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "type_name": "outline" } }
```
 
**Response `200`** — created type object
 
---
 
### PUT /icon-types/:id
Update a type.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "type_name": "filled" } }
```
 
**Response `200`** — updated type object
 
---
 
### DELETE /icon-types/:id
Delete a type.
 
**Auth:** Admin token
 
**Response `200`** — deleted type object
 
---
 
## Icon Tags
 
### GET /icon-tags
Returns all tags.
 
**Auth:** None required
 
**Response `200`**
```json
{
  "data": [
    { "id": 1, "documentId": "...", "tag_name": "direction" }
  ],
  "meta": { "pagination": { "..." } }
}
```
 
---
 
### POST /icon-tags
Create a tag.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "tag_name": "direction" } }
```
 
**Response `200`** — created tag object
 
---
 
### PUT /icon-tags/:id
Update a tag.
 
**Auth:** Admin token
 
**Body**
```json
{ "data": { "tag_name": "navigation" } }
```
 
**Response `200`** — updated tag object
 
---
 
### DELETE /icon-tags/:id
Delete a tag.
 
**Auth:** Admin token
 
**Response `200`** — deleted tag object
 
---
 
### POST /icon-tags/generate
Generate 5 tags per icon name using Mistral AI.
 
**Auth:** Admin token
 
**Body**
```json
{ "icon_name_list": ["House", "Bucket"] }
```
 
**Response `200`**
```json
{
  "tags": [
    ["House", "Home", "Villa", "Building", "Window"],
    ["Container", "Paint", "Water", "Storage", "Tool"]
  ]
}
```
 
Tags are returned in the same order as the input list.
 
---
 
## Dashboard
 
All dashboard endpoints require the admin token.
 
### GET /icon-dashboard/top-icons
Returns the top 10 icons by total downloads.
 
**Auth:** Admin token
 
**Response `200`**
```json
{
  "arrow-right": 45,
  "home": 30,
  "search": 28
}
```
 
---
 
### GET /icon-dashboard/category-stats
Returns total download count per category.
 
**Auth:** Admin token
 
**Response `200`**
```json
{
  "arrows": 120,
  "ui": 80,
  "media": 45
}
```
 
---
 
### GET /icon-dashboard/date-trends
Returns download counts grouped by date.
 
**Auth:** Admin token
 
**Response `200`**
```json
{
  "2024-1-15": 12,
  "2024-1-16": 8,
  "2024-1-17": 21
}
```
 
---
 
### GET /icon-dashboard/totals
Returns high-level platform stats.
 
**Auth:** Admin token
 
**Response `200`**
```json
{
  "total_icons": 200,
  "total_published_icons": 150,
  "total_downloads": 342
}
```
 
---
 
## Error Responses
 
| Status | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid token |
| `404` | Not found |
| `500` | Unexpected server error |
 
**`400` example:**
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "documentIds (array) and status (PUBLISHED|UNPUBLISHED) are required"
  }
}
```
 
**`401` example:**
```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Valid admin token required"
  }
}
```
 
 