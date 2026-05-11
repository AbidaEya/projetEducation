# Documentation UI complète (Frontend)

Date: 2026-02-13

Ce document décrit **toutes les pages UI**, la **navigation (navbar/topbar + sidebar)**, les **rôles**, et les **appels API** du frontend.

## Table des matières

- [1. Vue d’ensemble](#1-vue-densemble)
- [2. Architecture UI (Router + Layout)](#2-architecture-ui-router--layout)
- [3. Authentification & rôles](#3-authentification--rôles)
- [4. Notifications (dropdown + page)](#4-notifications-dropdown--page)
- [5. Pages publiques](#5-pages-publiques)
- [6. Pages protégées (communes)](#6-pages-protégées-communes)
- [7. Espace Admin](#7-espace-admin)
- [8. Espace Enseignant](#8-espace-enseignant)
- [9. Espace Étudiant](#9-espace-étudiant)
- [10. Composants UI réutilisés](#10-composants-ui-réutilisés)
- [11. Téléchargement / Upload de fichiers](#11-téléchargement--upload-de-fichiers)
- [12. Pages/fichiers présents mais non routés](#12-pagesfichiers-présents-mais-non-routés)

---

## 1. Vue d’ensemble

- **Frontend**: React + TypeScript + Vite + React Router.
- **Backend**: Spring Boot (port 8081 en local).
- **Proxy Vite**: `/api` (et `/uploads`) sont proxy vers `http://localhost:8081`.
  - Voir: [frontend/vite.config.ts](../frontend/vite.config.ts)
- **Base URL API côté frontend**: par défaut `/api` (modifiable via `VITE_API_BASE_URL`).
  - Voir: [frontend/src/api.ts](../frontend/src/api.ts)

### Rôles applicatifs

- `ADMIN`
- `ENSEIGNANT`
- `ETUDIANT`

Les menus et routes affichés changent selon le rôle.

---

## 2. Architecture UI (Router + Layout)

### 2.1 Router global

- Le router est défini dans: [frontend/src/App.tsx](../frontend/src/App.tsx)
- Routes:
  - `/login` (public)
  - `/not-authorized` (public)
  - `/` (protégé): enveloppé par `RequireAuth`, puis layout `AppShell`, puis `protectedRoutes`.

### 2.2 Guard d’accès

- Auth guard: [frontend/src/auth/RequireAuth.tsx](../frontend/src/auth/RequireAuth.tsx)
  - Si non authentifié → redirection vers `/login`.
- Guard de rôle: [frontend/src/auth/RequireRole.tsx](../frontend/src/auth/RequireRole.tsx)
  - Si rôle interdit → redirection vers `/not-authorized`.

### 2.3 Layout principal (Sidebar + Topbar)

Layout: [frontend/src/AppShell.tsx](../frontend/src/AppShell.tsx)

**Sidebar**
- Affiche le branding (Education Portal), puis la carte utilisateur (initiale, nom, rôle), puis le menu.
- Le menu est construit à partir des `navItems` filtrés par rôle.
  - Source: [frontend/src/routes.tsx](../frontend/src/routes.tsx)
  - Filtrage: `getNavItemsForRole(role)`.
- Regroupement: sections (ex: “General”, “Admin · Academic”, “Teaching”, “Student”, …).
- Gestion “collapsed”:
  - Clé localStorage: `ui.sidebarCollapsed`.
- Les items suivants sont volontairement retirés de la sidebar:
  - `/profile` (accès via le bouton profil dans la topbar)
  - `/admin` (path parent non utilisé comme page)

**Topbar (navbar)**
- Bouton `☰` pour réduire/agrandir la sidebar.
- Breadcrumb + titre (dérivés du groupe + label de l’item courant).
- Actions à droite:
  - Notifications (uniquement Enseignant et Étudiant)
  - Bouton Profil (tous)
  - Toggle thème (clair/sombre)
  - Logout

**Thème (light/dark)**
- Stockage: `ui.theme`
- Appliqué via `document.documentElement.dataset.theme`.

---

## 3. Authentification & rôles

### 3.1 Stockage de session

- Stockage local: `edu.auth.session`.
- Implémentation: [frontend/src/auth/authStorage.ts](../frontend/src/auth/authStorage.ts)

### 3.2 AuthContext

- Provider: [frontend/src/auth/AuthContext.tsx](../frontend/src/auth/AuthContext.tsx)
- Données exposées:
  - `user` (id, email, firstName, lastName, role)
  - `isAuthenticated`
  - `login(email, password)`
  - `logout()`
  - `refreshUser()`

### 3.3 Logique de login

La page de login appelle `login()` (dans `AuthContext`) qui:
- “Détecte” le rôle en testant l’existence de l’email sur des endpoints de rôle:
  - `/admins/by-email/{email}`
  - `/enseignants/by-email/{email}`
  - `/etudiants/by-email/{email}`
- Compare ensuite le champ `password` retourné par l’API avec le mot de passe saisi.

Page login: [frontend/src/pages/LoginPage.tsx](../frontend/src/pages/LoginPage.tsx)

Comptes “presets” (démo) visibles dans l’UI:
- Admin: `admin@education.com / admin123`
- Enseignant: `enseignant1@education.com / pass123`
- Étudiant: `etudiant1@education.com / pass123`

---

## 4. Notifications (dropdown + page)

### 4.1 NotificationProvider

- Provider: [frontend/src/auth/NotificationContext.tsx](../frontend/src/auth/NotificationContext.tsx)
- Chargement:
  - GET `/notifications/user/{userId}`
  - Filtre client: ne garde que `statutApprobation === "APPROUVE"`
- Marquer comme lu:
  - PUT `/notifications/{id}/read`
- Marquer tout comme lu:
  - PUT `/notifications/user/{userId}/read-all`
- Rafraîchissement automatique: toutes les 30 secondes.

### 4.2 Dropdown dans la topbar

Dans: [frontend/src/AppShell.tsx](../frontend/src/AppShell.tsx)
- Affiche les 5 dernières notifications approuvées.
- Clique sur une notification → `markAsRead(id)`.
- Bouton “Voir toutes les notifications” → navigate vers `/notifications`.

### 4.3 Page “Mes Notifications”

Route: `/notifications` (ENSEIGNANT, ETUDIANT)
- Page: [frontend/src/pages/NotificationsPage.tsx](../frontend/src/pages/NotificationsPage.tsx)
- Filtres:
  - Toutes / Non lues / Lues
- Actions:
  - Marquer une notification comme lue
  - Marquer toutes comme lues

---

## 5. Pages publiques

### 5.1 /login

- Page: [frontend/src/pages/LoginPage.tsx](../frontend/src/pages/LoginPage.tsx)
- Contenu:
  - Sélecteur de rôle (cartes + segment)
  - Champs email / mot de passe (avec afficher/masquer)
  - Toggle thème
- Action:
  - `login(email, password)` puis redirection vers `/dashboard`.
- API indirectement via `AuthContext`:
  - GET `/admins/by-email/{email}` ou `/enseignants/by-email/{email}` ou `/etudiants/by-email/{email}`.

### 5.2 /not-authorized

- Page: [frontend/src/pages/NotAuthorizedPage.tsx](../frontend/src/pages/NotAuthorizedPage.tsx)
- Message: “Accès refusé”
- Bouton: retour `/dashboard`.

---

## 6. Pages protégées (communes)

### 6.1 /dashboard

- Page: [frontend/src/pages/DashboardPage.tsx](../frontend/src/pages/DashboardPage.tsx)
- But: afficher des compteurs “live” depuis l’API.
- UI:
  - Cards (StatCard) groupées dans une grille.
  - Total calculé par reduce.
- Endpoints (selon rôle):
  - Admin: `/departements`, `/groupes`, `/enseignants`, `/etudiants`, `/cours`, `/classes`, `/devoirs`
  - Enseignant: `/cours/enseignant/{id}`, `/classes/enseignant/{id}`, `/devoirs/enseignant/{id}`, `/soumissions/pending`
  - Étudiant: `/cours`, `/devoirs`, `/soumissions/etudiant/{id}`, `/notifications`

### 6.2 /profile

- Page: [frontend/src/pages/ProfilePage.tsx](../frontend/src/pages/ProfilePage.tsx)
- UI:
  - Carte profil (photo stockée localStorage)
  - Informations (nom, email, rôle, id)
  - Modal d’édition
- Stockage photo:
  - localStorage key: `profilePicture.{userId}`
- API:
  - PUT `/users/{id}` (update firstName/lastName/email)

---

## 7. Espace Admin

Les routes admin sont décrites dans: [frontend/src/routes.tsx](../frontend/src/routes.tsx)

### 7.1 Pages “CRUD générique” (ResourcePage)

Beaucoup d’écrans Admin utilisent la page générique:
- Page générique: [frontend/src/pages/ResourcePage.tsx](../frontend/src/pages/ResourcePage.tsx)
- Formulaire: [frontend/src/ui/ResourceForm.tsx](../frontend/src/ui/ResourceForm.tsx)
- Table: [frontend/src/ui/ResourceTable.tsx](../frontend/src/ui/ResourceTable.tsx)

Fonctionnement:
- Liste: GET `listEndpoint` (par défaut = `endpoint`).
- Création: POST `createEndpoint` (par défaut = `endpoint`).
- Update: PUT `{endpoint}/{id}`.
- Delete: DELETE `{endpoint}/{id}`.
- Champs `select`:
  - Charge options via GET `optionsEndpoint`.

#### 7.1.1 /admin/users
- Type: ResourcePage en mode “liste” (pas de `fields` → pas de CRUD UI).
- Endpoint:
  - GET `/users`

#### 7.1.2 /admin/admins
- CRUD complet
- Endpoint principal: `/admins`
- Options: aucune

#### 7.1.3 /admin/enseignants
- CRUD complet
- Endpoint principal: `/enseignants`
- Options:
  - `/departements`

#### 7.1.4 /admin/etudiants
- CRUD complet
- Endpoint principal: `/etudiants`
- Options:
  - `/groupes`
  - `/departements`

#### 7.1.5 /admin/departements
- CRUD complet
- Endpoint: `/departements`

#### 7.1.6 /admin/groupes
- CRUD complet
- Endpoint: `/groupes`

#### 7.1.7 /admin/classes
- CRUD complet
- Endpoint: `/classes`
- Options:
  - `/enseignants`

#### 7.1.8 /admin/cours
- CRUD complet
- Endpoint: `/cours`
- Options:
  - `/departements`
  - `/enseignants`

#### 7.1.9 /admin/devoirs
- CRUD complet
- Endpoint: `/devoirs`
- Options:
  - `/cours`
  - `/enseignants`

#### 7.1.10 /admin/emploi-du-temps
- CRUD complet
- Endpoint: `/emploi-du-temps`
- Options:
  - `/cours`

#### 7.1.11 /admin/matieres
- CRUD complet
- Endpoints:
  - GET (list): `/matieres/all`
  - POST (create): `/matieres/create`
  - PUT/DELETE: `{endpoint}/{id}` (endpoint base = `/matieres`)
- Options:
  - `/cours`
  - `/enseignants`

#### 7.1.12 /admin/projets
- CRUD complet
- Endpoint: `/projets`
- Options:
  - `/enseignants`

#### 7.1.13 /admin/reclamations
- CRUD complet
- Endpoints:
  - GET: `/reclamations/all`
  - POST: `/reclamations/create`
  - Base: `/reclamations`
- Options:
  - `/etudiants`
  - `/admins`

#### 7.1.14 /admin/commentaires
- CRUD complet
- Endpoints:
  - GET: `/commentaires/all`
  - POST: `/commentaires/create`
  - Base: `/commentaires`
- Options:
  - `/users`

### 7.2 Pages Admin spécifiques (non ResourcePage)

#### 7.2.1 /admin/soumissions
- Page: [frontend/src/pages/admin/AdminSoumissionsPage.tsx](../frontend/src/pages/admin/AdminSoumissionsPage.tsx)
- But: consulter et évaluer les soumissions.
- UI:
  - Table + recherche.
  - Modal “Consulter”.
  - Modal “Évaluer”: accepter/refuser avec note + feedback.
- API:
  - GET `/soumissions/all`
  - POST `/soumissions/{id}/evaluate`

#### 7.2.2 /admin/absences
- Page: [frontend/src/pages/admin/AdminAbsencesPage.tsx](../frontend/src/pages/admin/AdminAbsencesPage.tsx)
- But: valider/refuser des absences.
- UI:
  - Table + recherche + modal consultation.
  - Actions “Accepter” / “Refuser”.
  - Petit état “reviewed” côté client pour masquer les actions.
- Stockage local:
  - `admin.absences.reviewed.v1`
- API:
  - GET `/absences`
  - PUT `/absences/{id}` (mise à jour statut)

#### 7.2.3 /admin/justifications
- Page: [frontend/src/pages/admin/AdminJustificationsPage.tsx](../frontend/src/pages/admin/AdminJustificationsPage.tsx)
- But: consulter les justificatifs (documents) et accepter/refuser.
- UI:
  - Table + recherche.
  - Bouton “Consulter” → modal.
  - “Consulter” tente aussi de marquer l’élément comme consulté.
- Téléchargement document:
  - Si `document` est un path → converti en `/api/files/download?path=...`.
- API:
  - GET `/justifications/all`
  - POST `/justifications/{id}/consult`
  - PUT `/justifications/{id}` (changement `statut`)

#### 7.2.4 /admin/demandes
- Page: [frontend/src/pages/admin/AdminDemandesPage.tsx](../frontend/src/pages/admin/AdminDemandesPage.tsx)
- But: traiter les demandes (hors stages).
- UI:
  - Table + recherche + modal consultation.
  - Actions: accepter/refuser si `statut === EN_ATTENTE`.
- API:
  - GET `/demandes`
  - PUT `/demandes/{id}`

#### 7.2.5 /admin/demandes-stage
- Page: [frontend/src/pages/admin/AdminDemandesStagePage.tsx](../frontend/src/pages/admin/AdminDemandesStagePage.tsx)
- But: traiter les demandes de stage.
- UI:
  - Table + recherche + modal consultation.
  - Actions: accepter/refuser si `statut === EN_ATTENTE`.
- API:
  - GET `/demandes-stage`
  - PUT `/demandes-stage/{id}`

#### 7.2.6 /admin/notes (+ /admin/double-correction)
- Page: [frontend/src/pages/admin/AdminNotesPage.tsx](../frontend/src/pages/admin/AdminNotesPage.tsx)
- But:
  1) gestion des notes (liste + édition + suppression)
  2) “double correction”: traiter les demandes d’étudiants et transférer au professeur.
- API:
  - GET `/notes/admin-view`
  - PUT `/notes/{id}`
  - DELETE `/notes/{id}`
  - GET `/reclamation-notes/pending-admin`
  - PUT `/reclamation-notes/{id}/forward` (admin propose une valeur et forward)

#### 7.2.7 /admin/notifications
- Page: [frontend/src/pages/admin/AdminNotificationsPage.tsx](../frontend/src/pages/admin/AdminNotificationsPage.tsx)
- But:
  - envoyer des annonces (à un user ou à un rôle)
  - approuver/rejeter les demandes envoyées par les enseignants
  - lister et supprimer des notifications
- UI:
  - Tabs: Envoyer / En attente / Toutes
  - Formulaire d’envoi
  - Listes + actions d’approbation/rejet
- API:
  - GET `/users`
  - GET `/notifications`
  - GET `/notifications/admin/pending`
  - POST `/notifications/admin/send`
  - POST `/notifications/admin/broadcast`
  - PUT `/notifications/admin/{id}/approve`
  - PUT `/notifications/admin/{id}/reject`
  - DELETE `/notifications/{id}`

---

## 8. Espace Enseignant

### 8.1 /enseignant/cours

- Page: [frontend/src/pages/enseignant/EnseignantCoursPage.tsx](../frontend/src/pages/enseignant/EnseignantCoursPage.tsx)
- But:
  - voir ses cours
  - créer un cours
  - uploader une ressource de cours
- UI:
  - Table + recherche
  - Modal upload ressource
  - Modal création cours
- API:
  - GET `/cours/enseignant/{enseignantId}`
  - GET `/departements`
  - POST `/cours`
  - POST form-data `/cours/{coursId}/upload-resource`

### 8.2 /enseignant/classes

- Page: [frontend/src/pages/enseignant/EnseignantClassesPage.tsx](../frontend/src/pages/enseignant/EnseignantClassesPage.tsx)
- Type: ResourcePage (CRUD activé)
- API:
  - GET `/classes/enseignant/{id}`
  - POST `/classes`
  - PUT `/classes/{id}`
  - DELETE `/classes/{id}`

### 8.3 /enseignant/devoirs

- Page: [frontend/src/pages/enseignant/EnseignantDevoirsPage.tsx](../frontend/src/pages/enseignant/EnseignantDevoirsPage.tsx)
- Type: ResourcePage (CRUD activé)
- API:
  - GET `/devoirs/enseignant/{id}`
  - POST `/devoirs`
  - PUT `/devoirs/{id}`
  - DELETE `/devoirs/{id}`

### 8.4 /enseignant/evaluations

- Page: [frontend/src/pages/enseignant/PendingEvaluationsPage.tsx](../frontend/src/pages/enseignant/PendingEvaluationsPage.tsx)
- But: évaluer les soumissions.
- UI:
  - Table “en attente” + formulaire d’évaluation inline (note + feedback + suggestions)
  - Table “évaluations effectuées” (historique)
- API:
  - GET `/soumissions/all`
  - GET `/etudiants`
  - GET `/devoirs`
  - GET `/cours`
  - POST `/soumissions/{id}/evaluate`

### 8.5 /enseignant/reclamations-notes

- Page: [frontend/src/pages/enseignant/EnseignantReclamationsNotesPage.tsx](../frontend/src/pages/enseignant/EnseignantReclamationsNotesPage.tsx)
- But: traiter les réclamations de notes forwardées par l’admin.
- UI:
  - Table + recherche
  - Modal de traitement (commentaire + accepter/refuser)
- API:
  - GET `/reclamation-notes/enseignant/{enseignantId}/pending`
  - PUT `/reclamation-notes/{id}/review`

### 8.6 /enseignant/emploi-du-temps

- Page: [frontend/src/pages/enseignant/EnseignantEmploiDuTempsPage.tsx](../frontend/src/pages/enseignant/EnseignantEmploiDuTempsPage.tsx)
- But: afficher un planning (emploi du temps) basé sur les cours de l’enseignant.
- Stratégie:
  - GET cours de l’enseignant
  - pour chaque cours: GET emploi du temps du cours
  - aplatit en une liste d’items
- API:
  - GET `/cours/enseignant/{enseignantId}`
  - GET `/emploi-du-temps/cours/{coursId}`
- Composant d’affichage:
  - [frontend/src/pages/timetable/TimetableTable.tsx](../frontend/src/pages/timetable/TimetableTable.tsx)

### 8.7 /enseignant/notifications

- Page: [frontend/src/pages/enseignant/EnseignantNotificationsPage.tsx](../frontend/src/pages/enseignant/EnseignantNotificationsPage.tsx)
- But: créer une notification à des étudiants (soumise à approbation admin).
- UI:
  - Tabs: Créer / Historique
  - Envoi vers 1 étudiant ou plusieurs.
  - Historique des demandes (statut: en attente / approuvé / rejeté)
- API:
  - GET `/etudiants`
  - GET `/notifications/enseignant/{enseignantId}/created`
  - POST `/notifications/enseignant/request`
  - POST `/notifications/enseignant/broadcast`

---

## 9. Espace Étudiant

### 9.1 /etudiant/cours

- Page: [frontend/src/pages/etudiant/EtudiantCoursPage.tsx](../frontend/src/pages/etudiant/EtudiantCoursPage.tsx)
- But: voir tous les cours disponibles et télécharger les ressources.
- API:
  - GET `/cours`
- Download:
  - `/api/files/download?path=...`

### 9.2 /etudiant/devoirs

- Page: [frontend/src/pages/etudiant/EtudiantDevoirsPage.tsx](../frontend/src/pages/etudiant/EtudiantDevoirsPage.tsx)
- But:
  - voir les devoirs groupés par cours
  - ouvrir ressources de cours
  - soumettre un devoir (navigation vers page de soumission)
- UI:
  - Grouping par `coursNom`
  - Affiche deadline + temps restant + état “Expiré”
  - Bouton `Soumettre` vers `/etudiant/soumettre?devoirId=...`
- API:
  - GET `/devoirs`

### 9.3 /etudiant/soumissions et /etudiant/soumettre

- Page (les deux routes pointent sur la même page): [frontend/src/pages/etudiant/EtudiantSoumissionsPage.tsx](../frontend/src/pages/etudiant/EtudiantSoumissionsPage.tsx)
- But:
  - soumettre un devoir (upload)
  - consulter l’historique et feedback
- API:
  - GET `/devoirs` (liste pour le select)
  - GET `/soumissions/etudiant/{etudiantId}`
  - POST form-data `/soumissions/submit-file`
- Download:
  - lien `/api/files/download?path=...`

### 9.4 /etudiant/notes

- Page: [frontend/src/pages/etudiant/EtudiantNotesPage.tsx](../frontend/src/pages/etudiant/EtudiantNotesPage.tsx)
- But:
  - afficher les notes de l’étudiant
  - calcul de moyenne
  - demander une double correction
- API:
  - GET `/notes/all`
  - POST `/reclamation-notes/etudiant/request` (motif + urgent)

### 9.5 /etudiant/emploi-du-temps

- Page: [frontend/src/pages/etudiant/EtudiantEmploiDuTempsPage.tsx](../frontend/src/pages/etudiant/EtudiantEmploiDuTempsPage.tsx)
- But: afficher le planning basé sur le département de l’étudiant.
- Stratégie:
  - GET `/etudiants/{id}` → récupérer `departement.id`
  - GET `/cours/departement/{deptId}`
  - pour chaque cours: GET `/emploi-du-temps/cours/{coursId}`
- UI:
  - Affiche aussi le professeur si disponible.

### 9.6 /etudiant/absences

- Page: [frontend/src/pages/etudiant/EtudiantAbsencesPage.tsx](../frontend/src/pages/etudiant/EtudiantAbsencesPage.tsx)
- But: voir ses absences et déposer une justification avec fichier.
- UI:
  - Table + recherche
  - Modal “Justifier” si statut non justifiée.
- API:
  - GET `/absences/etudiant/{etudiantId}`
  - POST form-data `/justifications/create-file` (absenceId + motif + file)

### 9.7 /etudiant/demandes

- Page: [frontend/src/pages/etudiant/EtudiantDemandesPage.tsx](../frontend/src/pages/etudiant/EtudiantDemandesPage.tsx)
- But: déposer des demandes administratives (hors stage) via modèles, et suivre l’état.
- UI:
  - OptionPicker: modèles de demande
  - “Urgent” + détails
  - Table d’historique
- API:
  - GET `/demandes/etudiant/{etudiantId}`
  - POST `/demandes`

### 9.8 /etudiant/demandes-stage

- Page: [frontend/src/pages/etudiant/EtudiantDemandesStagePage.tsx](../frontend/src/pages/etudiant/EtudiantDemandesStagePage.tsx)
- But: déposer et suivre une demande de stage.
- UI:
  - Modal création
  - Layout “master/detail”
  - Tabs: Infos / Entreprise / Encadrement / Dépôt
  - Génère une “lettre d’affectation” imprimable (HTML + `window.print()`)
  - Dépôt stage: UI prête mais upload backend non géré (champs désactivés)
- API:
  - GET `/demandes-stage`
  - POST `/demandes-stage/create`

### 9.9 /etudiant/reclamations

- Page: [frontend/src/pages/etudiant/EtudiantReclamationsPage.tsx](../frontend/src/pages/etudiant/EtudiantReclamationsPage.tsx)
- But: déposer une réclamation “générique” et suivre son statut.
- API:
  - GET `/reclamations`
  - POST `/reclamations/create`

---

## 10. Composants UI réutilisés

### 10.1 Section

- [frontend/src/components/Section.tsx](../frontend/src/components/Section.tsx)
- Standardise:
  - titre + sous-titre
  - conteneur “section-body”

### 10.2 Modal

- [frontend/src/components/Modal.tsx](../frontend/src/components/Modal.tsx)
- Pattern:
  - backdrop + boîte
  - header + bouton close
  - footer optionnel

### 10.3 Toast

- [frontend/src/components/Toast.tsx](../frontend/src/components/Toast.tsx)
- Utilisation:
  - `showToast(message, type)`
  - `ToastContainer` est monté globalement dans App.

### 10.4 ErrorBoundary

- [frontend/src/components/ErrorBoundary.tsx](../frontend/src/components/ErrorBoundary.tsx)
- Capture les crash React et propose un bouton “Recharger”.

### 10.5 ResourcePage / ResourceForm / ResourceTable

- CRUD générique configurable depuis `routes.tsx`.
- ResourceForm:
  - gère les types input (`text`, `email`, `number`, `datetime-local`, `textarea`, `checkbox`, `select`)
  - validation des champs `required`
- ResourceTable:
  - affiche automatiquement les premières colonnes détectées

---

## 11. Téléchargement / Upload de fichiers

### Téléchargement

Plusieurs pages utilisent l’endpoint de download:
- `/api/files/download?path={...}`

Exemples:
- Ressources de cours (enseignant et étudiant)
- Justifications (admin)
- Soumissions (enseignant/admin/étudiant)

### Upload

- Soumission d’un devoir:
  - POST form-data `/soumissions/submit-file`
- Justification d’absence:
  - POST form-data `/justifications/create-file`
- Upload ressource de cours (enseignant):
  - POST form-data `/cours/{id}/upload-resource`

---

## 12. Pages/fichiers présents mais non routés

Certains fichiers existent mais ne sont pas exposés dans `protectedRoutes` (ou ne sont pas dans la sidebar):

- Page Paramètres:
  - [frontend/src/pages/SettingsPage.tsx](../frontend/src/pages/SettingsPage.tsx)
  - API: PUT `/users/{id}` et PUT `/users/{id}/password`
  - (Pas de route correspondante dans `routes.tsx` actuellement.)

- Page Étudiant Notifications alternative (non utilisée par les routes actuelles):
  - [frontend/src/pages/etudiant/EtudiantNotificationsPage.tsx](../frontend/src/pages/etudiant/EtudiantNotificationsPage.tsx)
  - Les routes utilisent plutôt `/notifications` → [frontend/src/pages/NotificationsPage.tsx](../frontend/src/pages/NotificationsPage.tsx)

- Pages admin supplémentaires listées dans le repo (si vous voulez les activer dans le menu, il faut ajouter des routes + navItems dans `routes.tsx`):
  - [frontend/src/pages/admin/AdminInscriptionsPage.tsx](../frontend/src/pages/admin/AdminInscriptionsPage.tsx)
  - [frontend/src/pages/admin/AdminPendingReclamationsNotesPage.tsx](../frontend/src/pages/admin/AdminPendingReclamationsNotesPage.tsx)
  - [frontend/src/pages/admin/AdminOverviewPage.tsx](../frontend/src/pages/admin/AdminOverviewPage.tsx)

---

### Références principales (code)

- Layout: [frontend/src/AppShell.tsx](../frontend/src/AppShell.tsx)
- Routes & menu: [frontend/src/routes.tsx](../frontend/src/routes.tsx)
- API client: [frontend/src/api.ts](../frontend/src/api.ts)
- Auth: [frontend/src/auth/AuthContext.tsx](../frontend/src/auth/AuthContext.tsx)
- Notifications: [frontend/src/auth/NotificationContext.tsx](../frontend/src/auth/NotificationContext.tsx)
