# 🏗️ Architecture & Infrastructure Guide

## 📐 Vue d'ensemble Architecturale

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐     │
│  │   Browser   │  │  Mobile App │  │   API Clients      │     │
│  └──────┬──────┘  └──────┬──────┘  └────────┬───────────┘     │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTP/HTTPS
                   ┌────────▼────────┐
                   │  Load Balancer  │
                   │  (Optional)     │
                   └────────┬────────┘
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ Frontend 1 │   │ Frontend 2 │   │ Frontend N │  (Scalable)
    │  (React)   │   │  (React)   │   │  (React)   │
    │ Port: 3000 │   │ Port: 3000 │   │ Port: 3000 │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ REST API
          ┌────────────────▼────────────────┐
          │    API Gateway (Optional)       │
          │  - Rate Limiting                │
          │  - Authentication               │
          │  - Request Validation           │
          └────────────────┬────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────┐           ┌─────▼─────┐          ┌────▼───┐
│Backend 1│           │Backend 2  │          │Backend N│ (Scalable)
│Spring   │           │Spring     │          │Spring   │
│ 8081    │           │ 8081      │          │ 8081    │
└───┬────┘           └─────┬─────┘          └────┬───┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │ JDBC
          ┌────────────────▼────────────────┐
          │   Database Connection Pool      │
          │   (HikariCP)                    │
          └────────────────┬────────────────┘
                           │
                      ┌────▼────┐
                      │  MySQL   │
                      │ Primary  │
                      │(Master)  │
                      └────┬────┘
                           │ Replication
          ┌────────────────┼────────────────┐
          │                │                │
      ┌───▼──┐        ┌────▼────┐      ┌───▼──┐
      │MySQL │        │ MySQL   │      │MySQL │
      │Slave1│        │ Slave 2 │      │Slave3│
      └──────┘        └─────────┘      └──────┘
```

---

## 🔄 Cycle de Déploiement CI/CD

```
Developer Push
      │
      ▼
┌─────────────┐
│   GitHub    │  Webhook
│  Repository │─────┐
└─────────────┘     │
                    ▼
           ┌──────────────────┐
           │  Jenkins Server  │
           │   (Orchestrator) │
           └────────┬─────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌─────────┐          ┌─────────────┐
   │  Build  │          │  Test       │
   │ Backend │          │  Backend    │
   │ & Frontend          │             │
   └────┬────┘          └──────┬──────┘
        │                      │
        ├──────────┬───────────┤
        │          ▼           │
        │   ┌──────────────┐   │
        │   │SonarQube     │   │
        │   │Code Analysis │   │
        │   └──────┬───────┘   │
        │          │           │
        │  ┌───────▼───────┐   │
        │  │Docker Security│   │
        │  │Scan (Trivy)   │   │
        │  └───────┬───────┘   │
        │          │           │
        └────┬─────┼───────────┘
             │     │
             ▼     ▼
        ┌───────────────┐
        │ Build Docker  │
        │  Images       │
        └───────┬───────┘
                │
        ┌───────▼──────────────┐
        │ Push to Registry     │
        │ (Docker Hub/ECR/etc) │
        └───────┬──────────────┘
                │
        ┌───────▼────────────────┐
        │ Deploy to Dev (Auto)   │
        │ docker-compose up -d   │
        └───────┬────────────────┘
                │
        ┌───────▼────────────────┐
        │ Integration Tests      │
        │ (API validation)       │
        └───────┬────────────────┘
                │
        ┌───────▼────────────────┐
        │ Manual Approval for    │
        │ Staging/Production     │
        └───────┬────────────────┘
                │
        ┌───────▼──────────────┐
        │ Deploy to Staging    │
        │ Deploy to Production │
        │ (Kubernetes/Swarm)   │
        └──────────────────────┘
