# Education Platform - Project Analysis & Docker Setup Guide

## 📊 Project Overview

### Backend
- **Technology**: Spring Boot 3.5.10 with Java 17
- **Build Tool**: Maven
- **Database**: MySQL 8.0
- **Port**: 8081
- **Key Dependencies**:
  - Spring Web
  - Spring Data JPA / Hibernate
  - MySQL Connector
  - JWT Authentication (Optional)
  - Validation Framework

### Frontend
- **Technology**: React 18 + TypeScript + Vite
- **Port**: 3000
- **UI Framework**: Material-UI 7.3.5 + Radix UI
- **Key Dependencies**: 
  - Emotion (CSS-in-JS)
  - Date-fns
  - Embla Carousel

### Database
- **System**: MySQL 8.0
- **Management UI**: phpMyAdmin (optional, port 8080)

---

## 🐳 Docker Architecture

### Multi-Stage Builds
Both Dockerfiles use multi-stage builds for optimized production images:

#### Backend Dockerfile
1. **Build Stage**: Maven with Eclipse Temurin JDK 17
   - Downloads dependencies
   - Compiles Java code
   - Creates JAR artifact
   
2. **Runtime Stage**: Eclipse Temurin JRE 17 (minimal)
   - Copies pre-built JAR
   - Non-root user for security
   - Health checks enabled
   - Size optimized

#### Frontend Dockerfile
1. **Build Stage**: Node.js 20 Alpine
   - Installs npm dependencies
   - Builds React app with Vite
   
2. **Runtime Stage**: Node.js 20 Alpine
   - Serves built files with `serve`
   - Non-root user for security
   - Health checks enabled
   - Minimal image size

---

## 🚀 Getting Started

### Prerequisites
```bash
- Docker 20.10+
- Docker Compose 1.29+
- Git
- Maven 3.8+ (for local builds)
- Node.js 18+ (for local builds)
```

### Quick Start

#### 1. Clone the repository
```bash
git clone <repository-url>
cd proejct-pfa-master
```

#### 2. Using Docker Compose (Recommended)
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **phpMyAdmin**: http://localhost:8080
  - Username: `education_user`
  - Password: `education_password`

---

## 🔧 Configuration

### Backend Environment Variables (via docker-compose)
```yaml
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/education_db
SPRING_DATASOURCE_USERNAME: education_user
SPRING_DATASOURCE_PASSWORD: education_password
SPRING_PROFILES_ACTIVE: mysql
```

### Frontend Environment Variables
```yaml
VITE_API_URL: http://localhost:8081
VITE_API_BASE_URL: /api
```

### MySQL Configuration
```yaml
MYSQL_ROOT_PASSWORD: root_password
MYSQL_DATABASE: education_db
MYSQL_USER: education_user
MYSQL_PASSWORD: education_password
```

---

## 📦 Docker Images

### Build Images Manually

#### Backend
```bash
cd backend
docker build -t education-backend:latest .
```

#### Frontend
```bash
cd front2
docker build -t education-frontend:latest .
```

---

## 🔐 Security Features

### Backend Container
- ✅ Non-root user (appuser:1000)
- ✅ Read-only filesystem (where applicable)
- ✅ Health checks enabled
- ✅ Minimal base image (JRE only)
- ✅ Latest security patches

### Frontend Container
- ✅ Non-root user (appuser:1000)
- ✅ Alpine base image
- ✅ Health checks enabled
- ✅ Minimal dependencies

### Network
- ✅ Isolated bridge network
- ✅ Service-to-service communication
- ✅ No exposed sensitive data

---

## 🔍 Health Checks

