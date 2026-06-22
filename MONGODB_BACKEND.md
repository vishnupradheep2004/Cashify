# MongoDB Backend Integration - Order Storage

## Overview
This document outlines the MongoDB integration for the Cashify application's order storage system. Orders are stored in MongoDB and managed through a Supabase Edge Function.

## Architecture

### Components
1. **MongoDB Database** - Local or Cloud instance storing orders
2. **Supabase Edge Function** - `mongodb-api` function handling order operations
3. **Frontend Service** - `orderService.ts` for client-side order management
4. **Checkout Flow** - Integrated order creation on checkout completion

## MongoDB Setup

### Local MongoDB Setup (Development)

#### Prerequisites
- MongoDB Community Server installed (https://www.mongodb.com/try/download/community)
- MongoDB running on `mongodb://localhost:27017`

#### Windows Installation
```powershell
# Option 1: Using Chocolatey
choco install mongodb-community

# Option 2: Manual installation
# Download from https://www.mongodb.com/try/download/community
# Run the installer and follow the setup wizard
```

#### Start MongoDB Service
```powershell
# Windows
net start MongoDB

# Or verify it's running
Get-Service MongoDB

# Alternative: Run MongoDB Server directly
mongod --dbpath "C:\data\db"
```

#### Verify Connection
```bash
# Using mongo shell (or mongosh for v5+)
mongosh mongodb://localhost:27017
```

### MongoDB Configuration for Cashify

#### Database Structure
- **Database Name**: `cashify`
- **Collection Name**: `orders`

#### Order Schema
```typescript
{
  _id: ObjectId,                    // MongoDB unique ID
  orderId: String,                  // Human-readable order ID (ORD-timestamp)
  deviceId: String,                 // Device identifier
  deviceName: String,               // Device name for display
  price: Number,                    // Order amount in rupees
  customerName: String,             // Customer's full name
  customerEmail: String,            // Customer's email
  customerPhone: String,            // Customer's phone number
  address: String,                  // Pickup address
  city: String,                     // City
  pincode: String,                  // Postal code
  pickupDate: String,               // Scheduled pickup date (YYYY-MM-DD)
  pickupTime: String,               // Preferred pickup time slot
  paymentMethod: String,            // "upi" | "bank" | "cash"
  upiId?: String,                   // Optional UPI ID for payment
  bankAccount?: String,             // Optional bank account number
  ifsc?: String,                    // Optional IFSC code
  status: String,                   // "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: ISOString,             // Creation timestamp
  updatedAt: ISOString              // Last update timestamp
}
```

## API Endpoints

### 1. Create Order
**Endpoint**: `POST /functions/v1/mongodb-api?action=create-order`

**Request Body**:
```json
{
  "deviceId": "iphone-15-pro",
  "deviceName": "iPhone 15 Pro",
  "price": 45000,
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com",
  "customerPhone": "+91 99999 99999",
  "address": "123 Main St",
  "city": "Mumbai",
  "pincode": "400001",
  "pickupDate": "2026-06-25",
  "pickupTime": "10:00",
  "paymentMethod": "upi",
  "upiId": "name@upi"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "ORD-1719012345678",
  "_id": "ObjectId(...)",
  "message": "Order created successfully"
}
```

### 2. List All Orders
**Endpoint**: `GET /functions/v1/mongodb-api?action=list-orders`

**Response**:
```json
{
  "success": true,
  "orders": [...],
  "total": 5
}
```

### 3. Get Single Order
**Endpoint**: `GET /functions/v1/mongodb-api?action=get-order&orderId=ORD-1719012345678`

**Response**:
```json
{
  "success": true,
  "order": { ... }
}
```

### 4. Update Order Status
**Endpoint**: `POST /functions/v1/mongodb-api?action=update-order`

**Request Body**:
```json
{
  "orderId": "ORD-1719012345678",
  "status": "confirmed"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order updated successfully",
  "modifiedCount": 1
}
```

## Frontend Integration

### Using the Order Service

```typescript
import { orderService } from "@/services/orderService";

// Create an order
const response = await orderService.createOrder({
  deviceId: "device-123",
  deviceName: "iPhone 15 Pro",
  price: 45000,
  customerName: "John Doe",
  // ... other fields
});

// List all orders
const { orders } = await orderService.listOrders();

// Get specific order
const { order } = await orderService.getOrder("ORD-1719012345678");

// Update order status
await orderService.updateOrder("ORD-1719012345678", "confirmed");
```

## Environment Variables

Set these in your `.env.local` or Supabase project settings:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
```

## Deployment

### Local Development
1. Ensure MongoDB is running locally
2. Set `MONGODB_CONNECTION_STRING=mongodb://localhost:27017` in `.env.local`
3. The Edge Function will automatically connect and manage orders

### Production (MongoDB Atlas)
1. Create a MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas)
2. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/cashify`
3. Set in Supabase project settings:
   ```
   MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/cashify
   ```

### Deploying Edge Function
```bash
# Deploy the function to Supabase
supabase functions deploy mongodb-api --project-id YOUR_PROJECT_ID
```

## Error Handling

The API returns appropriate HTTP status codes:
- **200**: Success
- **400**: Bad request (missing required fields)
- **404**: Resource not found
- **500**: Server error (database connection, etc.)

## Monitoring

Monitor orders via MongoDB Atlas dashboard or local MongoDB shell:

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017

# Select database
use cashify

# View orders
db.orders.find()

# View specific order
db.orders.findOne({ orderId: "ORD-1719012345678" })

# Count total orders
db.orders.countDocuments()

# View orders by status
db.orders.find({ status: "pending" })
```

## Indexing for Performance

Create indexes for better query performance:

```javascript
// In MongoDB shell
db.orders.createIndex({ orderId: 1 })
db.orders.createIndex({ customerEmail: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ status: 1 })
```

## Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB service is running: `Get-Service MongoDB` (Windows)
- Check connection string format
- Ensure port 27017 is accessible

### Orders Not Saving
- Check browser console for error messages
- Verify Edge Function is deployed
- Check CORS headers are correct
- Verify database name and collection name match

### Slow Queries
- Add indexes on frequently queried fields
- Use MongoDB Atlas Performance Advisor for production
- Monitor query patterns in logs

## Future Enhancements
- Add order notifications via email/SMS
- Implement order tracking dashboard
- Add order history for customers
- Implement automated status updates
- Add analytics and reporting
