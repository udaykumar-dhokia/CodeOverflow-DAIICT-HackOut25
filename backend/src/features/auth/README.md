# Authentication API Documentation

This API provides authentication endpoints for two types of users: **Project Developers** and **Companies**. Both user types have separate registration, login, and logout functionality.

## Base URL
```
/auth
```

## Authentication Flow
- JWT tokens are used for authentication
- Tokens are stored as HTTP-only cookies for security
- Cookie expiration is set to 24 hours
- Passwords are hashed before storage

## Endpoints

### Project Developer Endpoints

#### Register Project Developer
```http
POST /project-developer/register
```

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "asset_type": "string (optional)"
}
```

**Response:**
- **201 Created** - Registration successful
```json
{
  "message": "Registration successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "asset_type": "renewable"
  }
}
```

- **400 Bad Request** - Missing required fields
- **409 Conflict** - User already exists
- **500 Internal Server Error** - Server error

#### Login Project Developer
```http
POST /project-developer/login
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- **200 OK** - Login successful
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_string"
}
```

- **400 Bad Request** - Missing required fields
- **401 Unauthorized** - Invalid credentials
- **500 Internal Server Error** - Server error

#### Logout Project Developer
```http
POST /project-developer/logout
```

**Response:**
- **200 OK** - Logout successful
```json
{
  "message": "Logout successful"
}
```

- **500 Internal Server Error** - Failed to log out

### Company Endpoints

#### Register Company
```http
POST /company/register
```

**Request Body:**
```json
{
  "name": "string (required)",
  "website": "string (required)",
  "GSTIN": "string (optional)",
  "about_us": "string (required)",
  "company_size": "string (required)",
  "location": "string (required)",
  "email": "string (required)",
  "contact": "string (required)",
  "password": "string (required)",
  "asset_type": "string (required)",
  "latitude": "number (optional)",
  "longitude": "number (optional)"
}
```

**Response:**
- **201 Created** - Registration successful
```json
{
  "message": "Registration successful",
  "company": {
    "_id": "company_id",
    "name": "Tech Corp",
    "email": "contact@techcorp.com",
    "website": "https://techcorp.com",
    "location": "Mumbai, India",
    "company_size": "50-100"
  }
}
```

- **400 Bad Request** - Missing required fields
- **409 Conflict** - Company already exists
- **500 Internal Server Error** - Server error

#### Login Company
```http
POST /company/login
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- **200 OK** - Login successful
```json
{
  "message": "Login successful",
  "company": {
    "_id": "company_id",
    "name": "Tech Corp",
    "email": "contact@techcorp.com"
  },
  "token": "jwt_token_string"
}
```

- **400 Bad Request** - Missing required fields
- **401 Unauthorized** - Invalid credentials
- **500 Internal Server Error** - Server error

#### Logout Company
```http
POST /company/logout
```

**Response:**
- **200 OK** - Logout successful
```json
{
  "message": "Logout successful"
}
```

- **500 Internal Server Error** - Failed to log out

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- **Secure Cookies**: Cookies are marked as secure in production environments
- **SameSite Protection**: CSRF protection through SameSite cookie attribute
- **Token Expiration**: Tokens expire after 24 hours

## Environment Configuration

The API behavior changes based on the `NODE_ENV` environment variable:

- **Production**: Cookies are secure and use `sameSite: "none"`
- **Development**: Cookies use `sameSite: "lax"` and are not secure

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request (missing/invalid data)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (resource already exists)
- `500` - Internal server error

## Usage Examples

### Registering a Project Developer
```bash
curl -X POST http://localhost:3000/auth/project-developer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "asset_type": "solar"
  }'
```

### Registering a Company
```bash
curl -X POST http://localhost:3000/auth/company/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Energy Corp",
    "website": "https://greenenergy.com",
    "about_us": "Leading renewable energy company",
    "company_size": "100-500",
    "location": "Mumbai, India",
    "email": "contact@greenenergy.com",
    "contact": "+91-9876543210",
    "password": "securepassword123",
    "asset_type": "wind"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/project-developer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```