### Backend Health Check
```bash
curl http://localhost:8081/actuator/health
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

### Manual Verification
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

---

## 🚢 CI/CD with Jenkins

### Jenkinsfile Features

#### Stages
1. **Checkout**: Clone repository and extract Git info
2. **Build Backend**: Maven clean build
3. **Test Backend**: Run unit tests
4. **Build Frontend**: npm build
5. **SonarQube Analysis**: Code quality (on develop branch)
6. **Build Docker Images**: Create production images
7. **Push Docker Images**: Push to registry (develop/main/master)
8. **Security Scanning**: Trivy vulnerability scanning
9. **Deploy to Development**: docker-compose deployment
10. **Integration Tests**: API endpoint validation
11. **Deploy to Staging/Production**: Environment-specific

#### Environment Variables
```groovy
REGISTRY = 'docker.io'  // Change to your registry
REGISTRY_NAMESPACE = 'your-namespace'  // Your Docker Hub namespace
```

#### Branch Triggers
- `develop`: Builds, tests, scans, deploys to dev
- `main`: Full CI/CD pipeline
- Tags `release-*`: Production deployment (manual approval)

---

## 🔄 Docker Compose Services

### 1. MySQL (mysql)
- Image: `mysql:8.0`
- Port: `3306`
- Volume: `mysql_data` (persistent)
- Health check: mysqladmin ping

### 2. Backend (backend)
- Build: `./backend/Dockerfile`
- Port: `8081`
- Depends on: MySQL
- Volume: `./backend/uploads` (file uploads)

### 3. Frontend (frontend)
- Build: `./front2/Dockerfile`
- Port: `3000`
- Depends on: Backend

### 4. phpMyAdmin (phpmyadmin) - Optional
- Image: `phpmyadmin:latest`
- Port: `8080`
- Database management UI

---

## 🛠️ Advanced Usage

### Development with Hot Reload
```bash
# For backend changes (with Maven)
cd backend
mvn spring-boot:run

# For frontend changes (with Vite)
cd front2
npm run dev
```

### Production Build
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Push to registry (after authentication)
docker tag education-backend:latest your-registry/education-backend:latest
docker push your-registry/education-backend:latest
```

### Scaling Services
```bash
# Scale frontend (requires load balancer config)
docker-compose up -d --scale frontend=3
```

---

## 📊 Performance Optimization

### Current Optimizations
- ✅ Multi-stage builds reduce image size
- ✅ Alpine base images (Node)
- ✅ JRE instead of JDK for backend
- ✅ Volume mounts for persistent data
- ✅ Network isolation
- ✅ Health checks for orchestration

### Further Improvements
- Consider caching layers in CI/CD
- Implement Kubernetes for auto-scaling
- Add CDN for static frontend assets
- Optimize database indexes
- Implement API rate limiting

---

## 🐛 Troubleshooting

### Backend fails to start
```bash
# Check logs
docker-compose logs backend

# Verify MySQL connectivity
docker-compose exec backend curl mysql:3306

# Rebuild without cache
docker-compose build --no-cache backend
```

### Frontend shows blank page
```bash
# Check browser console for API errors
# Verify API URL configuration
docker-compose exec frontend env | grep VITE

# Rebuild frontend
docker-compose build --no-cache frontend
```

### MySQL connection errors
```bash
# Verify credentials
docker-compose exec mysql mysql -u education_user -p education_db

# Check volume permissions
docker volume ls | grep mysql_data
```

---

## 📝 Registry Configuration for Jenkins

### Docker Hub Setup
1. Create account on Docker Hub
2. Create repository: `your-username/education-backend`
3. Create repository: `your-username/education-frontend`
4. In Jenkins:
   - Add credentials: Manage Jenkins → Credentials
   - Use type: Username with password
   - Set credentials ID: `docker-credentials`
   - Update `Jenkinsfile` REGISTRY_NAMESPACE

### Private Registry (e.g., ECR, GCR)
Update `Jenkinsfile` environment:
```groovy
REGISTRY = 'your-registry.com'
REGISTRY_NAMESPACE = 'your-namespace'
```

---

## 🔗 Useful Commands

```bash
# View all running containers
docker-compose ps

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend bash

# View container logs with filtering
docker-compose logs --follow backend
docker-compose logs --tail=50 frontend

# Stop and remove all services
docker-compose down

# Remove all volumes (careful!)
docker-compose down -v

# Build specific service
docker-compose build backend

# Push image to registry
docker push your-registry/image:tag

# Pull latest images and restart
docker-compose pull
docker-compose up -d
```

---

## 📚 Documentation References

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker)
- [Vite Documentation](https://vitejs.dev)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline)

---

## 👥 Maintenance & Support

For issues or questions about the Docker setup:
1. Check the troubleshooting section above
2. Review container logs
3. Consult the official documentation
4. Contact the development team

---

**Last Updated**: May 11, 2026
**Project Version**: 1.0.0
