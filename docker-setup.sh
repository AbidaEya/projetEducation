#!/bin/bash

# Education Platform - Docker Compose Setup Script
# This script helps setup and manage the Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    # Check Docker daemon
    if ! docker ps &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    
    docker-compose build
    
    print_success "Images built successfully"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    docker-compose up -d
    
    print_success "Services started"
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    print_info "Service Status:"
    docker-compose ps
}

# Check health
check_health() {
    print_header "Checking Service Health"
    
    # Check MySQL
    if docker-compose exec -T mysql mysqladmin ping -h localhost &> /dev/null; then
        print_success "MySQL is healthy"
    else
        print_error "MySQL is not responding"
    fi
    
    # Check Backend
    if curl -s http://localhost:8081/actuator/health | grep -q "UP"; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed (might still be starting)"
    fi
    
    # Check Frontend
    if curl -s http://localhost:3000 &> /dev/null; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed (might still be starting)"
    fi
}

# Show logs
show_logs() {
    print_header "Service Logs"
    docker-compose logs --tail=50
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    
    docker-compose down
    
    print_success "Services stopped"
}

# Clean up everything
cleanup() {
    print_header "Cleaning Up"
    
    docker-compose down -v
    
    print_success "All containers and volumes removed"
}

# Show endpoints
show_endpoints() {
    print_header "Application Endpoints"
    
    echo "Frontend:  http://localhost:3000"
    echo "Backend:   http://localhost:8081"
    echo "phpMyAdmin: http://localhost:8080"
    echo ""
    echo "Database Credentials:"
    echo "  Host: mysql"
    echo "  User: education_user"
    echo "  Password: education_password"
    echo "  Database: education_db"
}

# Main menu
show_menu() {
    echo ""
    echo "Education Platform - Docker Management"
    echo ""
    echo "1) Check prerequisites"
    echo "2) Build images"
    echo "3) Start services"
    echo "4) Check health"
    echo "5) Show logs"
    echo "6) Stop services"
    echo "7) Clean up (remove volumes)"
    echo "8) Show endpoints"
    echo "9) Full setup (1-3)"
    echo "0) Exit"
    echo ""
}

# Main script
if [ "$#" -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
        read -p "Select an option: " choice
        
        case $choice in
            1) check_prerequisites ;;
            2) build_images ;;
            3) start_services ;;
            4) check_health ;;
            5) show_logs ;;
            6) stop_services ;;
            7) cleanup ;;
            8) show_endpoints ;;
            9)
                check_prerequisites
                build_images
                start_services
                check_health
                show_endpoints
                ;;
            0)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option"
                ;;
        esac
    done
else
    # Command line mode
    case "$1" in
        check)      check_prerequisites ;;
        build)      build_images ;;
        start)      start_services ;;
        health)     check_health ;;
        logs)       show_logs ;;
        stop)       stop_services ;;
        clean)      cleanup ;;
        endpoints)  show_endpoints ;;
        setup)
            check_prerequisites
            build_images
            start_services
            check_health
            show_endpoints
            ;;
        *)
            echo "Usage: $0 [check|build|start|health|logs|stop|clean|endpoints|setup]"
            exit 1
            ;;
    esac
fi
