## Base URLs
```
/api/wind
```

## Overview

- **Wind Energy**: Records with latitude, longitude, and wind speed measurements

## Wind Energy Endpoints

### Create Wind Record
```http
POST /api/wind/create
```

Creates a new wind energy record with location and speed data.

**Request Body:**
```json
{
  "latitude": "number (required)",
  "longitude": "number (required)",
  "speed": "number (required)"
}
```

**Parameters:**
- `latitude` - Geographic latitude coordinate
- `longitude` - Geographic longitude coordinate
- `speed` - Wind speed measurement

**Response:**
- **201 Created** - Wind record created successfully
```json
{
  "message": "Wind record created successfully",
  "wind": {
    "_id": "record_id",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "speed": 25.3,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

- **400 Bad Request** - Missing required fields
```json
{
  "message": "Missing required fields: latitude, longitude, or speed."
}
```

- **500 Internal Server Error** - Server error
```json
{
  "message": "Internal Server Error."
}
```

### Get All Wind Records
```http
GET /api/wind/get-all
```

Retrieves all wind energy records from the database.

**Response:**
- **200 OK** - Records retrieved successfully
```json
{
  "message": "Wind records retrieved successfully",
  "winds": [
    {
      "_id": "record_id_1",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "speed": 25.3,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "record_id_2",
      "latitude": 28.7041,
      "longitude": 77.1025,
      "speed": 18.7,
      "createdAt": "2024-01-15T11:45:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

- **500 Internal Server Error** - Server error
```json
{
  "message": "Internal Server Error."
}
```

## Data Models

### Wind Energy Record
```typescript
interface WindInterface {
  _id: string;
  latitude: number;
  longitude: number;
  speed: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes:

- `200` - Success (GET requests)
- `201` - Resource created successfully (POST requests)
- `400` - Bad request (missing or invalid data)
- `500` - Internal server error

## Usage Examples

### Create a Wind Record
```bash
curl -X POST http://localhost:3000/api/wind/create \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 19.0760,
    "longitude": 72.8777,
    "speed": 25.3
  }'
```

### Retrieve All Wind Records
```bash
curl -X GET http://localhost:3000/api/wind/get-all \
  -H "Content-Type: application/json"
```