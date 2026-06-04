​# BrandSync MCP Server - Frontend API Guide

Complete API documentation for frontend developers to integrate with the BrandSync MCP Server.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
- [Category Endpoints](#category-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Example Integrations](#example-integrations)

---

## Overview

The BrandSync MCP Server provides a REST API for managing and accessing design system components. It supports:

- **Component Management**: Upload, update, delete, and retrieve component ZIP files
- **User Management**: Create and manage users and access tokens
- **Authentication**: Bearer token-based authentication
- **Role-Based Access**: USER, ADMIN, and SUPER_ADMIN roles

---

## Base URL

**Production:**
```
https://mcp.brand.dev.egsync.com
```

**Development:**
```
http://localhost:3000
```

---

## Authentication

All endpoints (except `/health`) require authentication via Bearer token.

### Adding Authentication

Include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

### Getting a Token

After authenticating with OAuth/Keycloak, exchange your user info for a BrandSync token using the `/auth/token` endpoint (see below).

### Token Roles

- **USER**: Can view components and get own user info
- **ADMIN**: Can manage components and users
- **SUPER_ADMIN**: Full access (currently same as ADMIN)

---

## Authentication Endpoints

### 1. Exchange OAuth/Keycloak User for Token

Exchange OAuth/Keycloak user information for a BrandSync access token.

**Endpoint:** `POST /auth/token`

**Authentication:** Not required (this is how you get a token)

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Fields:**
- `email` (required): User's email from OAuth/Keycloak
- `name` (optional): User's name from OAuth/Keycloak

**Response:**
```json
{
  "success": true,
  "token": "1301447eec40fc32d497e74789f82ec2e7c6164316b993af5125222cf6b858aa",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "active": true
  }
}
```

**Behavior:**
- If user doesn't exist, creates a new user with `USER` role
- If user exists, returns or creates a token for that user
- Reuses existing valid tokens when possible
- Updates user's name if provided and different

**Error Responses:**

```json
// Missing email
{
  "error": "Email is required"
}

// Deactivated user
{
  "error": "User account is deactivated",
  "message": "Contact an administrator to reactivate your account"
}
```

**Example (JavaScript):**
```javascript
// After OAuth/Keycloak authentication
const oauthUser = {
  email: "john.doe@example.com",
  name: "John Doe"
};

const response = await fetch('https://mcp.brand.dev.egsync.com/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(oauthUser),
});

const data = await response.json();

// Store token for subsequent requests
localStorage.setItem('brandsyncToken', data.token);
localStorage.setItem('brandsyncUser', JSON.stringify(data.user));
```

---

## Public Endpoints

### 1. Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-23T10:00:00.000Z",
  "version": "2.0.0",
  "storage": "s3",
  "cache": {
    "enabled": true,
    "keys": 5,
    "hits": 150,
    "misses": 20,
    "hitRate": 88.24
  }
}
```

---

### 2. Get Current User

Get information about the currently authenticated user.

**Endpoint:** `GET /users/me`

**Authentication:** Required (any role)

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/users/me', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "active": true,
    "createdAt": "2026-02-20T12:00:00Z",
    "updatedAt": "2026-02-20T12:00:00Z",
    "currentToken": "your-token-string"
  }
}
```

---

### 3. List All Components

Get a list of all available components with optional filtering.

**Endpoint:** `GET /components`

**Authentication:** Required (any role)

**Query Parameters:**
- `category` (optional) - Filter by category name or code (partial match, case-insensitive)
- `tags` (optional) - Filter by tags (partial match, case-insensitive)