```

---

## 📦 Composants du Système

### 1. **Frontend Layer**
```
┌─────────────────────────────────────┐
│         React + Vite Application     │
├─────────────────────────────────────┤
│ - Components (TypeScript)           │
│ - State Management (Context API)    │
│ - UI Framework (Material-UI)        │
│ - HTTP Client (Fetch/Axios)         │
│ - Routing (React Router v6)         │
├─────────────────────────────────────┤
│ Container: Node.js 20 Alpine        │
│ Port: 3000                          │
│ Health Check: HTTP GET /            │
└─────────────────────────────────────┘
```

### 2. **Backend Layer**
```
┌─────────────────────────────────────┐
│     Spring Boot 3.5.10 API          │
├─────────────────────────────────────┤
│ Controllers → Services → Repositories│
│ - REST Controllers                  │
│ - Business Logic (Services)         │
│ - Data Access (JPA Repositories)    │
│ - Exception Handling                │
│ - Validation & Security             │
├─────────────────────────────────────┤
│ Java 17 | Maven Build               │
│ Port: 8081                          │
│ Health Check: /actuator/health      │
└─────────────────────────────────────┘
```

### 3. **Data Layer**
```
┌─────────────────────────────────────┐
│        MySQL 8.0 Database           │
├─────────────────────────────────────┤
│ - Education DB (education_db)       │
│ - Tables (Entities)                 │
│ - Indexes & Constraints             │
│ - Character Set: utf8mb4            │
│ - Collation: utf8mb4_unicode_ci     │
├─────────────────────────────────────┤
│ Container: MySQL 8.0                │
│ Port: 3306                          │
│ Volume: mysql_data (persistent)     │
│ Health Check: mysqladmin ping       │
└─────────────────────────────────────┘
```

### 4. **CI/CD Pipeline**
```
┌─────────────────────────────────────┐
│      Jenkins CI/CD Pipeline         │
├─────────────────────────────────────┤
│ Trigger: Git Push / Tag / Manual    │
│ 14 Stages:                          │
│  1. Checkout                        │
│  2. Build Backend                   │
│  3. Test Backend                    │
│  4. Build Frontend                  │
│  5. SonarQube Analysis              │
│  6. Build Docker Images             │
│  7. Push to Registry                │
│  8. Security Scanning               │
│  9. Deploy Dev                      │
│  10. Integration Tests              │
│  11. Deploy Staging                 │
│  12. Deploy Production              │
│  13. Cleanup                        │
│  14. Post Actions                   │
├─────────────────────────────────────┤
│ Artifacts: Reports, Logs, Scans     │
│ Notifications: Slack, Email         │
└─────────────────────────────────────┘
```

---

## 🐳 Docker Orchestration

### Single Host (Current)
```
Docker Host
├── MySQL Container
├── Backend Container (1-N)
├── Frontend Container (1-N)
├── phpMyAdmin Container (Optional)
└── Volumes
    └── mysql_data
```

### Kubernetes (Recommended for Production)
```
┌──────────────────────────────────────────┐
│        Kubernetes Cluster                 │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐  │
│ │ Master Node                        │  │
│ │ - API Server                       │  │
│ │ - Scheduler                        │  │
│ │ - Controller Manager               │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────┬────────────┬────────────┐│
│ │ Worker 1   │ Worker 2   │ Worker 3   ││
│ ├────────────┼────────────┼────────────┤│
│ │ Backend-1  │ Backend-2  │ Backend-3  ││
│ │ Frontend-1 │ Frontend-2 │ Frontend-3 ││
│ │ MySQL Rep  │ MySQL Rep  │ MySQL Prim ││
│ └────────────┴────────────┴────────────┘│
│                                          │
│ Services:                                │
│ - Service (Load Balancer)               │
│ - Ingress (Routing)                     │
│ - PersistentVolume (Storage)            │
│ - ConfigMap (Configuration)             │
│ - Secret (Credentials)                  │
└──────────────────────────────────────────┘
```

---

## 🔐 Sécurité Multi-Couches

### Layer 1: Network Security
```
┌─────────────────────────────────────┐
│    Firewall & WAF (Optional)        │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│    Load Balancer (SSL/TLS)          │
│    - Terminates SSL                 │
│    - Rate Limiting                  │
│    - DDoS Protection                │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│    Isolated Docker Network          │
│    - Bridge Network (No external)   │
│    - Service-to-service only        │
└────────────┬────────────────────────┘
```

### Layer 2: Container Security
```
- Non-root user execution
- Read-only filesystems (where possible)
- Resource limits (CPU, Memory)
- Security scanning (Trivy)
- Image signing
```

### Layer 3: Application Security
```
- Authentication (JWT)
- Authorization (RBAC)
- Input Validation
- SQL Injection Prevention (JPA)
- CORS Configuration
- CSRF Protection
```

### Layer 4: Data Security
```
- Encrypted connections (TLS)
- Database user separation
- Connection pooling (HikariCP)
- Encrypted volumes (optional)
- Regular backups
```

---

## 📊 Performance Considerations

### Frontend Optimization
```
- Vite: Fast dev server & optimized build
- Code splitting (lazy loading)
- Asset optimization
- CDN for static files (optional)
- Compression (gzip/brotli)
- Browser caching
```

### Backend Optimization
```
- Connection pooling (HikariCP): max 10, min 5
- Database indexes on foreign keys
- Query optimization
- Caching (Redis optional)
- Async processing (optional)
- Gzip response compression
```

### Database Optimization
```
- Character set: utf8mb4 (efficient)
- Collation: utf8mb4_unicode_ci
- Indexes on:
  - Primary keys
  - Foreign keys
  - Frequently searched columns
