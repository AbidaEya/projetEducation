Ma# 🎓 Education Platform Backend

Une plateforme éducative complète construite avec Spring Boot 3.2.0 et Maven. Cette application supporte 3 rôles d'utilisateurs : Admin, Enseignant et Étudiant.

## ✨ Caractéristiques

- ✅ Gestion complète des utilisateurs (Admin, Enseignant, Étudiant)
- ✅ Gestion des classes et des niveaux d'études
- ✅ Création et gestion des cours
- ✅ Attribution et soumission de devoirs
- ✅ Système d'évaluation des soumissions
- ✅ Inscription des étudiants aux classes
- ✅ API REST complète avec CORS activé
- ✅ Base de données H2 pour le développement
- ✅ Gestion des exceptions globales
- ✅ Logging détaillé

## 🛠️ Stack Technologique

- **Framework**: Spring Boot 3.2.0
- **Build Tool**: Maven
- **Database**: H2 (développement)
- **ORM**: Hibernate/JPA
- **Language**: Java 17+
- **API**: REST API avec Spring Web
- **Validation**: Jakarta Bean Validation

## 📦 Structure du Projet

```
Education Backend/
├── src/
│   ├── main/
│   │   ├── java/com/education/app/
│   │   │   ├── model/                  # Entités JPA
│   │   │   │   ├── User.java
│   │   │   │   ├── Classe.java
│   │   │   │   ├── Cours.java
│   │   │   │   ├── Devoir.java
│   │   │   │   ├── Soumission.java
│   │   │   │   ├── Inscription.java
│   │   │   │   └── Evaluation.java
│   │   │   ├── repository/             # Repositories JPA
│   │   │   ├── service/                # Services métier
│   │   │   ├── controller/             # Controllers REST
│   │   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── config/                 # Configuration
│   │   │   └── EducationApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── README.md
├── API_DOCUMENTATION.md
├── Education_Platform_API.postman_collection.json
└── .gitignore
```

## 🚀 Démarrage Rapide

### Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- Git

### Installation

1. **Cloner le projet** (ou naviguer au répertoire)
```bash
cd "Education backend"
```

2. **Compiler le projet**
```bash
mvn clean install
```

3. **Démarrer l'application**
```bash
mvn spring-boot:run
```

L'application démarre sur `http://localhost:8081`

## 📊 Base de Données

### Configuration H2 (Développement)

- **Type**: In-Memory Database
- **URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (vide)

### Accéder à la Console H2
```
http://localhost:8081/h2-console
```

### Données Initiales

À la première exécution, les données suivantes sont créées automatiquement :

**Admin**
- Email: `admin@education.com`
- Mot de passe: `admin123`

**Enseignant**
- Email: `enseignant@education.com`
- Mot de passe: `pass123`

**Étudiants**
- Email: `etudiant1@education.com`, `etudiant2@education.com`
- Mot de passe: `pass123`

## 📚 Entités Principales

### User
Représente les utilisateurs du système avec 3 rôles :
- ADMIN
- ENSEIGNANT
- ETUDIANT

### Classe
Groupe d'étudiants pour une année/niveau scolaire

### Cours
Contenu pédagogique pour une classe

### Devoir
Travail assigné aux étudiants pour un cours

### Soumission
Réponse d'un étudiant à un devoir

### Inscription
Enregistrement d'un étudiant à une classe

### Evaluation
Évaluations/Tests organisés par un enseignant

## 🔌 API REST Endpoints

### Users
```
POST   /api/users/register/etudiant      # Enregistrer étudiant
POST   /api/users/register/enseignant    # Enregistrer enseignant
POST   /api/users/register/admin         # Enregistrer admin
GET    /api/users                        # Tous les utilisateurs
GET    /api/users/{id}                   # Utilisateur par ID
GET    /api/users/email/{email}          # Utilisateur par email
GET    /api/users/role/enseignants       # Tous les enseignants
GET    /api/users/role/etudiants         # Tous les étudiants
PUT    /api/users/{id}                   # Mettre à jour
DELETE /api/users/{id}                   # Supprimer
```

### Classes
```
POST   /api/classes                      # Créer classe
GET    /api/classes                      # Toutes les classes
GET    /api/classes/{id}                 # Classe par ID
GET    /api/classes/enseignant/{id}      # Classes d'un enseignant
PUT    /api/classes/{id}                 # Mettre à jour
DELETE /api/classes/{id}                 # Supprimer
```

### Cours
```
POST   /api/cours                        # Créer cours
GET    /api/cours                        # Tous les cours
GET    /api/cours/{id}                   # Cours par ID
GET    /api/cours/classe/{id}            # Cours d'une classe
GET    /api/cours/enseignant/{id}        # Cours d'un enseignant
PUT    /api/cours/{id}                   # Mettre à jour
DELETE /api/cours/{id}                   # Supprimer
```

