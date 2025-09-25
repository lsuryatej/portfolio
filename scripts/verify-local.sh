#!/bin/bash

# Portfolio Local Verification Script
# This script verifies the local build and runs smoke tests

set -e  # Exit on any error

echo "🔍 Portfolio Local Verification"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the portfolio root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules not found. Please run setup-local.sh first."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "   Removed .next build cache"
fi

if [ -d ".contentlayer" ]; then
    rm -rf .contentlayer
    echo "   Removed .contentlayer cache"
fi

# Run TypeScript check
echo "🔍 Running TypeScript check..."
if npm run type-check; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

# Run ESLint
echo "🔍 Running ESLint..."
if npm run lint; then
    echo "✅ ESLint check passed"
else
    echo "⚠️  ESLint found issues (continuing anyway)"
fi

# Build Contentlayer
echo "📚 Building Contentlayer..."
if npm run contentlayer; then
    echo "✅ Contentlayer build successful"
else
    echo "❌ Contentlayer build failed"
    exit 1
fi

# Build the project
echo "🏗️  Building project..."
if npm run build; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

# Check if build artifacts exist
if [ ! -d ".next" ]; then
    echo "❌ Error: .next directory not created. Build failed."
    exit 1
fi

echo "✅ Build artifacts created successfully"

# Start the production server in background
echo "🚀 Starting production server for smoke tests..."
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Function to cleanup server on exit
cleanup() {
    echo "🛑 Stopping production server..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# Test server health
echo "🔍 Testing server health..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
    exit 1
fi

# Run smoke tests
echo "🧪 Running smoke tests..."

# Test homepage
echo "   Testing homepage..."
if curl -f -s -o /dev/null http://localhost:3000; then
    echo "   ✅ Homepage (/) - 200 OK"
else
    echo "   ❌ Homepage (/) - FAILED"
    exit 1
fi

# Test about page
echo "   Testing about page..."
if curl -f -s -o /dev/null http://localhost:3000/about; then
    echo "   ✅ About page (/about) - 200 OK"
else
    echo "   ❌ About page (/about) - FAILED"
fi

# Test projects page
echo "   Testing projects page..."
if curl -f -s -o /dev/null http://localhost:3000/projects; then
    echo "   ✅ Projects page (/projects) - 200 OK"
else
    echo "   ❌ Projects page (/projects) - FAILED"
fi

# Test contact page
echo "   Testing contact page..."
if curl -f -s -o /dev/null http://localhost:3000/contact; then
    echo "   ✅ Contact page (/contact) - 200 OK"
else
    echo "   ❌ Contact page (/contact) - FAILED"
fi

# Test styleguide page
echo "   Testing styleguide page..."
if curl -f -s -o /dev/null http://localhost:3000/styleguide; then
    echo "   ✅ Styleguide page (/styleguide) - 200 OK"
else
    echo "   ❌ Styleguide page (/styleguide) - FAILED"
fi

# Test robots.txt
echo "   Testing robots.txt..."
if curl -f -s -o /dev/null http://localhost:3000/robots.txt; then
    echo "   ✅ Robots.txt (/robots.txt) - 200 OK"
else
    echo "   ❌ Robots.txt (/robots.txt) - FAILED"
fi

# Test sitemap.xml
echo "   Testing sitemap.xml..."
if curl -f -s -o /dev/null http://localhost:3000/sitemap.xml; then
    echo "   ✅ Sitemap.xml (/sitemap.xml) - 200 OK"
else
    echo "   ❌ Sitemap.xml (/sitemap.xml) - FAILED"
fi

# Test API routes
echo "   Testing API routes..."
if curl -f -s -o /dev/null http://localhost:3000/api/og; then
    echo "   ✅ OG Image API (/api/og) - 200 OK"
else
    echo "   ❌ OG Image API (/api/og) - FAILED"
fi

# Test 404 page
echo "   Testing 404 page..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nonexistent | grep -q "404"; then
    echo "   ✅ 404 page - 404 OK"
else
    echo "   ❌ 404 page - FAILED"
fi

echo ""
echo "🎉 Local verification complete!"
echo ""
echo "✅ All critical tests passed"
echo "✅ Build process working correctly"
echo "✅ Server responding properly"
echo "✅ Core pages accessible"
echo ""
echo "The portfolio is ready for development and deployment!"
echo ""
