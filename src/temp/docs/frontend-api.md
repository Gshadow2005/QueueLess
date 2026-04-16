# QueueLess Backend API Documentation for Frontend

## Overview
This document lists the backend APIs required for frontend integration with QueueLess. The backend is a Django/Django REST Framework project with apps for queue tracking, notifications, and mock data.

**Base URL**: `http://localhost:8000/api/` (adjust for production)

**Authentication**: JWT tokens (login endpoint provides token). Include `Authorization: Bearer <token>` in headers for protected routes.

## Integration Flow
1. User authenticates (login/register).
2. Fetch available queues/institutions.
3. User joins a queue.
4. Track queue position/status (real-time via polling or WebSockets).
5. Receive notifications for position updates.
6. Leave queue if needed.

## API Endpoints

### 1. Authentication
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/login/` | Login user | `{ "email": "user@example.com", "password": "pass" }` | `{ "token": "jwt_token", "user_id": 1 }` |
| POST | `/auth/register/` | Register user | `{ "email", "password", "name" }` | `{ "user_id": 1, "message": "Registered" }` |

### 2. Institutions (Mock Data)
| Method | Endpoint | Description | Protected? |
|--------|----------|-------------|------------|
| GET | `/institutions/` | List institutions/queues locations | No |
| GET | `/institutions/<id>/` | Institution details | No |

**Response example**:
```
[
  {
    "id": 1,
    "name": "Bank ABC",
    "address": "123 Main St",
    "status": "open"
  }
]
```

### 3. Queues (Queue Tracker)
| Method | Endpoint | Description | Request Body | Protected? |
|--------|----------|-------------|--------------|------------|
| GET | `/queues/` | List active queues | - | No |
| POST | `/queues/<id>/join/` | Join queue | `{ "user_id": 1 }` | Yes |
| GET | `/queues/<id>/status/` | Get queue position/status | - | Yes |
| POST | `/queues/<id>/leave/` | Leave queue | - | Yes |

**Join Response**:
```
{ 
  "position": 5, 
  "estimated_time": "10 mins",
  "queue_id": 1 
}
```

### 4. Notifications
| Method | Endpoint | Description | Protected? |
|--------|----------|-------------|------------|
| GET | `/notifications/` | List user notifications | Yes |
| POST | `/notifications/<id>/read/` | Mark as read | Yes |

**Note**: Real-time updates via WebSockets at `ws://localhost:8000/ws/queue/<id>/` or polling `/queues/<id>/status/`.

## Error Handling
Standard DRF errors:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Response format: `{ "error": "Message" }`

## Testing
Run backend: `python manage.py runserver`
Use Postman/Insomnia to test endpoints.

## Next Steps for Backend
- Implement views/serializers in `queue_tracker/views.py`
- Add URLs to `queue_tracker/urls.py` and include in main `urls.py`
- Add DRF routers for auto URL generation
- Setup JWT auth (djangorestframework-simplejwt)

This covers essential APIs. Update as backend endpoints are implemented. Mwaa

