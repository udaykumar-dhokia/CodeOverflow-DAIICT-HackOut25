## Base URLs
```
/api/solar
```
## Overview
- **Solar Energy**: Records with latitude, longitude, and energy unit measurements

## Solar Energy Endpoints

### Create Solar Record
```http
POST /api/solar/create
```

Creates a new solar energy record with location and unit data.

**Request Body:**
```json
{
  "latitude": "number (required)",
  "longitude": "number (required)",
  "unit": "number (required)"
}
```

**Parameters:**
- `latitude` - Geographic latitude coordinate
- `longitude` - Geographic longitude coordinate  
- `unit` - Solar energy unit measurement

**Response:**
- **201 Created** - Solar record created successfully
```json
{
  "message": "Solar record created successfully",
  "solar": {
    "_id": "record_id",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "unit": 150.5,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

- **400 Bad Request** - Missing required fields
```json
{
  "message": "Missing required fields: latitude, longitude, or unit."
}
```

- **500 Internal Server Error** - Server error
```json
{
  "message": "Internal Server Error."
}
```

### Get All Solar Records
```http
GET /api/solar/get-all
```

Retrieves all solar energy records from the database.

**Response:**
- **200 OK** - Records retrieved successfully
```json
{
  "message": "Solar records retrieved successfully",
  "solars": [
    {
      "_id": "record_id_1",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "unit": 150.5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "record_id_2",
      "latitude": 28.7041,
      "longitude": 77.1025,
      "unit": 120.8,
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

## Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes:

- `200` - Success (GET requests)
- `201` - Resource created successfully (POST requests)
- `400` - Bad request (missing or invalid data)
- `500` - Internal server error

## Usage Examples

### Create a Solar Record
```bash
curl -X POST http://localhost:3000/api/solar/create \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 19.0760,
    "longitude": 72.8777,
    "unit": 150.5
  }'
```

### Retrieve All Solar Records
```bash
curl -X GET http://localhost:3000/api/solar/get-all \
  -H "Content-Type: application/json"
```