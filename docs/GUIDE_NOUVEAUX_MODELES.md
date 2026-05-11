# 📚 GUIDE COMPLET - DIAGRAMME FINAL IMPLÉMENTÉ

## 🎯 Vue d'ensemble

Ce document explique comment utiliser tous les **7 nouveaux modèles** ajoutés à la plateforme éducative.

---

## 📦 LES 7 NOUVEAUX MODÈLES

### 1️⃣ **GROUPE** - Gestion des groupes d'étudiants

**Utilité**: Organiser les étudiants par groupe (Groupe A, B, C, etc.)

**Propriétés**:
- `nomGroupe`: Nom unique du groupe (ex: "Groupe A")
- `description`: Description du groupe
- `niveau`: Niveau d'études (1, 2, 3, etc.)

**Endpoints**:
```
POST   /api/groupes/create               Créer un groupe
GET    /api/groupes/{id}                 Récupérer un groupe
GET    /api/groupes/all                  Tous les groupes
GET    /api/groupes/search/{nom}         Chercher par nom
PUT    /api/groupes/{id}                 Modifier
DELETE /api/groupes/{id}                 Supprimer
```

**Exemple**: Créer un groupe
```bash
curl -X POST http://localhost:8081/api/groupes/create \
  -H "Content-Type: application/json" \
  -d '{
    "nomGroupe": "Groupe L3-2024",
    "description": "Troisième année 2024",
    "niveau": 3
  }'
```

---

### 2️⃣ **MATIERE** - Gestion des matières/disciplines

**Utilité**: Gérer les différentes disciplines enseignées

**Propriétés**:
- `nomMatiere`: Nom unique de la matière
- `description`: Programme/contenu
- `credit`: Nombre de crédits
- Relations: Liée à un Cours et un Enseignant

**Endpoints**:
```
POST   /api/matieres/create               Créer une matière
GET    /api/matieres/{id}                 Récupérer
GET    /api/matieres/all                  Toutes les matières
PUT    /api/matieres/{id}                 Modifier
DELETE /api/matieres/{id}                 Supprimer
```

**Exemple**: Créer une matière
```bash
curl -X POST http://localhost:8081/api/matieres/create \
  -H "Content-Type: application/json" \
  -d '{
    "nomMatiere": "Programmation Java",
    "description": "Les bases de Java",
    "credit": 4,
    "coursId": 1,
    "enseignantId": 1
  }'
```

---

### 3️⃣ **NOTE** - Gestion des notes et évaluations

**Utilité**: Enregistrer les notes des étudiants par matière

**Propriétés**:
- `valeur`: Valeur de la note (0-20)
- `observation`: Commentaire pédagogique
- `dateNote`: Date de l'évaluation
- Relations: Liée à un Étudiant et une Matière

**Endpoints**:
```
POST   /api/notes/create                  Créer une note
GET    /api/notes/{id}                    Récupérer
GET    /api/notes/all                     Toutes les notes
PUT    /api/notes/{id}                    Modifier
DELETE /api/notes/{id}                    Supprimer
GET    /api/notes/etudiant/{id}/moyenne   Moyenne de l'étudiant
```

**Exemple**: Créer une note
```bash
curl -X POST http://localhost:8081/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "valeur": 18.5,
    "observation": "Excellent travail",
    "etudiantId": 1,
    "matiereId": 1
  }'
```

---

### 4️⃣ **JUSTIFICATION** - Justification des absences

**Utilité**: Justifier une absence avec motif et document

**Propriétés**:
- `motif`: Raison de l'absence (texte)
- `dateJustification`: Date de justification
- `document`: Fichier justificatif (chemin)
- `statut`: EN_ATTENTE, ACCEPTEE, REFUSEE
- Relation: Liée à une Absence

**Statuts**:
- `EN_ATTENTE`: En cours de vérification
- `ACCEPTEE`: Acceptée par le personnel
- `REFUSEE`: Refusée

**Endpoints**:
```
POST   /api/justifications/create         Créer
GET    /api/justifications/{id}           Récupérer
GET    /api/justifications/all            Toutes
GET    /api/justifications/pending        En attente
PUT    /api/justifications/{id}           Modifier
DELETE /api/justifications/{id}           Supprimer
```

**Exemple**: Justifier une absence
```bash
curl -X POST http://localhost:8081/api/justifications/create \
  -H "Content-Type: application/json" \
  -d '{
    "motif": "Maladie du côlon",
    "document": "/documents/certificat.pdf",
    "absenceId": 1,
    "statut": "EN_ATTENTE"
  }'
```

---

### 5️⃣ **COMMENTAIRE** - Commentaires sur le système

**Utilité**: Permettre aux utilisateurs de laisser des commentaires

**Propriétés**:
- `contenu`: Texte du commentaire
- `dateCommentaire`: Date du commentaire
- `supprimeur`: Boolean (soft delete)
- Relation: Créé par un User

**Endpoints**:
```
POST   /api/commentaires/create           Créer
GET    /api/commentaires/{id}             Récupérer
GET    /api/commentaires/all              Tous
GET    /api/commentaires/active           Actifs uniquement
PUT    /api/commentaires/{id}             Modifier
DELETE /api/commentaires/{id}             Supprimer (soft)
```

**Exemple**: Créer un commentaire
```bash
curl -X POST http://localhost:8081/api/commentaires/create \
  -H "Content-Type: application/json" \
  -d '{
    "contenu": "Très bon cours, merci!",
    "userId": 1
  }'
```

---

### 6️⃣ **DEMANDE_STAGE** - Demandes de stage

**Utilité**: Gérer les demandes de stage en entreprise

