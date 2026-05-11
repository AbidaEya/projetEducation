# 🚀 Guide de Démarrage Rapide - Education Platform

## 📋 Prérequis

| Outil | Version | Vérification |
|-------|---------|--------------|
| **Java JDK** | 17+ | `java -version` |
| **Maven** | 3.8+ | `mvn -version` |
| **Node.js** | 18+ | `node -version` |
| **npm** | 9+ | `npm -version` |

### Installation des prérequis (Windows)

```powershell
# Vérifier si Java est installé
java -version

# Vérifier si Maven est installé  
mvn -version

# Vérifier si Node.js est installé
node -version
```

---

## ⚡ Démarrage Rapide (2 commandes)

### Prérequis: Démarrer XAMPP
1. Ouvrir **XAMPP Control Panel**
2. Démarrer **Apache** et **MySQL**
3. La base `educationn` sera créée automatiquement

### Lancer le projet

```powershell
# Terminal 1 - Backend (port 8081)
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend (port 5173)
cd frontend
npm install   # Première fois seulement
npm run dev
```

### Option alternative: Mode H2 (Sans XAMPP)

```powershell
# Backend avec H2 (base de données intégrée)
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

---

## 🌐 Accès à l'Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interface utilisateur React |
| **Backend API** | http://localhost:8081/api | API REST Spring Boot |
| **H2 Console** | http://localhost:8081/h2-console | Base de données (mode H2) |

### Connexion H2 Console
- **JDBC URL**: `jdbc:h2:file:./data/education_db`
- **Username**: `root`
- **Password**: *(vide)*

---

## 📁 Structure du Projet

```
education_backend-master/
├── backend/              # API Spring Boot (Java)
│   ├── src/main/java/    # Code source Java
│   ├── src/main/resources/
│   │   ├── application.properties        # Config principale
│   │   ├── application-h2.properties     # Config H2 (défaut)
│   │   └── application-mysql.properties  # Config MySQL/XAMPP
│   ├── data/             # Base de données H2 (persistante)
│   └── pom.xml           # Dépendances Maven
│
├── frontend/             # Interface React (TypeScript)
│   ├── src/              # Code source React
│   ├── package.json      # Dépendances npm
│   └── vite.config.ts    # Configuration Vite
│
├── docs/                 # Documentation
└── .vscode/              # Configuration VS Code
```

---

## 🔧 Configuration des Ports

| Service | Port | Modifiable dans |
|---------|------|-----------------|
| Backend | 8081 | `backend/src/main/resources/application.properties` |
| Frontend | 5173 | `frontend/vite.config.ts` |
| MySQL | 3306 | XAMPP Control Panel |

---

## 💾 Persistance des Données

### Mode MySQL (Par défaut - XAMPP)
- ✅ Les données sont dans la base `educationn` de MySQL
- ✅ Données persistantes même après redémarrage
- ⚠️ Nécessite que XAMPP MySQL soit démarré

### Mode H2 (Alternative sans XAMPP)
- Les données sont sauvegardées dans `backend/data/education_db.mv.db`
- Lancer avec: `mvn spring-boot:run -Dspring-boot.run.profiles=h2`

---

## 🛠️ Commandes Utiles

### Backend
```powershell
cd backend

# Démarrer (mode H2 par défaut)
mvn spring-boot:run

# Démarrer avec MySQL
mvn spring-boot:run -Dspring-boot.run.profiles=mysql

# Compiler sans lancer
mvn clean package -DskipTests

# Nettoyer et recompiler
mvn clean install
```

### Frontend
```powershell
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Compiler pour production
npm run build
```

---

## 🚨 Résolution de Problèmes

### Port 8081 déjà utilisé
```powershell
# Trouver le processus
Get-NetTCPConnection -LocalPort 8081 | Select-Object OwningProcess
# Tuer le processus (remplacer PID)
Stop-Process -Id PID -Force
```

### Port 5173 déjà utilisé
```powershell
Get-NetTCPConnection -LocalPort 5173 | Select-Object OwningProcess
Stop-Process -Id PID -Force
```

### Erreur de connexion MySQL
1. Vérifier que XAMPP MySQL est démarré
2. Vérifier le port 3306 dans XAMPP
3. Utiliser le mode H2 si MySQL n'est pas nécessaire

### Réinitialiser la base H2
```powershell
# Supprimer le fichier de base de données
Remove-Item backend/data/education_db.* -Force
# Redémarrer le backend
```

---

## 📌 VS Code - Raccourcis

1. **Ctrl+Shift+P** → "Tasks: Run Task"
2. Sélectionner:
   - `🚀 Start All (Backend + Frontend)` - Tout démarrer
   - `backend:start` - Backend seul
   - `frontend:start` - Frontend seul

---

## 📞 Support

Pour plus de documentation, voir le dossier `docs/`:
- [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md)
