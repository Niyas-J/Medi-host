# 📡 API Documentation

Complete API reference for Medi-Host backend.

## Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://your-backend.railway.app`

## Authentication
Currently, no authentication is required. For production, implement JWT or session-based auth for admin endpoints.

---

## Endpoints

### 1. Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Nearby Hospital Facility Finder API is running"
}
```

---

### 2. Get Nearby Facilities

**GET** `/api/nearby`

Fetch nearby hospitals, clinics, and pharmacies using Overpass API.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| lat | float | Yes | - | Latitude of user location |
| lon | float | Yes | - | Longitude of user location |
| radius | integer | No | 3000 | Search radius in meters (max: 10000) |

**Example Request:**
```
GET /api/nearby?lat=40.7128&lon=-74.0060&radius=5000
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 15,
  "facilities": [
    {
      "id": 123456789,
      "name": "City General Hospital",
      "type": "hospital",
      "latitude": 40.7150,
      "longitude": -74.0080,
      "address": "123 Main St",
      "phone": "+1 234-567-8900",
      "opening_hours": "24/7",
      "website": "https://cityhospital.com"
    }
  ]
}
```

**Error Responses:**

400 - Missing Parameters
```json
{
  "error": "Latitude and longitude are required"
}
```

504 - Timeout
```json
{
  "error": "Request to Overpass API timed out"
}
```

500 - Server Error
```json
{
  "error": "Failed to fetch data from Overpass API"
}
```

---

### 3. Create Appointment

**POST** `/api/appointments`

Create a new appointment booking.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1 234-567-8900",
  "date": "2025-10-25T14:30",
  "reason": "Annual checkup",
  "facility_name": "City General Hospital"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Max 100 characters |
| phone | string | Yes | Max 20 characters |
| date | string | Yes | ISO 8601 format or YYYY-MM-DDTHH:MM |
| reason | string | Yes | Max 200 characters |
| facility_name | string | No | Max 200 characters |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "id": 1,
    "name": "John Doe",
    "phone": "+1 234-567-8900",
    "date": "2025-10-25T14:30",
    "reason": "Annual checkup",
    "facility_name": "City General Hospital",
    "created_at": "2025-10-23T10:30:00"
  }
}
```

**Error Responses:**

400 - Missing Fields
```json
{
  "error": "name is required"
}
```

500 - Database Error
```json
{
  "error": "Failed to create appointment"
}
```

---

### 4. Create Emergency Alert

**POST** `/api/emergency`

Send an emergency alert with location data.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "message": "Emergency alert triggered",
  "user_info": "Name: John Doe, Phone: +1 234-567-8900"
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| latitude | float | Yes | User's latitude |
| longitude | float | Yes | User's longitude |
| message | string | No | Emergency message (max 500 chars) |
| user_info | string | No | User information (max 200 chars) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "alert": {
    "id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "message": "Emergency alert triggered",
    "user_info": "Name: John Doe, Phone: +1 234-567-8900",
    "created_at": "2025-10-23T10:35:00"
  }
}
```

**Error Responses:**

400 - Missing Location
```json
{
  "error": "Location data is required"
}
```

---

### 5. Get All Appointments (Admin)

**GET** `/api/admin/appointments`

Retrieve all appointments for admin dashboard.

**⚠️ Note:** Add authentication middleware in production.

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "appointments": [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "+1 234-567-8900",
      "date": "2025-10-25T14:30",
      "reason": "Annual checkup",
      "facility_name": "City General Hospital",
      "created_at": "2025-10-23T10:30:00"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch appointments"
}
```

---

### 6. Get All Emergency Alerts (Admin)

**GET** `/api/admin/emergencies`

Retrieve all emergency alerts for admin dashboard.

**⚠️ Note:** Add authentication middleware in production.

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "alerts": [
    {
      "id": 1,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "message": "Emergency alert triggered",
      "user_info": "Name: John Doe, Phone: +1 234-567-8900",
      "created_at": "2025-10-23T10:35:00"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch emergency alerts"
}
```

---

## Database Schema

### Appointment Table
```sql
CREATE TABLE appointment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date VARCHAR(50) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    facility_name VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### EmergencyAlert Table
```sql
CREATE TABLE emergency_alert (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    message VARCHAR(500),
    user_info VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Rate Limiting

**Recommended Limits:**
- `/api/nearby`: 30 requests per minute
- `/api/appointments`: 10 requests per minute
- `/api/emergency`: 5 requests per minute
- `/api/admin/*`: 100 requests per minute

**Implementation:**
```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/nearby')
@limiter.limit("30 per minute")
def get_nearby_facilities():
    # ...
```

---

## CORS Configuration

**Development:**
```python
CORS(app)  # Allow all origins
```

**Production:**
```python
CORS(app, origins=[
    'https://your-frontend.netlify.app',
    'https://your-custom-domain.com'
])
```

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error
- `504` - Gateway Timeout

---

## Testing with cURL

### Get Nearby Facilities
```bash
curl "http://localhost:5000/api/nearby?lat=40.7128&lon=-74.0060&radius=3000"
```

### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "date": "2025-10-25T14:30",
    "reason": "Checkup",
    "facility_name": "Hospital"
  }'
```

### Create Emergency Alert
```bash
curl -X POST http://localhost:5000/api/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "message": "Emergency",
    "user_info": "John Doe"
  }'
```

### Get Appointments (Admin)
```bash
curl http://localhost:5000/api/admin/appointments
```

---

## Integration Examples

### JavaScript (Axios)
```javascript
import axios from 'axios';

// Get nearby facilities
const facilities = await axios.get('/api/nearby', {
  params: {
    lat: 40.7128,
    lon: -74.0060,
    radius: 3000
  }
});

// Create appointment
const appointment = await axios.post('/api/appointments', {
  name: 'John Doe',
  phone: '+1234567890',
  date: '2025-10-25T14:30',
  reason: 'Checkup',
  facility_name: 'Hospital'
});
```

### Python (Requests)
```python
import requests

# Get nearby facilities
response = requests.get('http://localhost:5000/api/nearby', params={
    'lat': 40.7128,
    'lon': -74.0060,
    'radius': 3000
})
facilities = response.json()

# Create appointment
response = requests.post('http://localhost:5000/api/appointments', json={
    'name': 'John Doe',
    'phone': '+1234567890',
    'date': '2025-10-25T14:30',
    'reason': 'Checkup',
    'facility_name': 'Hospital'
})
appointment = response.json()
```

---

## Future Enhancements

- [ ] JWT authentication for admin endpoints
- [ ] Pagination for large datasets
- [ ] Filtering and sorting options
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API alternative
- [ ] API versioning (v1, v2)
- [ ] Request logging and analytics
- [ ] Swagger/OpenAPI documentation

---

## Support

For API issues or questions:
- GitHub Issues
- Email: your-email@example.com

**Last Updated:** October 2025

