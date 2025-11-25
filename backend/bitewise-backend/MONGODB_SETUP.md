# MongoDB Setup Guide

## Step 1: Get Your MongoDB Connection String

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier is fine)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your database user password
8. Replace `<database>` with your database name (e.g., `bitewise`)

### Option B: Local MongoDB

If you have MongoDB installed locally:
```
mongodb://localhost:27017/bitewise
```

## Step 2: Create .env File

Create a file named `.env` in the `backend/bitewise-backend` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bitewise?retryWrites=true&w=majority

# Edamam API (for recipes)
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

# Server Port
PORT=5002

# JWT Secret (for authentication - use a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Node Environment
NODE_ENV=development
```

## Step 3: Important Notes

### Password Encoding
If your password contains special characters, you MUST URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

Example:
- Password: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`
- Connection string: `mongodb+srv://user:MyP%40ss%23123@cluster.mongodb.net/bitewise`

### MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. For development, you can add `0.0.0.0/0` (allows all IPs - less secure but easier)
4. For production, add only your server's IP

### Database User Permissions
1. Go to MongoDB Atlas → Database Access
2. Create a database user with "Read and write to any database" permissions
3. Use this username and password in your connection string

## Step 4: Test Connection

Run the test script:
```bash
node test-mongodb.js
```

If successful, you'll see:
```
✅ MongoDB connected successfully!
```

If it fails, the script will show helpful error messages.

## Step 5: Start Your Server

Once MongoDB is connected, start your server:
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5002
```

## Troubleshooting

### "authentication failed"
- Check username and password are correct
- Make sure password is URL-encoded if it has special characters
- Verify database user exists in MongoDB Atlas

### "timeout" or "ENOTFOUND"
- Check your internet connection
- Verify IP is whitelisted in MongoDB Atlas
- Check cluster hostname is correct

### "MONGODB_URI not set"
- Make sure `.env` file exists in `backend/bitewise-backend/`
- Check the file is named exactly `.env` (not `.env.txt` or `.env.example`)
- Verify `MONGODB_URI=` line is in the file

