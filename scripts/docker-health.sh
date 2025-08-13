#!/bin/bash

# Docker health check script for Timeoff Management System

set -e

echo "🏥 Checking Timeoff Management System health..."

# Check if containers are running
echo "📦 Container Status:"
docker-compose ps

echo ""

# Check web application health
echo "🌐 Web Application Health:"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Web application is healthy"
else
    echo "❌ Web application is not responding"
fi

echo ""

# Check database health
echo "🗄️  Database Health:"
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database is not responding"
fi

echo ""

# Check Redis health
echo "📊 Redis Health:"
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis is not responding"
fi

echo ""

# Show resource usage
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "🔍 For detailed logs:"
echo "   docker-compose logs -f [service_name]" 