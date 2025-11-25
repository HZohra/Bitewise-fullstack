# MongoDB Credentials Verification Guide

## Step 1: Verify User Exists in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Database Access"** in the left sidebar
3. Look for user: `bitewise_user`
4. If it doesn't exist, create it:
   - Click **"+ ADD NEW DATABASE USER"**
   - Choose **"Password"** authentication
   - Username: `bitewise_user`
   - Password: Create a strong password (write it down!)
   - User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

## Step 2: Reset Password (If Needed)

If the user exists but you forgot the password:

1. Find `bitewise_user` in the Database Access list
2. Click **"Edit"** (pencil icon)
3. Click **"Edit Password"**
4. Enter a new password
5. **IMPORTANT:** Write down the password!
6. Click **"Update User"**

## Step 3: Encode Password (If It Has Special Characters)

If your password has special characters, you MUST URL-encode them:

```bash
node encode-password.js 'YourPasswordHere'
```

This will show you the encoded version to use in your connection string.

## Step 4: Update .env File

Edit `backend/bitewise-backend/.env`:

```env
MONGODB_URI=mongodb+srv://bitewise_user:ENCODED_PASSWORD@cluster0.8nxvjch.mongodb.net/bitewise?retryWrites=true&w=majority
```

Replace `ENCODED_PASSWORD` with:
- Your actual password (if no special characters)
- OR the URL-encoded version (if it has special characters)

## Step 5: Test Connection

```bash
npm run test:mongodb
```

## Common Issues

### "authentication failed"
- ✅ Password is wrong → Reset it in MongoDB Atlas
- ✅ Password has special chars → URL-encode it
- ✅ Username is wrong → Check Database Access list
- ✅ User doesn't have permissions → Set to "Read and write to any database"

### "IP not whitelisted"
- ✅ Go to Network Access → IP Access List
- ✅ Make sure `0.0.0.0/0` is added and status is "Active" (not "Pending")
- ✅ Wait 1-2 minutes if status is "Pending"

### "timeout"
- ✅ Check internet connection
- ✅ Verify cluster is running in MongoDB Atlas
- ✅ Check IP whitelist

