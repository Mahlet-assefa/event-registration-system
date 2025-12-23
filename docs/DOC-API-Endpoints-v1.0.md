# Event Registration System API Documentation

## Authentication

### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "user1",
    "password": "password123",
    "isAdmin": false
  }
  ```

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```

## Events

### List Events
- **URL**: `/api/events`
- **Method**: `GET`

### Create Event (Admin)
- **URL**: `/api/events`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Tech Conf",
    "date": "2025-05-20",
    "description": "A great conference"
  }
  ```

### Register for Event
- **URL**: `/api/events/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userId": "uuid-string",
    "eventId": "uuid-string"
  }
  ```
