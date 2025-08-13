#!/bin/bash

# Development Setup Script for Timeoff Management System
set -e

echo "🚀 Setting up development environment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to install packages locally
install_packages() {
    echo "📦 Installing packages locally..."
    npm install
    echo "✅ Packages installed successfully"
}

# Function to start development services
start_dev_services() {
    echo "🐳 Starting development services..."
    
    # Stop any existing containers
    docker compose -f docker-compose.dev.yml down
    
    # Start services
    docker compose -f docker-compose.dev.yml up -d
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    until docker compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d timeoff_dev; do
        echo "Waiting for PostgreSQL..."
        sleep 2
    done
    
    echo "✅ Development services started successfully"
}

# Function to install packages in container
install_packages_in_container() {
    echo "📦 Installing packages in container..."
    docker compose -f docker-compose.dev.yml exec web npm install
    echo "✅ Packages installed in container"
}

# Function to show status
show_status() {
    echo "📊 Development environment status:"
    docker compose -f docker-compose.dev.yml ps
}

# Function to show logs
show_logs() {
    echo "📋 Recent logs:"
    docker compose -f docker-compose.dev.yml logs --tail=20
}

# Main script logic
case "${1:-start}" in
    "start")
        check_docker
        install_packages
        start_dev_services
        show_status
        echo "🎉 Development environment is ready!"
        echo "📱 Web app: http://localhost:3000"
        echo "🗄️  Database: localhost:5432"
        echo "🔧 Adminer: http://localhost:8080"
        ;;
    "stop")
        echo "🛑 Stopping development services..."
        docker compose -f docker-compose.dev.yml down
        echo "✅ Services stopped"
        ;;
    "restart")
        echo "🔄 Restarting development services..."
        docker compose -f docker-compose.dev.yml down
        start_dev_services
        show_status
        ;;
    "install")
        check_docker
        install_packages
        install_packages_in_container
        echo "✅ Package installation complete"
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        echo "🧹 Cleaning up..."
        docker compose -f docker-compose.dev.yml down -v
        docker system prune -f
        echo "✅ Cleanup complete"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|install|status|logs|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment"
        echo "  stop    - Stop development services"
        echo "  restart - Restart development services"
        echo "  install - Install packages (no restart needed)"
        echo "  status  - Show service status"
        echo "  logs    - Show recent logs"
        echo "  clean   - Clean up containers and volumes"
        exit 1
        ;;
esac 