# 🚀 DÉMARRAGE RAPIDE - 5 MINUTES

## ⚡ 3 Étapes pour Démarrer

### 1. Compiler le projet
```bash
cd "c:\Users\Hp-User\Desktop\Education backend"
mvn clean install -DskipTests
```

### 2. Lancer l'application
```bash
mvn spring-boot:run
```

**✅ L'application démarre sur http://localhost:8081**

#### Option MySQL (XAMPP) = données persistantes

Si tu veux que les ajouts/modifications/suppressions depuis l'interface web soient enregistrés dans MySQL (XAMPP/phpMyAdmin), lance le backend avec le profil `mysql` :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Par défaut le projet est maintenant configuré pour utiliser `mysql` (tu peux forcer H2 avec `-Dspring-boot.run.profiles=h2`).

### 3. Tester l'API

**Option A: Avec cURL**
```bash
curl http://localhost:8081/api/users
```

**Option B: Avec Postman**
- Ouvrir Postman
- Importer: `Education_Platform_API.postman_collection.json`
- Commencer les tests

**Option C: Avec votre navigateur**
- H2 Console: http://localhost:8081/h2-console
- Credentials: Username `sa`, Password vide

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| **README.md** | Documentation complète du projet |
| **API_DOCUMENTATION.md** | 👈 Tous les endpoints API détaillés |
| **COMMANDS.md** | Commandes utiles et exemples curl |
| **RESUME_PROJET.md** | Vue d'ensemble de ce qui a été créé |

---

## 🔐 Comptes de Test Disponibles

```
Admin
  Email: admin@education.com
  Password: admin123

Enseignant
  Email: enseignant@education.com
  Password: pass123

Étudiant 1
  Email: etudiant1@education.com
  Password: pass123

Étudiant 2
  Email: etudiant2@education.com
  Password: pass123
```

---

## 🎯 Premiers Tests à Faire

### 1. Voir tous les utilisateurs
```bash
curl http://localhost:8081/api/users
```

### 2. Voir tous les enseignants
```bash
curl http://localhost:8081/api/users/role/enseignants
```

### 3. Créer une classe
```bash
curl -X POST http://localhost:8081/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Classe 1","description":"Première classe","level":10,"enseignantId":2}'
```

### 4. Créer un cours
```bash
curl -X POST http://localhost:8081/api/cours \
  -H "Content-Type: application/json" \
  -d '{"title":"Math","description":"Cours de math","content":"...","classeId":1,"enseignantId":2}'
```

---

## 🐛 Troubleshooting

**Port 8081 occupé?**
```bash
# Windows
netstat -ano | findstr :8081

# Puis changer le port dans application.properties
server.port=8082
```

**Erreur de compilation?**
```bash
# Nettoyer complètement
mvn clean
mvn install -DskipTests
```

**Besoin de logs détaillés?**
```bash
mvn spring-boot:run -X
```

---

## 📂 Structure du Projet

```
Education Backend/
├── src/main/java/com/education/app/
│   ├── model/          (7 entités JPA)
│   ├── repository/      (7 repositories)
│   ├── service/         (5 services)
│   ├── controller/      (6 controllers)
│   ├── dto/            (8 DTOs)
│   └── config/         (4 configurations)
├── README.md           ← Documentation complète
├── API_DOCUMENTATION.md ← Tous les endpoints
├── COMMANDS.md         ← Commandes utiles
└── pom.xml            ← Dépendances Maven
```

---

## ✨ Points Clés

✅ **Architecture en couches** propre et maintenable  
✅ **RESTful API** complètement fonctionnelle  
✅ **CORS activé** pour frontend  
✅ **Gestion d'erreurs** globale  
✅ **DTOs** pour sécurité des données  
✅ **Transactions** automatiques  
✅ **Logging** DEBUG activé  
✅ **Base de données** H2 prête  
✅ **Données initiales** créées automatiquement  
✅ **Documentation** complète incluse  

---

## 🎓 À Apprendre

Ce projet vous montre:
- Comment structurer une application Spring Boot
- Architecture en couches (Model, Repository, Service, Controller)
- REST API best practices
- JPA et Hibernate
- DTOs et Mappers
- CORS et Exception Handling
- Configuration et Logging

---

## 📖 Ressources

- [Spring Boot Guide](https://spring.io/guides/gs/spring-boot/)
- [REST API Tutorial](https://restfulapi.net/)
- [JPA Documentation](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)

---

## 🤝 Besoin d'Aide?

1. **Consultez API_DOCUMENTATION.md** pour les endpoints
2. **Consultez COMMANDS.md** pour les exemples
3. **Consultez README.md** pour la configuration
4. **Consultez RESUME_PROJET.md** pour l'aperçu

---

**Que faire maintenant?**

1. ✅ Lancer l'application
2. ✅ Tester les endpoints avec Postman ou cURL
3. ✅ Explorer le code
4. ✅ Ajouter de nouvelles fonctionnalités
5. ✅ Implémenter la sécurité (JWT)
6. ✅ Ajouter des tests unitaires

**Bienvenue sur votre plateforme éducative! 🎓**