**Request:**
```javascript
// Get all components
fetch('https://mcp.brand.dev.egsync.com/components', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// Filter by category
fetch('https://mcp.brand.dev.egsync.com/components?category=construction', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// Filter by tags
fetch('https://mcp.brand.dev.egsync.com/components?tags=dashboard', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "components": [
    {
      "id": "clxy123abc",
      "name": "Dashboard",
      "title": "Dashboard Component",
      "description": "A reusable dashboard example",
      "zipFile": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/component.zip?X-Amz-...",
      "screenshots": [
        {
          "id": "clxy111aaa",
          "platform": "DESKTOP",
          "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-desktop.png?X-Amz-...",
          "s3Key": "Dashboard/screenshot-desktop.png",
          "bucket": "s3-brandsync-strapi-stage-01",
          "expiresIn": 3600,
          "expiresAt": "2026-03-10T11:00:00Z",
          "generatedAt": "2026-03-10T10:00:00Z",
          "isTemporary": true
        },
        {
          "id": "clxy222bbb",
          "platform": "TABLET",
          "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-tablet.png?X-Amz-...",
          "s3Key": "Dashboard/screenshot-tablet.png",
          "bucket": "s3-brandsync-strapi-stage-01",
          "expiresIn": 3600,
          "expiresAt": "2026-03-10T11:00:00Z",
          "generatedAt": "2026-03-10T10:00:00Z",
          "isTemporary": true
        },
        {
          "id": "clxy333ccc",
          "platform": "MOBILE",
          "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-mobile.png?X-Amz-...",
          "s3Key": "Dashboard/screenshot-mobile.png",
          "bucket": "s3-brandsync-strapi-stage-01",
          "expiresIn": 3600,
          "expiresAt": "2026-03-10T11:00:00Z",
          "generatedAt": "2026-03-10T10:00:00Z",
          "isTemporary": true
        }
      ],
      "category": {
        "id": "clxy999zzz",
        "code": "CONST",
        "name": "Construction"
      },
      "tags": ["dashboard", "admin", "ui"],
      "uploadedBy": "admin@example.com",
      "uploadedAt": "2026-02-20T10:00:00Z",
      "lastModified": "2026-02-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Important Notes:**
- `zipFile` and screenshot URLs are **presigned URLs** that expire after 1 hour
- These URLs can be used directly to download files (no authentication needed)
- Re-fetch the component list if URLs have expired
- `screenshots` is an array with three platforms: DESKTOP, TABLET, MOBILE
- Each screenshot includes enhanced metadata:
  - `id`: Screenshot database ID
  - `s3Key`: S3 object key
  - `bucket`: S3 bucket name
  - `expiresIn`: Seconds until URL expires (3600 = 1 hour)
  - `expiresAt`: Exact expiration timestamp
  - `generatedAt`: When the presigned URL was generated
  - `isTemporary`: Always true for presigned URLs
- `category` can be null if no category is assigned
- This endpoint does NOT include the `prompt` field. Use the detail endpoint below to get prompts

---

### 4. Get Component Details

Get detailed information about a specific component, including its prompt.

**Endpoint:** `GET /components/:id`

**Authentication:** Required (any role)

**Parameters:**
- `id` - Component ID or component name

**Request:**
```javascript
// By ID
fetch('https://mcp.brand.dev.egsync.com/components/clxy123abc', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// By name
fetch('https://mcp.brand.dev.egsync.com/components/Dashboard', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "id": "clxy123abc",
  "name": "Dashboard",
  "title": "Dashboard Component",
  "description": "A reusable dashboard example",
  "prompt": "Use this dashboard for admin interfaces. It includes charts, tables, and metrics.",
  "zipFile": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/component.zip?X-Amz-...",
  "screenshots": [
    {
      "id": "clxy111aaa",
      "platform": "DESKTOP",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-desktop.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-desktop.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true,
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-02-20T10:00:00Z"
    },
    {
      "id": "clxy222bbb",
      "platform": "TABLET",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-tablet.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-tablet.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true,
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-02-20T10:00:00Z"
    },
    {
      "id": "clxy333ccc",
      "platform": "MOBILE",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-mobile.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-mobile.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true,
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-02-20T10:00:00Z"
    }
  ],
  "category": {
    "id": "clxy999zzz",
    "code": "CONST",
    "name": "Construction"
  },
  "tags": ["dashboard", "admin", "ui"],
  "s3Path": "Dashboard/",
  "uploadedBy": {
    "id": "clxy456def",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "uploadedAt": "2026-02-20T10:00:00Z",
  "lastModified": "2026-02-20T10:00:00Z"
}
```

**Note:** `zipFile` and screenshot URLs expire after 1 hour. These are presigned URLs that can be used directly to download files. Detail endpoint includes `createdAt` and `updatedAt` timestamps for each screenshot.

---

## Category Endpoints

### 5. List All Categories

Get a list of all categories with component counts.

**Endpoint:** `GET /categories`

**Authentication:** Required (any role)

**Query Parameters:**
- `active` (optional) - Filter by active status (true/false)

**Request:**
```javascript
// Get all categories
fetch('https://mcp.brand.dev.egsync.com/categories', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// Get only active categories
fetch('https://mcp.brand.dev.egsync.com/categories?active=true', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "categories": [
    {
      "id": "clxy999zzz",
      "code": "CONST",
      "name": "Construction",
      "description": "Components for construction-related projects",
      "active": true,
      "componentCount": 5,
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z"
    },
    {
      "id": "clxy888yyy",
      "code": "MINING",
      "name": "Mining",
      "description": "Components for mining operations",
      "active": true,
      "componentCount": 3,
      "createdAt": "2026-02-16T10:00:00Z",
      "updatedAt": "2026-02-16T10:00:00Z"
    }
  ],
  "total": 2
}
```

---

### 6. Get Category Details

Get detailed information about a specific category including recent components.

**Endpoint:** `GET /categories/:id`

**Authentication:** Required (any role)

**Parameters:**
- `id` - Category ID or category code

**Request:**
```javascript
// By ID
fetch('https://mcp.brand.dev.egsync.com/categories/clxy999zzz', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// By code
fetch('https://mcp.brand.dev.egsync.com/categories/CONST', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "id": "clxy999zzz",
  "code": "CONST",
  "name": "Construction",
  "description": "Components for construction-related projects",
  "active": true,
  "componentCount": 5,
  "recentComponents": [
    {
      "id": "clxy123abc",
      "name": "Dashboard",
      "title": "Dashboard Component",
      "createdAt": "2026-02-20T10:00:00Z"
    }
  ],
  "createdAt": "2026-02-15T10:00:00Z",
  "updatedAt": "2026-02-15T10:00:00Z"
}
```

**Note:** `recentComponents` shows the 10 most recently created components in this category.

---

### 7. Get Components by Category

Get all components for a specific category with pagination.

**Endpoint:** `GET /categories/:id/components`

**Authentication:** Required (any role)

**Parameters:**
- `id` - Category ID or category code

**Query Parameters:**
- `limit` (optional) - Number of components to return (default: 50)
- `offset` (optional) - Number of components to skip (default: 0)

**Request:**
```javascript
// Get first 20 components in Construction category
fetch('https://mcp.brand.dev.egsync.com/categories/CONST/components?limit=20&offset=0', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

**Response:**
```json
{
  "category": {
    "id": "clxy999zzz",
    "code": "CONST",
    "name": "Construction"
  },
  "components": [
    {
      "id": "clxy123abc",
      "name": "Dashboard",
      "title": "Dashboard Component",
      "description": "A reusable dashboard example",
      "zipFile": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/component.zip?X-Amz-...",
      "screenshots": [
        {
          "id": "clxy111aaa",
          "platform": "DESKTOP",
          "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-desktop.png?X-Amz-...",
          "s3Key": "Dashboard/screenshot-desktop.png",
          "bucket": "s3-brandsync-strapi-stage-01",
          "expiresIn": 3600,
          "expiresAt": "2026-03-10T11:00:00Z",
          "generatedAt": "2026-03-10T10:00:00Z",
          "isTemporary": true
        }
      ],
      "tags": ["dashboard", "admin"],
      "uploadedBy": "admin@example.com",
      "uploadedAt": "2026-02-20T10:00:00Z",
      "lastModified": "2026-02-20T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

---

## Admin Endpoints

### 8. Upload Component

Upload a new component ZIP file with metadata and platform-specific screenshots.

**Endpoint:** `POST /admin/components`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `componentName` | string | Yes | Unique component identifier |
| `title` | string | No | Display title |
| `description` | string | No | Component description |
| `prompt` | string | No | AI prompt for this component |
| `categoryId` | string | No | Category ID to assign component to |
| `tags` | string | No | Comma-separated tags or JSON array |
| `zipFile` | file | Yes | Component ZIP file |
| `screenshotDesktop` | file | Yes | Desktop screenshot image |
| `screenshotTablet` | file | Yes | Tablet screenshot image |
| `screenshotMobile` | file | Yes | Mobile screenshot image |

**Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('componentName', 'Dashboard');
formData.append('title', 'Dashboard Component');
formData.append('description', 'A reusable dashboard example');
formData.append('prompt', 'Use this for admin interfaces');
formData.append('categoryId', 'clxy999zzz'); // Optional: Category ID
formData.append('tags', 'dashboard,admin,ui'); // Can also be JSON: ["dashboard", "admin", "ui"]
formData.append('zipFile', fileInput.files[0]); // Required
formData.append('screenshotDesktop', desktopInput.files[0]); // Required
formData.append('screenshotTablet', tabletInput.files[0]); // Required
formData.append('screenshotMobile', mobileInput.files[0]); // Required

fetch('https://mcp.brand.dev.egsync.com/admin/components', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  },
  body: formData
})
```

**Response:**
```json
{
  "success": true,
  "component": {
    "id": "clxy123abc",
    "name": "Dashboard",
    "title": "Dashboard Component",
    "description": "A reusable dashboard example",
    "prompt": "Use this for admin interfaces",
    "zipFile": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/component.zip?X-Amz-...",
    "screenshots": [
      {
        "id": "clxy111aaa",
        "platform": "DESKTOP",
        "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-desktop.png?X-Amz-...",
        "s3Key": "Dashboard/screenshot-desktop.png",
        "bucket": "s3-brandsync-strapi-stage-01",
        "expiresIn": 3600,
        "expiresAt": "2026-03-10T11:00:00Z",
        "generatedAt": "2026-03-10T10:00:00Z",
        "isTemporary": true
      },
      {
        "id": "clxy222bbb",
        "platform": "TABLET",
        "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-tablet.png?X-Amz-...",
        "s3Key": "Dashboard/screenshot-tablet.png",
        "bucket": "s3-brandsync-strapi-stage-01",
        "expiresIn": 3600,
        "expiresAt": "2026-03-10T11:00:00Z",
        "generatedAt": "2026-03-10T10:00:00Z",
        "isTemporary": true
      },
      {
        "id": "clxy333ccc",
        "platform": "MOBILE",
        "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-mobile.png?X-Amz-...",
        "s3Key": "Dashboard/screenshot-mobile.png",
        "bucket": "s3-brandsync-strapi-stage-01",
        "expiresIn": 3600,
        "expiresAt": "2026-03-10T11:00:00Z",
        "generatedAt": "2026-03-10T10:00:00Z",
        "isTemporary": true
      }
    ],
    "category": {
      "id": "clxy999zzz",
      "code": "CONST",
      "name": "Construction"
    },
    "tags": ["dashboard", "admin", "ui"],
    "uploadedBy": "admin@example.com",
    "uploadedAt": "2026-02-20T10:00:00Z",
    "s3Path": "Dashboard/"
  }
}
```

**Notes:**
- All three platform screenshots (desktop, tablet, mobile) are **required**
- Screenshot URLs are presigned and expire after 1 hour (3600 seconds)
- Screenshots include enhanced metadata with S3 details and expiration information
- Accepted image formats: PNG, JPG, JPEG, GIF, WebP, SVG
- `categoryId` must be a valid, active category ID or the request will fail
- `category` will be null in response if no categoryId was provided

**Errors:**
- `400` - Missing required fields (componentName, zipFile, or any screenshot), or invalid categoryId
- `409` - Component already exists
- `413` - File too large (max 10MB per file)

---

### 9. Update Component

Update an existing component metadata, ZIP file, or screenshots.

**Endpoint:** `PUT /admin/components/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Parameters:**
- `id` - Component ID

**Content-Type:** `multipart/form-data`

**Form Fields:** All fields are optional except when updating screenshots

| Field | Required | Notes |
|-------|----------|-------|
| `title` | No | Update component title |
| `description` | No | Update component description |
| `prompt` | No | Update AI prompt |
| `categoryId` | No | Update category (use empty string "" to remove category) |
| `tags` | No | Update tags (comma-separated or JSON array) |
| `zipFile` | No | Update component ZIP file |
| `screenshotDesktop` | Conditional* | Desktop screenshot |
| `screenshotTablet` | Conditional* | Tablet screenshot |
| `screenshotMobile` | Conditional* | Mobile screenshot |

**\*Screenshot Update Rule:** If updating screenshots, **all three platforms are required**. You cannot update just one or two platforms.

**Request:**
```javascript
const formData = new FormData();
formData.append('title', 'Updated Dashboard Component');
formData.append('zipFile', newZipFile); // Optional

// If updating screenshots, include all three:
formData.append('screenshotDesktop', newDesktopFile);
formData.append('screenshotTablet', newTabletFile);
formData.append('screenshotMobile', newMobileFile);

fetch('https://mcp.brand.dev.egsync.com/admin/components/clxy123abc', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  },
  body: formData
})
```

**Response:**
```json
{
  "success": true,
  "id": "clxy123abc",
  "name": "Dashboard",
  "zipFileUpdated": true,
  "screenshotsUpdated": true,
  "zipFile": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/component.zip?X-Amz-...",
  "screenshots": [
    {
      "id": "clxy111aaa",
      "platform": "DESKTOP",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-desktop.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-desktop.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true
    },
    {
      "id": "clxy222bbb",
      "platform": "TABLET",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-tablet.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-tablet.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true
    },
    {
      "id": "clxy333ccc",
      "platform": "MOBILE",
      "url": "https://s3-brandsync-strapi-stage-01.s3.amazonaws.com/Dashboard/screenshot-mobile.png?X-Amz-...",
      "s3Key": "Dashboard/screenshot-mobile.png",
      "bucket": "s3-brandsync-strapi-stage-01",
      "expiresIn": 3600,
      "expiresAt": "2026-03-10T11:00:00Z",
      "generatedAt": "2026-03-10T10:00:00Z",
      "isTemporary": true
    }
  ],
  "category": {
    "id": "clxy999zzz",
    "code": "CONST",
    "name": "Construction"
  },
  "tags": ["dashboard", "admin", "ui"],
  "updatedBy": "admin@example.com",
  "updatedAt": "2026-02-20T11:00:00Z"
}
```

**Errors:**
- `400` - If updating screenshots but missing one or more platform screenshots, or invalid categoryId
- `404` - Component not found

---

### 10. Delete Component

Delete a component and all its files.

**Endpoint:** `DELETE /admin/components/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Parameters:**
- `id` - Component ID

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/admin/components/clxy123abc', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:**
```json
{
  "success": true,
  "id": "clxy123abc",
  "name": "Dashboard",
  "deletedFiles": 5,
  "deletedBy": "admin@example.com",
  "deletedAt": "2026-02-20T12:00:00Z"
}
```

---

### 11. List All Components (Admin View)

Get all components with full details (including prompts).

**Endpoint:** `GET /admin/components`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/admin/components', {
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:** Same format as `GET /components` but includes `prompt` field in the list.

---

### 12. Create Category

Create a new category for organizing components.

**Endpoint:** `POST /categories`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "code": "CONST",
  "name": "Construction",
  "description": "Components for construction-related projects",
  "active": true
}
```

**Fields:**
- `code` (required): Unique category code (alphanumeric, underscores, hyphens only). Will be converted to uppercase.
- `name` (required): Category display name (must be unique)
- `description` (optional): Category description
- `active` (optional): Whether category is active (default: true)

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/categories', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'CONST',
    name: 'Construction',
    description: 'Components for construction-related projects',
    active: true
  })
})
```

**Response:**
```json
{
  "success": true,
  "category": {
    "id": "clxy999zzz",
    "code": "CONST",
    "name": "Construction",
    "description": "Components for construction-related projects",
    "active": true,
    "createdAt": "2026-03-10T10:00:00Z",
    "updatedAt": "2026-03-10T10:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields (code, name) or invalid code format
- `409` - Category with that code or name already exists

---

### 13. Update Category

Update an existing category.

**Endpoint:** `PUT /categories/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Parameters:**
- `id` - Category ID

**Content-Type:** `application/json`

**Request Body:** All fields are optional
```json
{
  "code": "CONSTRUCTION",
  "name": "Construction Division",
  "description": "Updated description",
  "active": false
}
```

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/categories/clxy999zzz', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Construction Division',
    active: false
  })
})
```

**Response:**
```json
{
  "success": true,
  "category": {
    "id": "clxy999zzz",
    "code": "CONSTRUCTION",
    "name": "Construction Division",
    "description": "Updated description",
    "active": false,
    "componentCount": 5,
    "updatedAt": "2026-03-10T11:00:00Z"
  }
}
```

**Errors:**
- `400` - Invalid code format
- `404` - Category not found
- `409` - Code or name conflicts with existing category

---

### 14. Delete Category

Delete a category. Associated components will have their categoryId set to NULL.

**Endpoint:** `DELETE /categories/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Parameters:**
- `id` - Category ID

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/categories/clxy999zzz', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:**
```json
{
  "success": true,
  "message": "Category \"Construction\" deleted successfully",
  "affectedComponents": 5
}
```

