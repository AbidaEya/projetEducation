# 🏗️ Architecture du Projet

## Vue d'Ensemble de l'Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Frontend)                         │
│                (Web, Mobile, Desktop Applications)               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ↓ HTTP REST API
┌─────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT APPLICATION                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           CONTROLLERS (REST Endpoints)                   │   │
│  │  - UserController      /api/users                        │   │
│  │  - ClasseController    /api/classes                      │   │
│  │  - CoursController     /api/cours                        │   │
│  │  - DevoirController    /api/devoirs                      │   │
│  │  - SoumissionController /api/soumissions                 │   │
│  │  - InscriptionController /api/inscriptions               │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │ (Reçoit les requêtes HTTP)               │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │           SERVICES (Logique Métier)                      │   │
│  │  - UserService          (Gestion des utilisateurs)       │   │
│  │  - ClasseService        (Gestion des classes)            │   │
│  │  - CoursService         (Gestion des cours)              │   │
│  │  - DevoirService        (Gestion des devoirs)            │   │
│  │  - SoumissionService    (Gestion des soumissions)        │   │
│  │  - InscriptionService   (Gestion des inscriptions)       │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │ (Exécute la logique métier)              │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │        REPOSITORIES (Accès aux Données - JPA)            │   │
│  │  - UserRepository       (Requêtes sur User)              │   │
│  │  - ClasseRepository     (Requêtes sur Classe)            │   │
│  │  - CoursRepository      (Requêtes sur Cours)             │   │
│  │  - DevoirRepository     (Requêtes sur Devoir)            │   │
│  │  - SoumissionRepository (Requêtes sur Soumission)        │   │
│  │  - InscriptionRepository(Requêtes sur Inscription)       │   │
│  │  - EvaluationRepository (Requêtes sur Evaluation)        │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │ (Requêtes SQL générées par Hibernate)    │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │             DTOs (Data Transfer Objects)                 │   │
│  │  - UserDTO             - EvaluationDTO                   │   │
│  │  - ClasseDTO           - InscriptionDTO                  │   │
│  │  - CoursDTO            - UserRegistrationDTO             │   │
│  │  - DevoirDTO                                              │   │
│  │  - SoumissionDTO                                          │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │ (Transfert sécurisé des données)         │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │           MODELS / ENTITIES (JPA)                        │   │
│  │  - User                (Admin, Enseignant, Étudiant)     │   │
│  │  - Classe              (Groupe d'étudiants)              │   │
│  │  - Cours               (Contenu pédagogique)             │   │
│  │  - Devoir              (Travaux assignés)                │   │
│  │  - Soumission          (Réponses aux devoirs)            │   │
│  │  - Inscription         (Inscription étudiant-classe)     │   │
│  │  - Evaluation          (Tests/Évaluations)               │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
└───────────────────────┼─────────────────────────────────────────┘
                        │ JPA/Hibernate ORM
┌───────────────────────▼─────────────────────────────────────────┐
│              DATABASE (H2 - Développement)                       │
│                                                                   │
│  Tables:                                                          │
│  - USERS (7 colonnes)                                             │
│  - CLASSES (5 colonnes)                                           │
│  - COURS (7 colonnes)                                             │
│  - DEVOIRS (7 colonnes)                                           │
│  - SOUMISSIONS (9 colonnes)                                       │
│  - INSCRIPTIONS (7 colonnes)                                      │
│  - EVALUATIONS (8 colonnes)                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Flux d'une Requête

```
1. Client envoie une requête HTTP
   ↓
2. Spring DispatcherServlet reçoit la requête
   ↓
3. RequestMapping route vers le bon Controller
   ↓
4. Controller appelle la Service
   ↓
5. Service exécute la logique métier
   ↓
6. Service appelle le Repository
   ↓
7. Repository exécute la requête JPA/SQL
   ↓
8. Résultat retourné au Service
   ↓
9. Service retourne au Controller
   ↓
10. Controller formate la réponse en JSON
   ↓
11. Réponse HTTP retournée au Client
```

## Couches de l'Application

### 1. **Couche Présentation (Controllers)**
- Reçoit les requêtes HTTP
- Valide les paramètres
- Appelle les services
- Retourne les réponses JSON

**Files:**
```
controller/
├── UserController.java
├── ClasseController.java
├── CoursController.java
├── DevoirController.java
├── SoumissionController.java
└── InscriptionController.java
```

### 2. **Couche Métier (Services)**
- Contient la logique applicative
- Effectue les calculs
- Coordonne les opérations
- Gère les transactions

**Files:**
```
service/
├── UserService.java
├── ClasseService.java
├── CoursService.java
├── DevoirService.java
├── SoumissionService.java
└── InscriptionService.java
```

### 3. **Couche Données (Repositories)**
- Accès à la base de données
- Requêtes JPA/SQL
- Opérations CRUD
- Requêtes personnalisées

**Files:**
```
repository/
├── UserRepository.java
├── ClasseRepository.java
├── CoursRepository.java
├── DevoirRepository.java
├── SoumissionRepository.java
├── InscriptionRepository.java
└── EvaluationRepository.java
```

### 4. **Couche Modèle (Entities)**
- Représentation des données
- Annotations JPA
- Relations entre entités
- Validations

**Files:**
```
model/
├── User.java
├── Classe.java
├── Cours.java
├── Devoir.java
├── Soumission.java
├── Inscription.java
└── Evaluation.java
```

### 5. **Couche Transfert (DTOs)**
- Objets de transfert
- Sécurité (ne pas exposer les entités)
- Validation des données
- Formatage des réponses

**Files:**
```
dto/
├── UserDTO.java
├── UserRegistrationDTO.java
├── ClasseDTO.java
├── CoursDTO.java
├── DevoirDTO.java
├── SoumissionDTO.java
├── InscriptionDTO.java
└── EvaluationDTO.java
```

## Relations entre Entités

```
User (1) ─────── (Many) Classe
  │ enseignant
  │
  ├─► (Many) Cours ─────(Many)─────► Classe
  │ enseignant              |
  │                         │ (1 classe)
  ├─► (Many) Devoir        │
  │ enseignant              │
  │                         └─► (Many) Inscription
  │
Étudiant (1) ─────────(Many)─────► Inscription ─────(1)───► Classe
             | Student     | (1 student)
             |             |
             └────────┬────┘
                      │
                      └─► (Many) Soumission ────(1)───► Devoir
                                                |
                                                └──────(1)───► Cours
```

## Configuration et Exceptions

```
config/
├── CorsConfig.java           (Configuration CORS)
├── GlobalExceptionHandler.java (Gestion des erreurs)
├── DataInitializer.java      (Données initiales)
└── ApiResponse.java          (Format de réponse)
```

## Flux des Données - Exemple: Soumettre un Devoir

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/soumissions/submit
       │ {devoirId: 1, etudiantId: 3, contenu: "..."}
       ↓
┌──────────────────────────┐
│ SoumissionController     │
│ submitDevoir()           │
└──────────┬───────────────┘
           │
           │ Crée SoumissionDTO
           ↓
┌──────────────────────────┐
│ SoumissionService        │
│ submitDevoir()           │
└──────────┬───────────────┘
           │
           │ Récupère Devoir et User
           ↓
┌──────────────────────────┐
│ DevoirRepository         │
│ findById()               │
└──────────┬───────────────┘
           │
           │ Récupère User
           ↓
┌──────────────────────────┐
│ UserRepository           │
│ findById()               │
└──────────┬───────────────┘
           │
           │ Crée Soumission
           ↓
┌──────────────────────────┐
│ SoumissionRepository     │
│ save()                   │
└──────────┬───────────────┘
           │
           │ SQL INSERT
           ↓
┌──────────────────────────┐
│ H2 Database              │
│ SOUMISSIONS table        │
└──────────┬───────────────┘
           │
           │ Retourne Soumission
           ↓
┌──────────────────────────┐
│ Convertir en DTO         │
│ SoumissionDTO            │
└──────────┬───────────────┘
           │
           │ JSON Response
           ↓
┌─────────────┐
│   Client    │
│  (Frontend) │
└─────────────┘
```

## Points d'Extensibilité

### 1. **Ajouter une nouvelle entité**
- Créer Model
- Créer Repository
- Créer Service
- Créer DTO
- Créer Controller

### 2. **Ajouter une nouvelle fonctionnalité**
- Ajouter méthode dans Service
- Ajouter endpoint dans Controller
- Ajouter méthode de requête dans Repository

### 3. **Ajouter de la sécurité**
- Ajouter JWT AuthenticationProvider
- Ajouter Security Config
- Annoter endpoints avec @PreAuthorize

### 4. **Ajouter des validations**
- Ajouter annotations @Valid sur DTOs
- Utiliser Jakarta Bean Validation
- Créer CustomValidator si nécessaire

## Dépendances Principales

```
pom.xml
├── spring-boot-starter-web       (REST API)
├── spring-boot-starter-data-jpa  (JPA/Hibernate)
├── h2                            (Database)
├── lombok                        (Code boilerplate)
└── jakarta.validation            (Validation)
```

## Bonnes Pratiques Suivies

✅ **Architecture en couches** - Séparation des responsabilités
✅ **Single Responsibility** - Chaque classe a une responsabilité unique
✅ **DRY (Don't Repeat Yourself)** - Pas de duplication
✅ **SOLID Principles** - Code maintenable
✅ **RESTful conventions** - URLs et verbes HTTP standards
✅ **Exception Handling** - Gestion centralisée des erreurs
✅ **Logging** - Trace pour debugging
✅ **DTOs** - Sécurité et flexibilité
✅ **Transactions** - Cohérence des données
✅ **Documentation** - Code lisible et commenté

---

Cette architecture est **scalable** et **maintenable** pour une croissance future! 🚀
