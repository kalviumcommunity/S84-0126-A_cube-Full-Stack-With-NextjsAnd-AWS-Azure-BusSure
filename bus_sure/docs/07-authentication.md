# Authentication System Guide

This guide covers the secure authentication system implemented in the BusSure application using bcrypt for password hashing and JWT (JSON Web Token) for session management.

## 🔐 Authentication vs Authorization

| Concept | Description | Example |
|---------|-------------|---------|
| **Authentication** | Verifying who the user is | User logs in with email and password |
| **Authorization** | Determining what the user can do | Admin can access admin routes, regular users cannot |

## 🏗️ API Structure

```
app/api/
├── auth/
│   ├── signup/
│   │   └── route.ts     # User registration
│   └── login/
│       └── route.ts     # User login
└── users/
    └── route.ts         # Protected user profile endpoint
```

## 🔧 Dependencies

The following packages are required for authentication:

```bash
npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken
```

- **bcrypt**: For secure password hashing and verification
- **jsonwebtoken**: For JWT token generation and validation

## 📝 Database Schema

The User model includes authentication fields:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  password  String    // Hashed password using bcrypt
  phone     String?
  role      String    @default("CUSTOMER")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  // ... other relations
}
```

## 🚀 API Endpoints

### 1. Signup Endpoint

**POST** `/api/auth/signup`

Creates a new user account with secure password hashing.

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

#### Success Response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses:
- **400**: Validation errors (missing fields, invalid email, weak password)
- **400**: User already exists
- **500**: Internal server error

#### Security Features:
- Password hashing with bcrypt (10 salt rounds)
- Email format validation
- Password strength validation (minimum 6 characters)
- Duplicate email prevention

### 2. Login Endpoint

**POST** `/api/auth/login`

Authenticates user credentials and returns a JWT token.

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

#### Error Responses:
- **400**: Missing email or password
- **401**: Invalid credentials
- **500**: Internal server error

#### Security Features:
- Password verification using bcrypt
- JWT token generation with 24-hour expiry
- User information included in token payload

### 3. Protected User Profile Endpoint

**GET** `/api/users`

Returns the authenticated user's profile information.

#### Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "policies": [],
    "claims": []
  }
}
```

#### Error Responses:
- **401**: Authorization token missing
- **403**: Invalid or expired token
- **404**: User not found
- **500**: Internal server error

## 🔒 Security Implementation

### Password Security
- **Hashing**: Uses bcrypt with 10 salt rounds
- **No Plain Text**: Passwords are never stored in plain text
- **Validation**: Minimum 6 characters required

### JWT Token Security
- **Secret Key**: Uses environment variable `JWT_SECRET`
- **Expiration**: Tokens expire after 24 hours
- **Payload**: Contains user ID, email, and role
- **Verification**: All protected routes verify token validity

### Authentication Middleware
The `lib/auth.ts` utility provides:
- Token verification functions
- Token extraction from request headers
- JWT payload type definitions

## 🧪 Testing the APIs

### Using cURL

#### Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "mypassword123",
    "phone": "+1234567890"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "mypassword123"
  }'
```

#### Access Protected Route:
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Using the Test Script

Run the automated test script:

```bash
npm run dev  # Start the development server first
npm run test:auth  # Run authentication tests
```

Or directly:
```bash
tsx scripts/test-auth-apis.ts
```

## 🔧 Environment Variables

Add to your `.env.local` file:

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production-make-it-long-and-random"
DATABASE_URL="file:./dev.db"
```

**Important**: Use a strong, unique JWT secret in production!

## 🚀 Production Considerations

### Security Best Practices:
1. **Strong JWT Secret**: Use a long, random secret key
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Storage**: Consider secure storage options (httpOnly cookies vs localStorage)
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Password Policy**: Enforce stronger password requirements
6. **Account Lockout**: Implement account lockout after failed attempts

### Token Management:
- **Expiration**: Current tokens expire in 24 hours
- **Refresh Strategy**: Consider implementing refresh tokens for longer sessions
- **Revocation**: Implement token blacklisting if needed

### Monitoring:
- Log authentication attempts
- Monitor for suspicious activity
- Track token usage patterns

## 🔄 Migration Notes

If you have existing users without passwords:
1. The migration adds a temporary password hash
2. Existing users will need to reset their passwords
3. Consider implementing a password reset flow

## 📚 Additional Resources

- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [JWT.io](https://jwt.io/) - JWT token debugger
- [OWASP Authentication Guidelines](https://owasp.org/www-project-authentication-cheat-sheet/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎯 Next Steps

1. Implement password reset functionality
2. Add email verification for new accounts
3. Implement refresh token mechanism
4. Add role-based authorization middleware
5. Set up rate limiting for authentication endpoints