**Note:** Deleting a category does NOT delete components. Components in that category will have their `categoryId` set to null.

---

### 15. Upload Design Tokens

Upload or update the design tokens CSS file.

**Endpoint:** `POST /admin/tokens`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (required): CSS file containing design tokens

**Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', cssFileInput.files[0]); // Must be a .css file

fetch('https://mcp.brand.dev.egsync.com/admin/tokens', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  },
  body: formData
})
```

**Response:**
```json
{
  "success": true,
  "file": "_tokens.css",
  "s3Path": "s3://bucket/_tokens.css",
  "updatedBy": "admin@example.com",
  "updatedAt": "2026-02-24T10:00:00Z"
}
```

**Notes:**
- Only CSS files are accepted
- File is automatically named `_tokens.css` in storage
- Previous tokens file is overwritten
- Cache is automatically invalidated

---

### 16. Create User

Create a new user with an access token.

**Endpoint:** `POST /users`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "role": "USER",
  "expiresInDays": 365
}
```

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    name: 'New User',
    role: 'USER',
    expiresInDays: 365
  })
})
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clxy789ghi",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "USER",
    "active": true,
    "createdAt": "2026-02-20T10:00:00Z"
  },
  "token": {
    "id": "clxy999xyz",
    "token": "b8g9f4e3d2c1...64-char-hex-string...",
    "role": "USER",
    "expiresAt": "2027-02-20T10:00:00Z",
    "createdAt": "2026-02-20T10:00:00Z"
  },
  "createdBy": "admin@example.com"
}
```

**⚠️ Important:** Save the token from the response! It's only shown once.

---

### 17. List Users

Get a list of all users.

**Endpoint:** `GET /users`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Query Parameters:**
- `active` (optional) - Filter by active status (true/false)
- `role` (optional) - Filter by role (USER, ADMIN, SUPER_ADMIN)

**Request:**
```javascript
// List all users
fetch('https://mcp.brand.dev.egsync.com/users', {
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})

