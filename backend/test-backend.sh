#!/bin/bash

# 🧪 Webster Backend Test Suite
# Run this script to verify all improvements are working

echo "🚀 Testing Webster Backend Improvements..."
echo "=========================================="

BASE_URL="http://localhost:5001"

echo ""
echo "1️⃣  Testing Server Health..."
curl -s "$BASE_URL/api/test/health" | jq '.'

echo ""
echo "2️⃣  Testing Basic API..."
curl -s "$BASE_URL/api/test/test" | jq '.'

echo ""
echo "3️⃣  Testing OTP Generation (New Account)..."
curl -s -X POST "$BASE_URL/api/auth/getOtp" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","createAccount":true}' | jq '.'

echo ""
echo "4️⃣  Testing OTP Verification..."
curl -s -X POST "$BASE_URL/api/auth/verifyOtp" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","otp":"1234"}' | jq '.'

echo ""
echo "5️⃣  Testing User Login..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}' \
  -c /tmp/cookies.txt | jq '.'

echo ""
echo "6️⃣  Testing Auth Status..."
curl -s "$BASE_URL/api/auth/authLogin" \
  -b /tmp/cookies.txt | jq '.'

echo ""
echo "7️⃣  Testing Google OAuth URL..."
curl -s "$BASE_URL/api/auth/googleAuthlink" | jq '.'

echo ""
echo "8️⃣  Testing Logout..."
curl -s "$BASE_URL/api/auth/logout" \
  -b /tmp/cookies.txt | jq '.'

# Cleanup
rm -f /tmp/cookies.txt

echo ""
echo "✅ All Backend Tests Complete!"
echo ""
echo "💡 Next Steps:"
echo "   - Frontend is running on: http://localhost:3000"
echo "   - Backend API is running on: http://localhost:5001"  
echo "   - Try the full authentication flow in the browser!"
echo ""
echo "🔧 For Production:"
echo "   - Set up Google OAuth credentials (see GOOGLE_OAUTH_SETUP.md)"
echo "   - Configure Gmail SMTP (see EMAIL_SETUP.md)"
echo ""