### Devoirs
```
POST   /api/devoirs                      # Créer devoir
GET    /api/devoirs                      # Tous les devoirs
GET    /api/devoirs/{id}                 # Devoir par ID
GET    /api/devoirs/cours/{id}           # Devoirs d'un cours
GET    /api/devoirs/enseignant/{id}      # Devoirs d'un enseignant
PUT    /api/devoirs/{id}                 # Mettre à jour
DELETE /api/devoirs/{id}                 # Supprimer
```

### Soumissions
```
POST   /api/soumissions/submit           # Soumettre devoir
GET    /api/soumissions/devoir/{id}      # Soumissions d'un devoir
GET    /api/soumissions/etudiant/{id}    # Soumissions étudiant
GET    /api/soumissions/pending          # En attente d'évaluation
POST   /api/soumissions/{id}/evaluate    # Évaluer soumission
DELETE /api/soumissions/{id}             # Supprimer
```

### Inscriptions
```
POST   /api/inscriptions/enroll/{etu}/{classe}    # Inscrire étudiant
GET    /api/inscriptions/etudiant/{id}            # Inscriptions étudiant
GET    /api/inscriptions/classe/{id}              # Inscriptions classe
GET    /api/inscriptions/classe/{id}/active       # Inscriptions actives
PUT    /api/inscriptions/{id}                     # Mettre à jour
DELETE /api/inscriptions/{id}                     # Retirer
```

Voir [API_DOCUMENTATION.md](API_DOCUMENTATION.md) pour la documentation complète.

## 🧪 Tests

### Utiliser Postman
Une collection Postman est fournie : `Education_Platform_API.postman_collection.json`

1. Importer la collection dans Postman
2. Tester les endpoints

### Executer les tests unitaires
```bash
mvn test
```

## ⚙️ Configuration

### application.properties

```properties
# Server
server.port=8081

# Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update

# Logging
logging.level.com.education=DEBUG
```

## 🔐 Sécurité (À Implémenter)

- [ ] Authentification JWT
- [ ] Hashage des mots de passe (BCrypt)
- [ ] Autorisation basée sur les rôles (RBAC)
- [ ] HTTPS
- [ ] Validation des entrées
- [ ] Protection CSRF
- [ ] Rate limiting

## 🔄 Dépendances Principales

```xml
<!-- Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA/Hibernate -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- H2 Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

## 📝 Exemples d'Utilisation

### 1. Créer une classe

```json
POST /api/classes
{
  "name": "Classe Terminale S",
  "description": "Classe scientifique",
  "level": 12,
  "enseignantId": 2
}
```

### 2. Créer un cours

```json
POST /api/cours
{
  "title": "Mathématiques Avancées",
  "description": "Cours de mathématiques niveau terminale",
  "content": "Contenu du cours...",
  "classeId": 1,
  "enseignantId": 2
}
```

### 3. Assigner un devoir

```json
POST /api/devoirs
{
  "title": "Devoir Chapitre 5",
  "description": "Exercices sur les dérivées",
  "coursId": 1,
  "enseignantId": 2,
  "dateDebut": "2026-01-15T10:00:00",
  "dateEchéance": "2026-01-22T23:59:59"
}
```

### 4. Soumettre un devoir

```json
POST /api/soumissions/submit
{
  "devoirId": 1,
  "etudiantId": 3,
  "contenu": "Réponses du devoir..."
}
```

### 5. Évaluer une soumission

```json
POST /api/soumissions/{id}/evaluate
{
  "note": 18.5,
  "feedback": "Excellente réponse!"
}
```

## 🐛 Troubleshooting

### Port déjà utilisé
Si le port 8081 est occupé, modifier dans `application.properties`:
```properties
server.port=8082
```

### Erreur de compilation
```bash
mvn clean install -X
```

### H2 Console ne répond pas
Vérifier que H2 est activé dans `application.properties`:
```properties
spring.h2.console.enabled=true
```

## 📈 Améliorations Futures

- [ ] Authentification JWT complète
- [ ] Tests unitaires et d'intégration
- [ ] Pagination et tri
- [ ] Filtrage avancé
- [ ] Upload de fichiers
- [ ] Notifications
- [ ] Chat en temps réel
- [ ] Calendrier académique
- [ ] Bulletins de notes
- [ ] Emploi du temps

## 📄 License

Ce projet est open source.

## 👥 Support

Pour toute question ou problème, consultez la documentation ou créez une issue.

---

**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026  
**Développé avec ❤️ pour l'éducation**

