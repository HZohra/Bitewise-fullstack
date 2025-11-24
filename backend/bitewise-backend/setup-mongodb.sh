#!/bin/bash

# MongoDB Setup Helper Script

echo "🔧 MongoDB Setup Helper"
echo "======================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "MONGODB_URI" .env; then
        echo "✅ MONGODB_URI is set in .env"
        echo ""
        echo "📝 Current MONGODB_URI (masked):"
        grep "MONGODB_URI" .env | sed 's/:[^:@]*@/:****@/g'
        echo ""
        echo "🧪 Testing connection..."
        node test-mongodb.js
    else
        echo "❌ MONGODB_URI not found in .env"
        echo ""
        echo "Please add this line to your .env file:"
        echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
    fi
else
    echo "❌ .env file not found"
    echo ""
    echo "Creating .env file template..."
    cat > .env << EOF
# MongoDB Connection String
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
# For Local: mongodb://localhost:27017/bitewise
MONGODB_URI=your_mongodb_connection_string_here

# Edamam API
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

# Server Port
PORT=5002

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Node Environment
NODE_ENV=development
EOF
    echo "✅ Created .env file template"
    echo ""
    echo "📝 Please edit .env and add your MongoDB connection string"
    echo "   See MONGODB_SETUP.md for detailed instructions"
fi

