# Quick Start: JWT Authentication

## 🚀 Start Using JWT in 3 Steps

### Step 1: Set Environment Variable

⚠️ **Important**: The `JWT_SECRET` must be the same in both services!

Add to **both** `.env` files:

- `users-service/.env`
- `donation-service/.env`

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Step 2: Get a Token from Users Service

**Login to get a real JWT token:**

```bash
# First, make sure users-service is running on port 3002
curl -X POST http://localhost:3002/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your-password"
  }'
```

**Response:**

```json
{
  "user": { "id": "...", "email": "...", "personType": "DONOR" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copy the token** value from the response.

> 💡 **Tip**: If you don't have a user yet, register first at `POST http://localhost:3002/users`

### Step 3: Use Token in Donation Service

```bash
# Replace YOUR_JWT_TOKEN with the token from Step 2

# Create Donation (Protected ✅)
curl -X POST http://localhost:8080/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "PENDING",
    "content": "Need O+ blood urgently",
    "startDate": "2025-10-20T10:00:00.000Z",
    "bloodType": "O+",
    "location": {"latitude": -23.5505, "longitude": -46.6333},
    "userId": "user123"
  }'

# Update Status (Protected ✅)
curl -X PUT http://localhost:8080/donations/DONATION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "APPROVED"}'

# Delete Donation (Protected ✅)
curl -X DELETE http://localhost:8080/donations/DONATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📋 Protected Endpoints

| Endpoint                    | Auth Required |
| --------------------------- | ------------- |
| `POST /donations`           | ✅ Yes        |
| `PUT /donations/:id/status` | ✅ Yes        |
| `DELETE /donations/:id`     | ✅ Yes        |

All other endpoints remain **public** (no auth required).

## ❌ Common Errors

### 401 Unauthorized

**Cause**: Missing or invalid token

**Fix**:

```bash
# Make sure you include the Authorization header
-H "Authorization: Bearer YOUR_TOKEN_HERE"

# Check your token hasn't expired (24h default)
# Verify JWT_SECRET matches between generation and validation
```

### Missing Authorization Header

**Fix**:

```bash
# ❌ Wrong
curl -X POST http://localhost:8080/donations

# ✅ Correct
curl -X POST http://localhost:8080/donations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Need More Help?

- **Full API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Detailed Setup**: See [AUTH_SETUP.md](./AUTH_SETUP.md)
- **Implementation Details**: See [AUTHENTICATION_SUMMARY.md](./AUTHENTICATION_SUMMARY.md)

## 💡 Tips

1. **Token Format**: Always use `Bearer <token>` format
2. **Expiration**: Tokens expire after 24 hours by default
3. **Testing**: Use Postman or cURL for easy testing
4. **Production**: Use strong secrets and HTTPS
5. **Frontend**: Store tokens in localStorage or httpOnly cookies

---

**Ready to integrate?** Check the [Next.js examples](./API_DOCUMENTATION.md#nextjs-integration-examples) in the API documentation!
