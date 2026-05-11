# Documentation API - Plateforme Éducative

## Base URL
```
http://localhost:8081/api
```

## Authentification
À ce stade, les utilisateurs par défaut sont :
- **Admin**: admin@education.com / admin123
- **Enseignant**: enseignant@education.com / pass123
- **Étudiant 1**: etudiant1@education.com / pass123
- **Étudiant 2**: etudiant2@education.com / pass123

---

## Endpoints Utilisateurs

### 1. Enregistrer un nouveau Étudiant
```
POST /users/register/etudiant
Content-Type: application/json

{
  "email": "newemail@education.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+33612345678",
  "address": "123 Rue de Paris"
}
```

### 2. Enregistrer un nouvel Enseignant
```
POST /users/register/enseignant
```

### 3. Enregistrer un nouvel Admin
```
POST /users/register/admin
```

### 4. Récupérer tous les utilisateurs
```
GET /users
```

### 5. Récupérer un utilisateur par ID
```
GET /users/{id}
```

### 6. Récupérer un utilisateur par email
```
GET /users/email/{email}
```

### 7. Récupérer tous les enseignants
```
GET /users/role/enseignants
```

### 8. Récupérer tous les étudiants
```
GET /users/role/etudiants
```

### 9. Mettre à jour un utilisateur
```
PUT /users/{id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+33698765432",
  "address": "456 Rue de Lyon"
}
```

### 10. Désactiver un utilisateur
```
PUT /users/{id}/deactivate
```

### 11. Réactiver un utilisateur
```
PUT /users/{id}/activate
```

### 12. Supprimer un utilisateur
```
DELETE /users/{id}
```

---

## Endpoints Classes

### 1. Créer une nouvelle classe
```
POST /classes
Content-Type: application/json

{
  "name": "Classe Terminale A",
  "description": "Classe scientifique",
  "level": 12,
  "enseignantId": 2
}
```

### 2. Récupérer toutes les classes
```
GET /classes
```

### 3. Récupérer une classe par ID
```
GET /classes/{id}
```

### 4. Récupérer les classes d'un enseignant
```
GET /classes/enseignant/{enseignantId}
```

### 5. Récupérer les classes par niveau
```
GET /classes/level/{level}
```

### 6. Mettre à jour une classe
```
PUT /classes/{id}
Content-Type: application/json

{
  "name": "Classe Terminale A",
  "description": "Classe scientifique mise à jour",
  "level": 12,
  "enseignantId": 2
}
```

### 7. Supprimer une classe
```
DELETE /classes/{id}
```

---

## Endpoints Cours

### 1. Créer un nouveau cours
```
POST /cours
Content-Type: application/json

{
  "title": "Mathématiques Avancées",
  "description": "Cours de mathématiques niveau terminale",
  "content": "Contenu du cours...",
  "classeId": 1,
  "enseignantId": 2,
  "ressourcePath": "/resources/maths.pdf"
}
```

### 2. Récupérer tous les cours
```
GET /cours
```

### 3. Récupérer un cours par ID
```
GET /cours/{id}
```

### 4. Récupérer les cours d'une classe
```
GET /cours/classe/{classeId}
```

### 5. Récupérer les cours d'un enseignant
```
GET /cours/enseignant/{enseignantId}
```

### 6. Mettre à jour un cours
```
PUT /cours/{id}
Content-Type: application/json

{
  "title": "Mathématiques Avancées - Mise à jour",
  "description": "Cours de mathématiques niveau terminale",
  "content": "Contenu du cours mis à jour...",
  "classeId": 1,
  "enseignantId": 2,
  "ressourcePath": "/resources/maths_updated.pdf"
}
```

### 7. Supprimer un cours
```
DELETE /cours/{id}
```

---

## Endpoints Devoirs

### 1. Créer un devoir
```
POST /devoirs
Content-Type: application/json

{
  "title": "Devoir Mathématiques Chapitre 5",
  "description": "Exercices sur les dérivées",
  "coursId": 1,
  "enseignantId": 2,
  "dateDebut": "2026-01-15T10:00:00",
  "dateEchéance": "2026-01-22T23:59:59"
}
```

### 2. Récupérer tous les devoirs
```
GET /devoirs
```

### 3. Récupérer un devoir par ID
```
GET /devoirs/{id}
```

### 4. Récupérer les devoirs d'un cours
```
GET /devoirs/cours/{coursId}
```

### 5. Récupérer les devoirs d'un enseignant
```
GET /devoirs/enseignant/{enseignantId}
```

