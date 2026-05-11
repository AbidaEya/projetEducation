# 🚀 QUICK START GUIDE

## ⚡ 5 Minutos pour Démarrer

### Prérequis
```bash
✓ Docker Desktop (20.10+)
✓ Git
✓ 4GB RAM minimum
✓ Port 3000, 8081, 3306, 8080 disponibles
```

### Étape 1: Préparation
```bash
# Cloner le repository
git clone <votre-repo>
cd proejct-pfa-master

# Copier l'env example
cp .env.example .env
```

### Étape 2: Démarrer l'Application
```bash
# Option A: Avec Docker Compose (Recommandé)
docker-compose up -d

# Option B: Avec le script
chmod +x docker-setup.sh
./docker-setup.sh setup

# Option C: Manuel
docker-compose build
docker-compose up -d
```

### Étape 3: Accéder aux Services
```
Frontend:    http://localhost:3000
Backend API: http://localhost:8081
API Docs:    http://localhost:8081/swagger-ui.html
phpMyAdmin:  http://localhost:8080
```

### Étape 4: Vérifier le Statut
```bash
# Voir tous les containers
docker-compose ps

# Vérifier les logs
docker-compose logs -f

# Test rapide
curl http://localhost:8081/actuator/health
```

---

## 📋 Fichiers Créés

### 1️⃣ Dockerfiles
- ✅ `backend/Dockerfile` - Backend optimisé multi-stage
- ✅ `front2/Dockerfile` - Frontend optimisé multi-stage

### 2️⃣ Orchestration
- ✅ `docker-compose.yml` - Configuration complète (MySQL, Backend, Frontend, phpMyAdmin)

### 3️⃣ CI/CD
- ✅ `Jenkinsfile` - Pipeline Jenkins 14 stages

### 4️⃣ Configuration
- ✅ `.env.example` - Template variables d'environnement
- ✅ `backend/.dockerignore` - Optimisation image backend
- ✅ `front2/.dockerignore` - Optimisation image frontend

### 5️⃣ Scripts
- ✅ `docker-setup.sh` - Script interactif de gestion Docker

### 6️⃣ Documentation
- ✅ `DOCKER_GUIDE.md` - Guide Docker complet
- ✅ `JENKINS_SETUP.md` - Configuration Jenkins
- ✅ `DEPLOYMENT_SUMMARY.md` - Résumé déploiement
- ✅ `ARCHITECTURE.md` - Architecture détaillée
- ✅ `QUICK_START.md` - Démarrage rapide (ce fichier)

---

## 🛠️ Commandes Essentielles

### Démarrage
```bash
docker-compose up -d              # Démarrer en background
docker-compose up                 # Démarrer en foreground (voir les logs)
```

### Arrêt
```bash
docker-compose down               # Arrêter sans supprimer volumes
docker-compose down -v            # Arrêter et supprimer volumes (ATTENTION!)
```

### Logs
```bash
docker-compose logs -f            # Tous les services
docker-compose logs -f backend    # Service spécifique
docker-compose logs --tail=50     # Dernières 50 lignes
```

### Rebuild
```bash
docker-compose build              # Rebuild toutes les images
docker-compose build --no-cache   # Rebuild sans cache
```

### Accès aux containers
```bash
docker-compose exec backend bash  # Shell du backend
docker-compose exec mysql bash    # Shell du MySQL
```

---

## 🔧 Configuration

### Variables Clés (.env)
```bash
# Database
DB_USER=education_user
DB_PASSWORD=education_password
DB_NAME=education_db

# Services
SPRING_PROFILES_ACTIVE=mysql
VITE_API_URL=http://localhost:8081

# Registry
REGISTRY_NAMESPACE=your-namespace
```

---

## ✅ Checklist de Démarrage

- [ ] Docker & Docker Compose installés
- [ ] Repository cloné
- [ ] `.env.example` copié en `.env` (optionnel)
- [ ] `docker-compose up -d` exécuté
- [ ] `docker-compose ps` affiche 4 services UP
- [ ] Frontend accessible: http://localhost:3000
- [ ] Backend accessible: http://localhost:8081
- [ ] MySQL accessible: http://localhost:8080 (phpMyAdmin)

---

## 🐛 Troubleshooting Rapide

### Les containers ne démarre pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier les ports disponibles
netstat -tlnp | grep -E "3000|8081|3306|8080"

# Cleanup et redémarrer
docker-compose down
docker-compose up -d
```

### Le frontend affiche une page blanche
```bash
# Vérifier la console du navigateur (F12)
# Vérifier la connexion API
curl http://localhost:8081/actuator/health

# Vérifier les logs frontend
docker-compose logs frontend
```

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL est UP
docker-compose ps mysql

# Vérifier les credentials
docker-compose exec mysql mysql -u education_user -p education_db
```

### Port déjà utilisé
```bash
# Voir quel process utilise le port
lsof -i :3000
lsof -i :8081
lsof -i :3306

# Terminer le processus (macOS/Linux)
kill -9 <PID>

# Sur Windows: taskkill /PID <PID> /F
```

