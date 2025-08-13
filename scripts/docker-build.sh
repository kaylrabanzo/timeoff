#!/bin/bash

# Docker build script for Timeoff Management System

set -e

echo "🐳 Building Timeoff Management System Docker image..."

# Build the production image
docker build -t timeoff-management-system:latest .

echo "✅ Docker image built successfully!"
echo "📦 Image: timeoff-management-system:latest"
echo ""
echo "🚀 To run the application:"
echo "   docker-compose up -d"
echo ""
echo "🔧 For development:"
echo "   docker-compose -f docker-compose.dev.yml up -d" 