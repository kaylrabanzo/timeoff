#!/bin/bash

# Docker run script for Timeoff Management System

set -e

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please create a .env file with the following variables:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "GOOGLE_CLIENT_ID=your_google_client_id"
    echo "GOOGLE_CLIENT_SECRET=your_google_client_secret"
    echo "NEXTAUTH_SECRET=your_nextauth_secret"
    echo "NEXTAUTH_URL=http://localhost:3000"
    echo ""
    echo "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Starting Timeoff Management System..."

# Check if running in development mode
if [ "$1" = "dev" ]; then
    echo "🔧 Running in development mode..."
    docker compose -f docker-compose.dev.yml up -d
    echo ""
    echo "✅ Development environment started!"
    echo "🌐 Web App: http://localhost:3000"
    echo "🗄️  Database: http://localhost:8080 (Adminer)"
    echo "📊 Redis: localhost:6379"
else
    echo "🏭 Running in production mode..."
    docker compose up -d
    echo ""
    echo "✅ Production environment started!"
    echo "🌐 Web App: http://localhost:3000"
    echo "🔒 Nginx: http://localhost:80"
fi

echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Rebuild: docker-compose build"
echo "   Clean up: docker-compose down -v" 