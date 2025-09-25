#!/bin/bash

# Portfolio Local Setup Script
# This script sets up the local development environment for the portfolio

set -e  # Exit on any error

echo "🚀 Portfolio Local Setup"
echo "========================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the portfolio root directory."
    exit 1
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
    
    # Check if version is compatible (Node 18+)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo "⚠️  Warning: Node.js 18+ is recommended. Current version: $NODE_VERSION"
        echo "   Consider using nvm to install Node.js 18+"
    fi
else
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check npm version
echo "📋 Checking npm version..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm version: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Clean previous installations
echo "🧹 Cleaning previous installations..."
if [ -d "node_modules" ]; then
    echo "   Removing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "   Removing package-lock.json..."
    rm -f package-lock.json
fi

if [ -d ".next" ]; then
    echo "   Removing .next build cache..."
    rm -rf .next
fi

if [ -d ".contentlayer" ]; then
    echo "   Removing .contentlayer cache..."
    rm -rf .contentlayer
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify installation
echo "🔍 Verifying installation..."
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules not created. Installation failed."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local template if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Name"
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com

# Contact Form (optional)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SEO (optional)
GOOGLE_SITE_VERIFICATION=your_google_verification_code
BING_SITE_VERIFICATION=your_bing_verification_code

# Additional Integrations (optional)
NEXT_PUBLIC_CALENDLY_USERNAME=your_calendly_username
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
OPENAI_API_KEY=your_openai_api_key
EOF
    echo "✅ Created .env.local template"
    echo "   📝 Please edit .env.local with your actual values"
else
    echo "✅ .env.local already exists"
fi

# Test TypeScript compilation
echo "🔍 Testing TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation has issues (check with: npm run type-check)"
fi

# Test linting
echo "🔍 Testing ESLint..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ ESLint check passed"
else
    echo "⚠️  ESLint has issues (check with: npm run lint)"
fi

echo ""
echo "🎉 Local setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual values"
echo "2. Run 'npm run dev' to start development server"
echo "3. Run 'npm run build' to test production build"
echo "4. Complete the LAUNCH_CHECKLIST.md items"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run lint         - Run ESLint"
echo "  npm run type-check   - Run TypeScript checks"
echo "  npm run format       - Format code with Prettier"
echo ""
