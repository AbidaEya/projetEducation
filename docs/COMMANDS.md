# Commands & Quick Reference

## Maven Commands

### Compilation et Build
```bash
# Nettoyer et compiler
mvn clean compile

# Construire le projet
mvn clean install

# Construire sans tests
mvn clean install -DskipTests

# Build avec debug
mvn clean install -X

# Package uniquement (sans tests)
mvn package -DskipTests
```

### Exécution
```bash
# Démarrer l'application
mvn spring-boot:run

# Démarrer avec port personnalisé
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082"

# Démarrer en mode debug
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

### Tests
```bash
# Exécuter tous les tests
mvn test

# Exécuter une classe de test spécifique
mvn test -Dtest=UserServiceTest

# Exécuter une méthode de test spécifique
mvn test -Dtest=UserServiceTest#testRegisterUser

# Tests avec rapport de couverture
mvn test jacoco:report
```

### Dépendances
```bash
# Lister les dépendances
mvn dependency:tree

# Vérifier les dépendances obsolètes
mvn versions:display-dependency-updates

# Mettre à jour les versions des plugins
mvn versions:display-plugin-updates
```

## Curl Commands pour Tester l'API

### Users - Enregistrement

```bash
# Enregistrer un étudiant
curl -X POST http://localhost:8081/api/users/register/etudiant \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@education.com",
    "password": "password123",
    "confirmPassword": "password123",
    "firstName": "Jean",
    "lastName": "Dupont",
    "phoneNumber": "+33612345678",
    "address": "123 Rue de Paris"
  }'

# Enregistrer un enseignant
curl -X POST http://localhost:8081/api/users/register/enseignant \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@education.com",
    "password": "password123",
    "confirmPassword": "password123",
    "firstName": "Marie",
    "lastName": "Martin"
  }'
```

### Users - Consulter

```bash
# Tous les utilisateurs
curl -X GET http://localhost:8081/api/users

# Utilisateur par ID
curl -X GET http://localhost:8081/api/users/1

# Par email
curl -X GET http://localhost:8081/api/users/email/admin@education.com

# Tous les enseignants
curl -X GET http://localhost:8081/api/users/role/enseignants

# Tous les étudiants
curl -X GET http://localhost:8081/api/users/role/etudiants
```

### Classes

```bash
# Créer une classe
curl -X POST http://localhost:8081/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classe Terminale S",
    "description": "Classe scientifique",
    "level": 12,
    "enseignantId": 2
  }'

# Toutes les classes
curl -X GET http://localhost:8081/api/classes

# Classes d'un enseignant
curl -X GET http://localhost:8081/api/classes/enseignant/2
```

### Cours

```bash
# Créer un cours
curl -X POST http://localhost:8081/api/cours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mathématiques Avancées",
    "description": "Cours niveau terminale",
    "content": "Contenu du cours",
    "classeId": 1,
    "enseignantId": 2,
    "ressourcePath": "/resources/maths.pdf"
  }'

# Tous les cours
curl -X GET http://localhost:8081/api/cours

# Cours d'une classe
curl -X GET http://localhost:8081/api/cours/classe/1

# Cours d'un enseignant
curl -X GET http://localhost:8081/api/cours/enseignant/2
```

### Devoirs

```bash
# Créer un devoir
curl -X POST http://localhost:8081/api/devoirs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Devoir Chapitre 5",
    "description": "Exercices sur les dérivées",
    "coursId": 1,
    "enseignantId": 2,
    "dateDebut": "2026-01-15T10:00:00",
    "dateEchéance": "2026-01-22T23:59:59"
  }'

# Tous les devoirs
curl -X GET http://localhost:8081/api/devoirs

# Devoirs d'un cours
curl -X GET http://localhost:8081/api/devoirs/cours/1
```

### Soumissions

```bash
# Soumettre un devoir
curl -X POST http://localhost:8081/api/soumissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "devoirId": 1,
    "etudiantId": 3,
    "contenu": "Réponses du devoir",
    "filePath": "/uploads/submission.pdf"
  }'

# Soumissions d'un devoir
curl -X GET http://localhost:8081/api/soumissions/devoir/1

# Soumissions d'un étudiant
curl -X GET http://localhost:8081/api/soumissions/etudiant/3

# Soumissions en attente
curl -X GET http://localhost:8081/api/soumissions/pending

# Évaluer une soumission
curl -X POST http://localhost:8081/api/soumissions/1/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "note": 18.5,
    "feedback": "Excellente réponse!"
  }'
```

### Inscriptions

```bash
# Inscrire un étudiant
curl -X POST http://localhost:8081/api/inscriptions/enroll/3/1

# Inscriptions d'un étudiant
curl -X GET http://localhost:8081/api/inscriptions/etudiant/3

# Inscriptions d'une classe
curl -X GET http://localhost:8081/api/inscriptions/classe/1

# Inscriptions actives d'une classe
curl -X GET http://localhost:8081/api/inscriptions/classe/1/active
```

## Git Commands

```bash
# Initialiser repo
git init

# Ajouter fichiers
git add .

# Commit
git commit -m "Initial commit: Education platform backend"

# Pusher
git push origin main
```

## Docker Commands (Optionnel)

```bash
# Construire l'image
docker build -t education-backend:1.0 .

# Lancer le conteneur
docker run -p 8081:8081 education-backend:1.0

# Arrêter le conteneur
docker stop <container_id>
```

## Utilitaires

### Afficher les logs en temps réel
```bash
tail -f logs/application.log
```

### Vérifier le port utilisé
```bash
# Linux/Mac
lsof -i :8081

# Windows
netstat -ano | findstr :8081
```

### Tuer le processus sur un port
```bash
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

## Shortcuts IntelliJ IDEA

| Raccourci | Action |
|-----------|--------|
| `Ctrl+Shift+F` | Reformater le code |
| `Alt+Enter` | Quick fix/suggestions |
| `Ctrl+Alt+O` | Optimiser les imports |
| `Ctrl+/` | Commenter/Décommenter |
| `Ctrl+Shift+T` | Créer test |
| `F5` | Debug |
| `F9` | Resume debug |
| `F8` | Step over |
| `F7` | Step into |

## Fichiers Importants

- **pom.xml** - Dépendances Maven
- **application.properties** - Configuration application
- **EducationApplication.java** - Point d'entrée
- **Model** - Entités (User, Classe, Cours, etc.)
- **Repository** - Interfaces JPA
- **Service** - Logique métier
- **Controller** - Endpoints REST
- **DTO** - Objets de transfert de données

## URLs Utiles

- Application: http://localhost:8081
- API: http://localhost:8081/api
- H2 Console: http://localhost:8081/h2-console
- Health Check: http://localhost:8081/api/health

## Notes

- Changer le port dans `application.properties` si 8081 est occupé
- Les données sont en mémoire (H2), disparaîtront au redémarrage
- Voir `API_DOCUMENTATION.md` pour la documentation complète
- Voir `README.md` pour le setup initial

## Liens Utiles

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Maven Documentation](https://maven.apache.org/)
- [H2 Database](https://www.h2database.com/)