// List only active admins
fetch('https://mcp.brand.dev.egsync.com/users?active=true&role=ADMIN', {
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:**
```json
{
  "users": [
    {
      "id": "clxy123abc",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "ADMIN",
      "active": true,
      "createdAt": "2026-02-19T12:00:00Z",
      "updatedAt": "2026-02-19T12:00:00Z",
      "tokenCount": 3,
      "componentCount": 5
    }
  ],
  "total": 1
}
```

---

### 18. Get User Details

Get detailed information about a specific user.

**Endpoint:** `GET /users/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/users/clxy123abc', {
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:**
```json
{
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "active": true,
    "createdAt": "2026-02-19T12:00:00Z",
    "updatedAt": "2026-02-19T12:00:00Z",
    "tokens": [
      {
        "id": "clxy789ghi",
        "token": "a7f8e3d2...c1b9f4a6",
        "role": "USER",
        "revoked": false,
        "expiresAt": null,
        "lastUsedAt": "2026-02-20T10:30:00Z",
        "createdAt": "2026-02-19T12:00:00Z"
      }
    ],
    "components": [
      {
        "id": "clxy456def",
        "name": "LoginButton",
        "title": "Login Button Component",
        "createdAt": "2026-02-19T14:00:00Z"
      }
    ]
  }
}
```

---

### 19. Update User

Update user information.

**Endpoint:** `PUT /users/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "ADMIN",
  "active": true
}
```

**Request:**
```javascript
fetch('https://mcp.brand.dev.egsync.com/users/clxy123abc', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Updated Name',
    role: 'ADMIN'
  })
})
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "name": "Updated Name",
    "role": "ADMIN",
    "active": true,
    "updatedAt": "2026-02-20T11:00:00Z"
  },
  "updatedBy": "admin@example.com"
}
```

---

### 20. Deactivate User

Deactivate a user account.

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (ADMIN or SUPER_ADMIN)

**Query Parameters:**
- `revoke` (optional) - Set to "true" to revoke all user's tokens

**Request:**
```javascript
// Deactivate user and revoke all tokens
fetch('https://mcp.brand.dev.egsync.com/users/clxy123abc?revoke=true', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "deactivated": true,
    "tokensRevoked": true
  },
  "deactivatedBy": "admin@example.com"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed description (optional)"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 413 | Payload Too Large - File exceeds max size (50MB) |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Example Error Response

