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

