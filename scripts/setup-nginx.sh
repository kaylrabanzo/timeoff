#!/bin/bash

# Setup nginx for timeoff project
# This script sets up nginx with SSL certificates and hosts file configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Timeoff Nginx Setup ===${NC}"
echo ""

# Check if running as root for hosts file modification
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo -e "${YELLOW}Checking required tools...${NC}"
if ! command_exists docker; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

if ! command_exists openssl; then
    echo -e "${RED}OpenSSL is not installed. Please install OpenSSL first.${NC}"
    exit 1
fi

echo -e "${GREEN}All required tools are available!${NC}"
echo ""

# Generate SSL certificates
echo -e "${YELLOW}Generating SSL certificates...${NC}"
./scripts/generate-ssl.sh
echo ""

# Check if hosts file entry exists
HOSTS_ENTRY="127.0.0.1 timeoff.test"
if grep -q "timeoff.test" /etc/hosts; then
    echo -e "${GREEN}Hosts file entry for timeoff.test already exists.${NC}"
else
    echo -e "${YELLOW}Adding timeoff.test to /etc/hosts...${NC}"
    echo -e "${BLUE}You may be prompted for your password to modify /etc/hosts${NC}"
    echo "$HOSTS_ENTRY" | sudo tee -a /etc/hosts > /dev/null
    echo -e "${GREEN}Hosts file updated successfully!${NC}"
fi
echo ""

# Show available commands
echo -e "${BLUE}=== Setup Complete! ===${NC}"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo -e "  Development (HTTP): ${GREEN}docker-compose -f docker-compose.dev.yml up${NC}"
echo -e "  Production (HTTPS): ${GREEN}docker-compose up${NC}"
echo -e "  Stop all services:  ${GREEN}docker-compose down${NC}"
echo ""
echo -e "${YELLOW}Access your application:${NC}"
echo -e "  Development: ${GREEN}http://timeoff.test${NC}"
echo -e "  Production:  ${GREEN}https://timeoff.test${NC}"
echo ""
echo -e "${YELLOW}Note:${NC}"
echo -e "  - For HTTPS, you'll need to trust the self-signed certificate in your browser"
echo -e "  - Visit https://timeoff.test and accept the security warning"
echo -e "  - The certificate is valid for 365 days"
echo ""
echo -e "${GREEN}Setup complete! You can now start your application.${NC}" 