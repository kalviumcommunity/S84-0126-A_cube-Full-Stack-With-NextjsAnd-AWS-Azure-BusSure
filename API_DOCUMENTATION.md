# API Documentation

## Authentication APIs

### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": "user_123"
}
```

### POST `/api/auth/login`
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST `/api/auth/logout`
End the user's session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/api/auth/reset-password`
Request a password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

## User Management APIs

### GET `/api/users`
Get all users (admin only).

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/api/users/:id`
Get a specific user by ID.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

## Refund APIs

### POST `/api/refunds/create`
Create a new refund request.

**Request Body:**
```json
{
  "ticketId": "ticket_123",
  "reason": "Trip cancelled",
  "amount": 150.00
}
```

**Response:**
```json
{
  "success": true,
  "refundId": "refund_123",
  "status": "pending",
  "estimatedProcessingTime": "3-5 business days"
}
```

## Claims APIs

### POST `/api/claims/process`
Process a claim.

**Request Body:**
```json
{
  "claimId": "claim_123",
  "action": "approve",
  "notes": "All documents verified"
}
```

**Response:**
```json
{
  "success": true,
  "claim": {
    "id": "claim_123",
    "status": "approved",
    "processedAt": "2026-02-12T10:30:00Z"
  }
}
```

### GET `/api/claims/optimized`
Get optimized claims list with caching.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "claims": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

## File Management APIs

### POST `/api/upload`
Upload a file.

**Request:** Multipart form data with file

**Response:**
```json
{
  "success": true,
  "fileUrl": "https://storage.example.com/files/abc123.pdf",
  "fileId": "file_123"
}
```

### GET `/api/files`
List uploaded files.

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "file_123",
      "name": "document.pdf",
      "url": "https://storage.example.com/files/abc123.pdf",
      "uploadedAt": "2026-02-12T10:00:00Z"
    }
  ]
}
```

## Database Testing

### GET `/api/test-db`
Test database connection.

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2026-02-12T10:00:00Z"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```