```json
{
  "error": "Component already exists",
  "message": "Use PUT /admin/components/:name to update"
}
```

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per user
- Returns `429 Too Many Requests` when exceeded

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645456789
```

---

## Example Integrations

### React Component Library Browser

```jsx
import { useState, useEffect } from 'react';

const API_BASE = 'https://mcp.brand.dev.egsync.com';
const TOKEN = 'your-token-here';

function ComponentBrowser() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch(`${API_BASE}/components`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const data = await response.json();
      setComponents(data.components);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComponentDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/components/${id}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const data = await response.json();
      setSelectedComponent(data);
    } catch (error) {
      console.error('Failed to fetch component details:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="component-browser">
      <div className="component-list">
        <h2>Components</h2>
        {components.map(component => (
          <div
            key={component.id}
            className="component-card"
            onClick={() => fetchComponentDetails(component.id)}
          >
            {component.screenshots?.find(s => s.platform === 'DESKTOP') && (
              <img
                src={component.screenshots.find(s => s.platform === 'DESKTOP').url}
                alt={component.title}
              />
            )}
            <h3>{component.title || component.name}</h3>
            <p>{component.description}</p>
            <div className="tags">
              {component.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedComponent && (
        <div className="component-detail">
          <h2>{selectedComponent.title}</h2>
          <p>{selectedComponent.description}</p>

          {/* Platform Screenshots */}
          <div className="screenshots">
            <h3>Screenshots:</h3>
            {selectedComponent.screenshots?.map(screenshot => (
              <div key={screenshot.platform} className="screenshot">
                <h4>{screenshot.platform}</h4>
                <img src={screenshot.url} alt={`${screenshot.platform} view`} />
              </div>
            ))}
          </div>

          <div className="prompt">
            <h3>AI Prompt:</h3>
            <p>{selectedComponent.prompt}</p>
          </div>
          <a
            href={selectedComponent.zipFile}
            download
            className="download-btn"
          >
            Download ZIP
          </a>
        </div>
      )}
    </div>
  );
}

export default ComponentBrowser;
```

### Admin Upload Form

```jsx
function ComponentUploadForm({ adminToken }) {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.target);

    try {
      const response = await fetch(
        'https://mcp.brand.dev.egsync.com/admin/components',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      alert(`Component uploaded successfully: ${result.component.name}`);
      e.target.reset();
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload Component</h2>

      <input
        type="text"
        name="componentName"
        placeholder="Component Name (e.g., Dashboard)"
        required
      />

      <input
        type="text"
        name="title"
        placeholder="Display Title"
      />

      <textarea
        name="description"
        placeholder="Description"
      />

      <textarea
        name="prompt"
        placeholder="AI Prompt for this component"
      />

      <input
        type="text"
        name="categoryId"
        placeholder="Category ID (optional)"
      />

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated or JSON array)"
      />

      <div>
        <label>Component ZIP File:</label>
        <input
          type="file"
          name="zipFile"
          accept=".zip"
          required
        />
      </div>

      <div>
        <label>Desktop Screenshot:</label>
        <input
          type="file"
          name="screenshotDesktop"
          accept="image/*"
          required
        />
      </div>

      <div>
        <label>Tablet Screenshot:</label>
        <input
          type="file"
          name="screenshotTablet"
          accept="image/*"
          required
        />
      </div>

      <div>
        <label>Mobile Screenshot:</label>
        <input
          type="file"
          name="screenshotMobile"
          accept="image/*"
          required
        />
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Component'}
      </button>
    </form>
  );
}
```

---

## Quick Reference

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/auth/token` | No | Exchange OAuth user for token |
| `GET` | `/users/me` | User | Get current user |
| `GET` | `/components` | User | List components (with filters) |
| `GET` | `/components/:id` | User | Get component details |
| `GET` | `/categories` | User | List categories |
| `GET` | `/categories/:id` | User | Get category details |
| `GET` | `/categories/:id/components` | User | Get components by category |
| `POST` | `/admin/components` | Admin | Upload component |
| `PUT` | `/admin/components/:id` | Admin | Update component |
| `DELETE` | `/admin/components/:id` | Admin | Delete component |
| `GET` | `/admin/components` | Admin | List components (admin) |
| `POST` | `/categories` | Admin | Create category |
| `PUT` | `/categories/:id` | Admin | Update category |
| `DELETE` | `/categories/:id` | Admin | Delete category |
| `POST` | `/admin/tokens` | Admin | Upload design tokens CSS |
| `POST` | `/users` | Admin | Create user |
| `GET` | `/users` | Admin | List users |
| `GET` | `/users/:id` | Admin | Get user details |
| `PUT` | `/users/:id` | Admin | Update user |
| `DELETE` | `/users/:id` | Admin | Deactivate user |

---

## Support

For issues or questions:
- Technical Issues: Contact DevOps team
- API Questions: Contact Backend team
- Feature Requests: Create issue in GitHub repository

**Last Updated:** March 10, 2026