- Regular ANALYZE TABLE
```

---

## 🔄 Scaling Strategy

### Horizontal Scaling
```
# Frontend (Stateless)
docker-compose up -d --scale frontend=3

# Backend (Stateless)
docker-compose up -d --scale backend=3

# Database (Requires replication)
- Master-Slave setup
- Read replicas for queries
```

### Vertical Scaling
```
# Increase container resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Load Balancing
```
# nginx-ingress (Kubernetes)
# HAProxy (Docker Swarm)
# AWS ALB (AWS)
# Google Cloud Load Balancer (GCP)
```

---

## 🛠️ Maintenance & Monitoring

### Monitoring Stack
```
┌─────────────────────────────────────┐
│    Prometheus + Grafana             │
├─────────────────────────────────────┤
│ - Container metrics                 │
│ - Application metrics               │
│ - Database metrics                  │
│ - Custom dashboards                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    ELK Stack (Elasticsearch, Logstash, Kibana) │
├─────────────────────────────────────┤
│ - Centralized logging               │
│ - Log analysis                      │
│ - Real-time alerts                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    Alerting                         │
├─────────────────────────────────────┤
│ - Health check failures             │
│ - High resource usage               │
│ - Error rate spikes                 │
│ - Response time degradation         │
└─────────────────────────────────────┘
```

### Backup Strategy
```
Daily:
- MySQL dump to volume
- Configuration backup
- Code repository backup

Weekly:
- Full database backup (offsite)
- Volume snapshots

Monthly:
- Archive old backups
- Test restore procedures
```

---

## 📝 Database Schema

### Core Entities
```
┌────────────────┐  ┌──────────────┐
│    Users       │  │  Courses     │
├────────────────┤  ├──────────────┤
│ id (PK)        │  │ id (PK)      │
│ username (U)   │  │ name         │
│ email (U)      │  │ description  │
│ password (H)   │  │ created_by(FK)
│ role           │  │ created_at   │
│ created_at     │  └──────────────┘
└────────────────┘
        │
        ├─────────────────┐
        │                 │
   ┌────▼────────┐    ┌───▼──────────┐
   │ Enrolments  │    │ Assignments  │
   ├─────────────┤    ├──────────────┤
   │ user_id(FK) │    │ course_id(FK)│
   │ course_id(FK)    │ title        │
   │ status      │    │ due_date     │
   │ enrolled_at │    │ max_score    │
   └─────────────┘    └──────────────┘
        │
        ▼
   ┌─────────────┐
   │ Submissions │
   ├─────────────┤
   │ id (PK)     │
   │ user_id(FK) │
   │ assignment_id
   │ file_path   │
   │ score       │
   │ submitted_at│
   └─────────────┘
```

---

## 🚀 Deployment Environments

### Development
```
Hardware: Local machine or VM
Services: Docker Compose
Database: MySQL (single instance)
Scale: 1 replica each
Updates: Continuous
```

### Staging
```
Hardware: Cloud VM/Container
Services: Docker or Kubernetes
Database: MySQL (single instance)
Scale: 2-3 replicas each
Updates: Weekly
SSL: Self-signed
```

### Production
```
Hardware: Kubernetes Cluster
Services: Kubernetes
Database: MySQL (Master-Slave)
Scale: 3+ replicas each
Updates: Rolling deployment
SSL: Let's Encrypt/Paid certificate
Monitoring: Full stack
Backup: Automated
```

---

## 📞 Support & Escalation

```
Issue Type          │ Resolution
─────────────────────────────────────
Container won't start    → Logs, health check
High CPU/Memory usage    → Vertical scaling
DB connection errors     → Network, credentials
API endpoint errors      → Backend logs, tests
UI not responsive        → Browser console, network
Performance degradation  → Monitoring, profiling
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: May 11, 2026  
**Technology Stack**: Spring Boot 3.5.10, React 18, MySQL 8.0, Docker, Jenkins