---

## 📱 URLs d'Accès

| Service | URL | Identifiants |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | - |
| Backend | http://localhost:8081 | - |
| Swagger UI | http://localhost:8081/swagger-ui.html | - |
| Health Check | http://localhost:8081/actuator/health | - |
| phpMyAdmin | http://localhost:8080 | root / root_password |

---

## 🔄 Cycle de Développement

### Modifications Frontend
```bash
# Backend continue de tourner
# Modifications en temps réel (avec hot reload Vite)
cd front2
npm run dev
```

### Modifications Backend
```bash
# Frontend continue de tourner
# Rebuild nécessaire
docker-compose build backend
docker-compose up -d backend
```

### Modifications DB
```bash
# Ajouter des migrations
cd backend/src/main/resources
# Créer schema-*.sql

# Redémarrer
docker-compose down -v
docker-compose up -d
```

---

## 📊 Statut des Services

### Voir le statut complet
```bash
docker-compose ps
```

Résultat attendu:
```
NAME               COMMAND                 STATE              PORTS
education-mysql        "docker-entrypoint.sh mysqld"   Up (healthy)   3306/tcp
education-backend      "java -jar app.jar"  Up (healthy)   0.0.0.0:8081->8081/tcp
education-frontend     "serve -s dist ..."  Up (healthy)   0.0.0.0:3000->3000/tcp
education-phpmyadmin   "docker-php-entrypoint apache2" Up   0.0.0.0:8080->80/tcp
```

---

## 🚀 Prochaines Étapes

### Phase 1: Développement Local ✅
- [x] Docker Compose configuré
- [x] Services up & running
- [x] Développement local possible

### Phase 2: CI/CD
- [ ] Jenkins installé & configuré
- [ ] Jenkinsfile lié au repo
- [ ] Webhooks GitHub configurés
- [ ] Premiers builds lancés

### Phase 3: Registry Docker
- [ ] Docker Hub / ECR account
- [ ] Credentials ajoutés à Jenkins
- [ ] Images pushées au registry

### Phase 4: Production
- [ ] Kubernetes configuré (optionnel)
- [ ] SSL/TLS configuré
- [ ] Monitoring mis en place
- [ ] Backups automatiques

---

## 📚 Documentation Complète

Pour plus de détails, consultez:

- **DOCKER_GUIDE.md** - Guide complet Docker & Docker Compose
- **JENKINS_SETUP.md** - Installation & configuration Jenkins
- **ARCHITECTURE.md** - Architecture détaillée du système
- **DEPLOYMENT_SUMMARY.md** - Résumé du déploiement

---

## 💡 Tips & Tricks

### Logs en temps réel
```bash
docker-compose logs -f
```

### Entrer dans un container
```bash
docker-compose exec backend bash
docker-compose exec mysql mysql -u education_user -p education_db
```

### Copier des fichiers
```bash
docker cp education-backend:/app/app.jar ./
```

### Export database
```bash
docker-compose exec mysql mysqldump -u education_user -p education_db > backup.sql
```

### Restart rapide
```bash
docker-compose restart
```

### Voir les stats
```bash
docker stats
```

---

## 🎓 Apprentissage

### Comprendre Docker Compose
```bash
cat docker-compose.yml    # Voir la configuration
docker-compose config     # Voir la configuration résolue
```

### Apprendre les commandes
```bash
docker-compose --help     # Aide générale
docker-compose ps --help  # Aide pour une commande
```

---

## 🆘 Besoin d'Aide?

### Problème de démarrage?
1. Vérifier les logs: `docker-compose logs`
2. Vérifier les ports: `netstat -tlnp`
3. Vérifier Docker: `docker ps`
4. Consulter DOCKER_GUIDE.md

### Problème de connexion?
1. Vérifier le health: `docker-compose ps`
2. Vérifier les firewall/ports
3. Tester les endpoints: `curl http://localhost:8081/actuator/health`

### Problème de performance?
1. Vérifier les stats: `docker stats`
2. Vérifier les logs: `docker-compose logs -f`
3. Consulter ARCHITECTURE.md

---

## 🔐 Sécurité

⚠️ **Important pour Production:**

```bash
# Changer les passwords par défaut
# Modifier .env avant de déployer en production

# Activer HTTPS/SSL
# Configurer un reverse proxy (nginx)

# Configurer firewall
# Limiter les accès aux ports

# Sauvegarder les données
# Mettre en place des backups
```

---

## 📞 Support

Pour plus d'information ou d'aide:
1. Lire la documentation complète (fichiers .md)
2. Consulter les logs Docker
3. Vérifier les ressources Docker
4. Consulter la documentation officielle

---

**Prêt à démarrer?**
```bash
docker-compose up -d
# Accédez à http://localhost:3000
```

Bonne chance! 🚀

---

**Date**: 11 Mai 2026  
**Version**: 1.0.0  
**Projet**: Education Platform
