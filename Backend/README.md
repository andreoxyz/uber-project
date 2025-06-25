# Uber Mean Backend API Documentation

## User Registration Endpoint

### POST /api/user/register

Register a new user in the system.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string",  // minimum 2 characters
    "lastname": "string"    // minimum 2 characters
  },
  "email": "string",        // valid email address
  "password": "string"      // minimum 6 characters
}
```

#### Validation Rules
- First name must be at least 2 characters long
- Last name must be at least 2 characters long
- Email must be a valid email address
- Password must be at least 6 characters long

#### Response

##### Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "Socketid": null
  },
  "token": "string"  // JWT authentication token
}
```

##### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### Notes
- The password is automatically hashed before storing in the database
- When retrieving a user from the database, the password field is excluded (`select: false`) for security reasons.
- A JWT token is generated and returned upon successful registration
- Email addresses must be unique in the system
- All fields (firstname, email, password) are required, (lastname) is option you choose

## User Login Endpoint

### POST /api/user/login

Authenticate a user and receive an access token.

#### Request Body

```json
{
  "email": "string",    // valid email address
  "password": "string"  // minimum 6 characters
}
```

#### Validation Rules
- Email must be a valid email address
- Password must be at least 6 characters long

#### Response

##### Success Response (200 OK)
```json
{
  "message": "User logged in successfully",
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "Socketid": null
  },
  "token": "string"  // JWT authentication token
}
```

##### Error Responses

###### Invalid Credentials (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

###### User Not Found (401 Not Found)
```json
{
  "message": "Invalid email or password"
}
```

###### Validation Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### Notes
- The password is compared with the hashed password stored in the database
- A new JWT token is generated and returned upon successful login
- For security reasons, the same error message is returned for both invalid email and invalid password

## Authentication

All protected endpoints require a JWT token to be included in the request headers:
```
Authorization: Bearer <token>
```

## Protected Endpoints

### GET /api/user/profile

Get the authenticated user's profile information. This endpoint requires authentication.

#### Request
No request body needed. Requires authentication token in headers and cookie.

#### Response

##### Success Response (200 OK)
```json
{
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "Socketid": null
  }
}
```

##### Error Responses

###### Unauthorized (401 Unauthorized)
```json
{
  "message": "Unauthorized access."
}
```

###### Token Blacklisted (401 Unauthorized)
```json
{
  "message": "Unauthorized access."
}
```

### POST /api/user/logout

Logout the currently authenticated user by blacklisting their token. This endpoint requires authentication.

#### Request
No request body needed. Requires authentication token in headers.

#### Response

##### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

##### Error Responses

###### Missing Token (401 Unauthorized)
```json
{
  "message": "Unauthorized access."
}
```

###### Invalid Token (401 Unauthorized)
```json
{
  "message": "Unauthorized access."
}
```

#### Notes
- The JWT token has an expiration time of 24 hours
- Once logged out, the token is added to a blacklist and cannot be reused
- Blacklisted tokens are automatically removed after 24 hours using MongoDB TTL index

## Captain Endpoints

### POST /api/captains/register

Register a new captain (driver) in the system.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string",  // minimum 2 characters
    "lastname": "string"    // minimum 2 characters
  },
  "email": "string",        // valid email address, will be converted to lowercase
  "password": "string",     // minimum 6 characters
  "vehicle": {
    "color": "string",      // minimum 2 characters
    "plate": "string",      // minimum 3 characters, must be unique
    "capacity": "number",   // minimum value of 1
    "vehicleType": "string" // must be one of: 'car', 'bike', 'auto'
  }
}
```

#### Validation Rules
- First name must be at least 2 characters long
- Email must be a valid email address
- Password must be at least 6 characters long
- Vehicle color is required
- Vehicle plate number must be at least 3 characters and must be unique
- Vehicle capacity must be at least 1
- Vehicle type must be one of: 'car', 'bike', 'auto'

#### Response

##### Success Response (201 Created)
```json
{
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "status": "inactive",
    "socketId": null,
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": number,
      "vehicleType": "string"
    },
    "location": {
      "lat": null,
      "lng": null
    }
  },
  "token": "string"  // JWT authentication token
}
```

##### Error Responses

###### Validation Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

###### Duplicate Email/Plate (409 Conflict)
```json
{
  "message": "Email address or vehicle plate number already exists"
}
```

#### Notes
- The password is automatically hashed before storing in the database
- Email addresses and vehicle plate numbers must be unique in the system
- All captains start with 'inactive' status by default
- Location coordinates (lat/lng) are initially null and updated when the captain is active
- The JWT token is valid for 24 hours
- All fields are required except lastname

### POST /api/captains/login

Authenticate a captain and receive an access token.

#### Request Body

```json
{
  "email": "string",    // valid email address
  "password": "string"  // minimum 6 characters
}
```

#### Validation Rules
- Email must be a valid email address
- Password must be at least 6 characters long

#### Response

##### Success Response (200 OK)
```json
{
  "message": "Captain logged in successfully",
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": number,
      "vehicleType": "string"
    },
    "token": "string"  // JWT authentication token
  }
}
```

##### Error Responses

###### Invalid Credentials (400 Bad Request)
```json
{
  "message": "Invalid email or password"
}
```

#### Notes
- The password is compared with the hashed password stored in the database
- A JWT token is generated and returned upon successful login
- The token is also set in cookies for additional security
- For security reasons, the same error message is returned for both invalid email and invalid password

### GET /api/captains/profile

Get the authenticated captain's profile information. This endpoint requires authentication.

#### Request
No request body needed. Requires authentication token in headers or cookies.

#### Response

##### Success Response (200 OK)
```json
{
  "message": "Captain profile fetched successfully",
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "status": "string",
    "socketId": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": number,
      "vehicleType": "string"
    },
    "location": {
      "lat": number,
      "lng": number
    }
  }
}
```

##### Error Response (401 Unauthorized)
```json
{
  "message": "Unauthorized access"
}
```

### POST /api/captains/logout

Logout the currently authenticated captain by blacklisting their token.

#### Request
No request body needed. Requires authentication token in headers or cookies.

#### Response

##### Success Response (200 OK)
```json
{
  "message": "Captain logged out successfully"
}
```

##### Error Response (401 Unauthorized)
```json
{
  "message": "Unauthorized access"
}
```

#### Notes
- The token is added to a blacklist upon logout
- The token cookie is cleared
- Blacklisted tokens cannot be reused

## Authentication Middleware

The API uses two separate authentication middlewares for users and captains:

### User Authentication (`authUser`)
- Validates JWT tokens for user endpoints
- Checks token in both cookies and Authorization header
- Verifies token hasn't been blacklisted
- Attaches user object to request (`req.user`)

### Captain Authentication (`authCaptain`)
- Validates JWT tokens for captain endpoints
- Checks token in both cookies and Authorization header
- Verifies token hasn't been blacklisted
- Attaches captain object to request (`req.captain`)

#### Token Format
```
Authorization: Bearer <token>
```

#### Common Error Responses

##### Missing Token (401 Unauthorized)
```json
{
  "message": "Unauthorized access"
}
```

##### Blacklisted Token (401 Unauthorized)
```json
{
  "message": "Unauthorized access."
}
```

#### Security Features
- Tokens expire after 24 hours
- Blacklisted tokens are automatically removed after 24 hours
- Supports both cookie-based and header-based token validation
- Password field is excluded from database queries by default
- Tokens are invalidated upon logout

