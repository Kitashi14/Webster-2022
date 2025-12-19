#!/bin/bash

# 🚀 Webster-2022 Deployment Script
# This script helps you deploy the app step by step

echo "🎯 Webster-2022 Deployment Helper"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
echo "📦 Checking prerequisites..."
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""

# Step 1
echo -e "${YELLOW}Step 1: Prepare Git Repository${NC}"
echo "Make sure your code is pushed to GitHub:"
echo "  git add ."
echo "  git commit -m 'Prepare for deployment'"
echo "  git push origin main"
echo ""
read -p "✓ Code pushed to GitHub? (y/n): " git_done
if [ "$git_done" != "y" ]; then
    echo -e "${RED}❌ Please push your code to GitHub first${NC}"
    exit 1
fi

# Step 2
echo ""
echo -e "${YELLOW}Step 2: MongoDB Atlas Setup${NC}"
echo "Ensure MongoDB Atlas is configured:"
echo "  1. Go to https://cloud.mongodb.com"
echo "  2. Network Access → Add IP: 0.0.0.0/0 (allow all)"
echo "  3. Note your connection string"
echo ""
read -p "✓ MongoDB Atlas configured? (y/n): " mongo_done
if [ "$mongo_done" != "y" ]; then
    echo -e "${RED}❌ Please configure MongoDB Atlas first${NC}"
    exit 1
fi

# Step 3
echo ""
echo -e "${YELLOW}Step 3: Railway Account${NC}"
echo "Sign up for Railway:"
echo "  1. Go to https://railway.app"
echo "  2. Sign up with GitHub"
echo "  3. Verify your account"
echo ""
read -p "✓ Railway account ready? (y/n): " railway_done
if [ "$railway_done" != "y" ]; then
    echo -e "${RED}❌ Please create a Railway account first${NC}"
    exit 1
fi

# Step 4
echo ""
echo -e "${YELLOW}Step 4: Deploy Backend to Railway${NC}"
echo "Follow these steps:"
echo "  1. Go to railway.app dashboard"
echo "  2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "  3. Select 'Webster-2022' repository"
echo "  4. Configure:"
echo "     - Root Directory: backend"
echo "     - Start Command: node server.js"
echo "  5. Add ALL environment variables from backend/.env"
echo "  6. Deploy and wait for completion"
echo ""
read -p "✓ Backend deployed to Railway? (y/n): " backend_done
if [ "$backend_done" != "y" ]; then
    echo -e "${RED}❌ Please deploy backend first${NC}"
    exit 1
fi

# Step 5
echo ""
echo -e "${YELLOW}Step 5: Get Railway URL${NC}"
read -p "Enter your Railway backend URL (e.g., https://webster-backend.railway.app): " railway_url

if [ -z "$railway_url" ]; then
    echo -e "${RED}❌ Railway URL is required${NC}"
    exit 1
fi

# Update .env.production
echo ""
echo "📝 Updating frontend environment variables..."
cat > frontend/.env.production << EOF
# Production Environment Variables
REACT_APP_SERVER_ROOT_URI=$railway_url
EOF
echo -e "${GREEN}✅ Updated frontend/.env.production${NC}"

# Step 6
echo ""
echo -e "${YELLOW}Step 6: Update Railway Environment Variables${NC}"
echo "In Railway dashboard, update these variables:"
echo "  UI_ROOT_URI=https://your-frontend.vercel.app (update after next step)"
echo "  SERVER_ROOT_URI=$railway_url"
echo ""
read -p "✓ Railway env vars updated? (y/n): " railway_env_done

# Step 7
echo ""
echo -e "${YELLOW}Step 7: Deploy Frontend to Vercel${NC}"
echo "Deploying frontend..."
cd frontend
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
else
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi

# Step 8
echo ""
echo -e "${YELLOW}Step 8: Get Vercel URL${NC}"
read -p "Enter your Vercel frontend URL (e.g., https://webster-frontend.vercel.app): " vercel_url

# Step 9
echo ""
echo -e "${YELLOW}Step 9: Final Railway Update${NC}"
echo "Go back to Railway dashboard and update:"
echo "  UI_ROOT_URI=$vercel_url"
echo ""
read -p "✓ Railway UI_ROOT_URI updated? (y/n): " final_railway

# Step 10
echo ""
echo -e "${YELLOW}Step 10: Update Google OAuth${NC}"
echo "Go to Google Cloud Console:"
echo "  1. APIs & Services → Credentials"
echo "  2. Select your OAuth 2.0 Client"
echo "  3. Add to Authorized JavaScript origins:"
echo "     $vercel_url"
echo "     $railway_url"
echo "  4. Add to Authorized redirect URIs:"
echo "     $railway_url/api/auth/googleAuth"
echo ""
read -p "✓ Google OAuth updated? (y/n): " oauth_done

# Summary
echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo -e "${GREEN}Your app is now live at:${NC}"
echo -e "  Frontend: ${GREEN}$vercel_url${NC}"
echo -e "  Backend:  ${GREEN}$railway_url${NC}"
echo ""
echo "📋 Post-Deployment Testing:"
echo "  - [ ] Visit frontend URL"
echo "  - [ ] Test user registration"
echo "  - [ ] Test login"
echo "  - [ ] Test Google OAuth"
echo "  - [ ] Test complaint creation"
echo "  - [ ] Test chat functionality"
echo "  - [ ] Test worker profiles"
echo ""
echo -e "${YELLOW}⚠️  If something doesn't work:${NC}"
echo "  1. Check Railway logs (railway.app → your project → Deployments)"
echo "  2. Check Vercel logs (vercel.com → your project → Functions)"
echo "  3. Verify all environment variables"
echo "  4. Check MongoDB Atlas IP whitelist"
echo ""
echo "📚 For more help, see:"
echo "  - QUICK_DEPLOY.md"
echo "  - DEPLOYMENT_GUIDE.md"
echo ""
echo "Good luck! 🚀"
