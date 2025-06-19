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
- A JWT token is generated and returned upon successful registration
- Email addresses must be unique in the system
- All fields (firstname, email, password) are required, (lastname) is option you choose

