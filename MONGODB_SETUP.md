# MongoDB Setup Quick Start Guide

## Quick Setup for Windows

### 1. Install MongoDB Community Server
```powershell
# Using Chocolatey (recommended)
choco install mongodb-community

# Or download from https://www.mongodb.com/try/download/community
```

### 2. Verify Installation
```powershell
# Check if MongoDB service is available
Get-Service MongoDB

# Start MongoDB service
Start-Service MongoDB

# Verify MongoDB is running
netstat -ano | findstr 27017
```

### 3. Connect to MongoDB
```bash
# Using mongosh (MongoDB Shell)
mongosh mongodb://localhost:27017

# Or using mongo shell (for older MongoDB versions)
mongo
```

### 4. Create Database and Collection
```javascript
// In MongoDB shell - Run these commands:

// Switch to or create cashify database
use cashify

// Create orders collection with indexes
db.createCollection("orders")

// Create indexes for better performance
db.orders.createIndex({ orderId: 1 })
db.orders.createIndex({ customerEmail: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ status: 1 })

// Verify collection was created
show collections
```

### 5. Verify Connection String
```javascript
// The default local connection string is:
// mongodb://localhost:27017

// You can test it with:
db.adminCommand({ ping: 1 })
```

## Environment Configuration

Create a `.env.local` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
```

## Common MongoDB Commands

```javascript
// Connect to cashify database
use cashify

// View all orders
db.orders.find()

// View specific order
db.orders.findOne({ orderId: "ORD-1719012345678" })

// Count total orders
db.orders.countDocuments()

// View orders by status
db.orders.find({ status: "pending" })

// View orders by customer
db.orders.find({ customerEmail: "user@example.com" })

// Update order status
db.orders.updateOne(
  { orderId: "ORD-1719012345678" },
  { $set: { status: "confirmed" } }
)

// Delete old orders (example)
db.orders.deleteMany({ createdAt: { $lt: ISODate("2026-01-01") } })

// Get statistics
db.orders.stats()

// View collection size
db.orders.totalSize()
```

## Troubleshooting

### MongoDB Service Won't Start
```powershell
# Check service status
Get-Service MongoDB | Select-Object Status

# Try to start service
Start-Service MongoDB

# If it fails, check logs
Get-EventLog -LogName System -Source "MongoDB" -Newest 10
```

### Connection Refused Error
```powershell
# Verify MongoDB is listening on port 27017
netstat -ano | findstr 27017

# Restart MongoDB service
Restart-Service MongoDB
```

### "Cannot find package 'mongodb'" in Deno function
- This is expected. The MongoDB Deno client library is imported via URL
- Connection string is validated at runtime
- Ensure MONGODB_CONNECTION_STRING is set in Supabase environment variables

## Backing Up Your Data

```javascript
// In MongoDB shell
// Export collections to JSON
db.orders.find().toArray()

// Or use command line
mongoexport --db cashify --collection orders --out orders_backup.json
```

## Helpful Resources
- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Deno MongoDB Support: https://deno.land/x/mongo

## Next Steps
1. Ensure MongoDB is running locally
2. Create the cashify database and orders collection
3. Update environment variables
4. Run the Cashify application: `npm run dev`
5. Test order creation through the checkout page
6. View orders in Admin dashboard
