#!/bin/bash

# DevTinder Automated Deployment Script for Ubuntu
# Usage: ./setup_aws.sh

echo "🚀 Starting DevTinder Setup..."

# 1. Update system
sudo apt-get update -y

# 2. Install Node.js (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 4. Navigate to project (Assuming it's in ~/DevTinder)
cd ~/DevTinder || { echo "❌ Error: ~/DevTinder directory not found!"; exit 1; }

# 5. Create .env file
echo "📝 Creating .env file..."
rm -f .env
cat <<EOT >> .env
MONGO_URL="mongodb+srv://kislay:Googlechrome@tinderdev.wol0rqb.mongodb.net/devtinder"
JWT_SECRET=Kislay123
JWT_EXPIRES=7d
CORS_ORIGIN=https://dev-tinder-front-end-sooty.vercel.app
PORT=7777
EOT

# 6. Install Dependencies
echo "📦 Installing project dependencies..."
npm install

# 7. Setup PM2 for auto-restart
echo "🏃 Starting App with PM2..."
pm2 delete devtinder-api 2>/dev/null || true
pm2 start src/app.js --name "devtinder-api"

# 8. Configure PM2 Startup
echo "🔄 Configuring Startup Script..."
# This automatically runs the command that 'pm2 startup' outputted earlier
pm2 startup systemd -u $USER --hp $HOME | grep "sudo" | bash -
pm2 save

echo "✅ Setup Complete! App is running on port 7777."
echo "💡 Check logs using: pm2 logs devtinder-api"