**Propriétés**:
- `description`: Description du stage souhaité
- `entreprise`: Nom de l'entreprise
- `responsableStage`: Personne responsable
- `statut`: EN_ATTENTE, ACCEPTEE, REFUSEE, COMPLETEE
- `urgent`: Boolean
- Relation: Liée à un Étudiant

**Statuts**:
- `EN_ATTENTE`: En attente de validation
- `ACCEPTEE`: Validée
- `REFUSEE`: Non acceptée
- `COMPLETEE`: Stage terminé

**Endpoints**:
```
POST   /api/demandes-stage/create         Créer
GET    /api/demandes-stage/{id}           Récupérer
GET    /api/demandes-stage/all            Toutes
GET    /api/demandes-stage/pending        En attente
GET    /api/demandes-stage/urgent         Urgentes
PUT    /api/demandes-stage/{id}           Modifier
DELETE /api/demandes-stage/{id}           Supprimer
```

**Exemple**: Créer une demande de stage
```bash
curl -X POST http://localhost:8081/api/demandes-stage/create \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Stage en développement backend",
    "entreprise": "Facebook",
    "responsableStage": "John Doe",
    "statut": "EN_ATTENTE",
    "urgent": false,
    "etudiantId": 1
  }'
```

---

### 7️⃣ **RECLAMATION** - Réclamations et contestations

**Utilité**: Gérer les réclamations d'étudiants

**Propriétés**:
- `motif`: Raison de la réclamation
- `typeReclamation`: Type (NOTE, ABSENCE, AUTRE)
- `statut`: EN_ATTENTE, TRAITEE, ACCEPTEE, REFUSEE
- `urgent`: Boolean
- Relations: Liée à un Étudiant et un Admin

**Statuts**:
- `EN_ATTENTE`: Non traitée
- `TRAITEE`: En cours de traitement
- `ACCEPTEE`: Réclamation acceptée
- `REFUSEE`: Réclamation rejetée

**Endpoints**:
```
POST   /api/reclamations/create           Créer
GET    /api/reclamations/{id}             Récupérer
GET    /api/reclamations/all              Toutes
GET    /api/reclamations/pending          En attente
GET    /api/reclamations/urgent           Urgentes
PUT    /api/reclamations/{id}             Modifier
DELETE /api/reclamations/{id}             Supprimer
```

**Exemple**: Créer une réclamation
```bash
curl -X POST http://localhost:8081/api/reclamations/create \
  -H "Content-Type: application/json" \
  -d '{
    "motif": "Je conteste ma note en Java",
    "typeReclamation": "NOTE",
    "statut": "EN_ATTENTE",
    "urgent": true,
    "etudiantId": 1
  }'
```

---

## 🔄 FLUX D'UTILISATION TYPIQUE

### Scénario: Gestion d'un stage

1. **Créer un groupe** pour les étudiants
   ```
   POST /api/groupes/create → Groupe L3-2024
   ```

2. **Créer des matieres** dans le groupe
   ```
   POST /api/matieres/create → Programmation Java
   POST /api/matieres/create → Bases de Données
   ```

3. **Ajouter des notes** aux étudiants
   ```
   POST /api/notes/create → Note étudiant 1 en Java
   POST /api/notes/create → Note étudiant 1 en BD
   ```

4. **L'étudiant demande un stage**
   ```
   POST /api/demandes-stage/create → Demande de stage
   ```

5. **Admin accepte le stage**
   ```
   PUT /api/demandes-stage/{id} → Statut = ACCEPTEE
   ```

6. **L'étudiant peut laisser des commentaires**
   ```
   POST /api/commentaires/create → Merci pour le stage!
   ```

7. **Si problème d'absence, justifier**
   ```
   POST /api/justifications/create → Certificat médical
   ```

---

## 🧪 TEST RAPIDE

### Démarrer l'application
```bash
mvn spring-boot:run
```

### Vérifier que l'API fonctionne
```bash
curl http://localhost:8081/api/groupes/all
```

### Tester tous les endpoints
Voir le fichier `TEST_NEW_ENDPOINTS.sh`

```bash
bash TEST_NEW_ENDPOINTS.sh
```

---

## 📊 RELATIONS ENTRE MODÈLES

```
User
 └── Commentaire (OneToMany)
      └── auteur: User

Etudiant
 ├── Groupe (ManyToOne)
 ├── Note (OneToMany)
 ├── Reclamation (OneToMany)
 └── Demande_Stage (OneToMany)

Admin
 └── Reclamation (OneToMany)

Cours
 └── Matiere (OneToMany)

Enseignant
 └── Matiere (OneToMany)

Matiere
 └── Note (OneToMany)

Absence
 └── Justification (OneToMany)

Groupe
 └── Etudiant (OneToMany)
```

---

## ⚙️ CONFIGURATION

Les modèles utilisent:
- **Framework**: Spring Boot 3.2.0
- **ORM**: JPA/Hibernate
- **Base**: H2 (développement) ou MySQL/PostgreSQL (production)
- **API**: REST avec Spring Web
- **Validation**: Jakarta Bean Validation

---

## 🔐 SÉCURITÉ

À implémenter pour la production:
- ✅ Authentification JWT
- ✅ Autorisation par rôles
- ✅ Validation des données
- ✅ HTTPS
- ✅ Rate limiting

---

## 📝 NOTES

- Tous les modèles ont `createdAt` et `updatedAt` automatiques
- Soft delete implémenté pour `Commentaire`
- Enums utilisés pour les statuts
- Relations en cascades appropriées
- Indices uniques sur les noms

---

**Merci d'utiliser la plateforme éducative! 🎓**

*Dernière mise à jour: Janvier 2026*