### 6. Mettre à jour un devoir
```
PUT /devoirs/{id}
Content-Type: application/json

{
  "title": "Devoir Mathématiques Chapitre 5 - Révision",
  "description": "Exercices sur les dérivées - Révision",
  "coursId": 1,
  "enseignantId": 2,
  "dateDebut": "2026-01-15T10:00:00",
  "dateEchéance": "2026-01-29T23:59:59"
}
```

### 7. Supprimer un devoir
```
DELETE /devoirs/{id}
```

---

## Endpoints Soumissions

### 1. Soumettre un devoir
```
POST /soumissions/submit
Content-Type: application/json

{
  "devoirId": 1,
  "etudiantId": 3,
  "contenu": "Réponses du devoir...",
  "filePath": "/uploads/devoir_etudiant.pdf"
}
```

### 2. Récupérer toutes les soumissions d'un devoir
```
GET /soumissions/devoir/{devoirId}
```

### 3. Récupérer toutes les soumissions d'un étudiant
```
GET /soumissions/etudiant/{etudiantId}
```

### 4. Récupérer une soumission par ID
```
GET /soumissions/{id}
```

### 5. Récupérer les soumissions en attente d'évaluation
```
GET /soumissions/pending
```

### 6. Évaluer une soumission
```
POST /soumissions/{id}/evaluate
Content-Type: application/json

{
  "note": 18.5,
  "feedback": "Excellente réponse! Quelques petites corrections: ..."
}
```

### 7. Supprimer une soumission
```
DELETE /soumissions/{id}
```

---

## Endpoints Inscriptions

### 1. Inscrire un étudiant à une classe
```
POST /inscriptions/enroll/{etudiantId}/{classeId}
```

### 2. Récupérer toutes les inscriptions d'un étudiant
```
GET /inscriptions/etudiant/{etudiantId}
```

### 3. Récupérer toutes les inscriptions d'une classe
```
GET /inscriptions/classe/{classeId}
```

### 4. Récupérer les inscriptions actives d'une classe
```
GET /inscriptions/classe/{classeId}/active
```

### 5. Récupérer une inscription par ID
```
GET /inscriptions/{id}
```

### 6. Mettre à jour une inscription
```
PUT /inscriptions/{id}
Content-Type: application/json

{
  "etudiantId": 3,
  "classeId": 1,
  "status": "ACTIVE",
  "moyenneFinale": 16.5
}
```

### 7. Retirer un étudiant d'une classe
```
DELETE /inscriptions/{id}
```

---

## Structure de la Base de Données

### Entités Principales

1. **User** - Utilisateurs du système (Admin, Enseignant, Étudiant)
2. **Classe** - Classes/Groupes d'étudiants
3. **Cours** - Contenu pédagogique pour les classes
4. **Devoir** - Devoirs assignés aux étudiants
5. **Soumission** - Soumissions des devoirs par les étudiants
6. **Inscription** - Inscription des étudiants aux classes
7. **Evaluation** - Évaluations/Tests dans les classes

### Relations

- Un enseignant peut avoir plusieurs classes
- Une classe peut avoir plusieurs cours
- Un cours peut avoir plusieurs devoirs
- Un devoir peut avoir plusieurs soumissions
- Un étudiant peut soumettre plusieurs devoirs
- Un étudiant peut s'inscrire à plusieurs classes

---

## Codes d'Erreur HTTP

- **200 OK** - Requête réussie
- **201 Created** - Ressource créée avec succès
- **204 No Content** - Opération réussie (pas de contenu)
- **400 Bad Request** - Erreur dans la requête
- **404 Not Found** - Ressource non trouvée
- **500 Internal Server Error** - Erreur serveur

---

## Notes Importantes

1. **Authentification**: À développer avec JWT
2. **Hashage des mots de passe**: À implémenter en utilisant BCrypt
3. **Validation**: À ajouter sur les DTOs
4. **Tests unitaires**: À créer pour chaque service
5. **Pagination**: À ajouter sur les endpoints GET pour les grandes collections
6. **Filtrage avancé**: À implémenter pour les recherches

---

## Démarrage de l'Application

1. Compiler le projet:
```bash
mvn clean install
```

2. Démarrer l'application:
```bash
mvn spring-boot:run
```

3. Accéder à l'API:
```
http://localhost:8081/api
```

4. Console H2 (développement):
```
http://localhost:8081/h2-console
```

Credentials H2:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (laissez vide)
