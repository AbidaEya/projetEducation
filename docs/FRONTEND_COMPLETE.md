## 1) Structure globale de l’application

### 1.1 Layout commun (structure de base)

Toutes les pages protégées s’affichent dans une même structure :

- Sidebar (menu) à gauche
- Topbar (barre du haut) avec actions globales
- Zone centrale (contenu de la page)

### 1.2 Sidebar (menu)

La sidebar est un menu regroupé par sections (ex: Général, Administration, Enseignement, Étudiant). Elle affiche :

- Identité utilisateur : initiale/avatar, nom/prénom, rôle
- Groupes de navigation (sections)
- Éléments de menu (uniquement ceux autorisés pour le rôle)

Attributs/états importants

- État “réduit/étendu” (sidebar collapsée)
- Filtrage par rôle (certains items ne sont jamais visibles pour certains utilisateurs)

### 1.3 Topbar (barre du haut)

La topbar contient :

- Bouton pour réduire/agrandir la sidebar
- Titre/breadcrumb de la page courante
- Bouton Notifications (seulement pour certains rôles)
- Bouton Profil
- Toggle Thème (clair/sombre)
- Bouton Déconnexion

Attributs/états importants

- Thème (clair/sombre)
- Dropdown notifications (ouvert/fermé)

### 1.4 Comportements transverses

- Toasts (petites alertes) pour succès/erreurs
- Modals (fenêtres) pour créer/modifier/consulter
- Gestion d’erreur UI (si une page crash, on affiche un écran de récupération)

---

## 2) Rôles et accès

L’UI est organisée selon trois rôles :

- Admin
- Enseignant
- Étudiant

Règles simples

- Un utilisateur non connecté ne peut accéder qu’aux pages publiques.
- Un utilisateur connecté ne voit que les pages autorisées par son rôle.

---

## 3) Pages publiques

### 3.1 Page “Connexion”

But

- Permettre à un utilisateur de se connecter.

Composition

- Sélecteur de profil (Admin / Enseignant / Étudiant)
- Formulaire de connexion
	- Champ email
	- Champ mot de passe
	- Option afficher/masquer mot de passe
- Bouton “Se connecter”
- Option de thème (clair/sombre)

Attributs/états principaux

- email (texte)
- password (texte)
- showPassword (booléen)
- selectedRole (valeur)
- loading (booléen)
- errorMessage (texte)

### 3.2 Page “Accès refusé”

But

- Informer qu’un utilisateur n’a pas le droit d’accéder à une page.

Composition

- Titre “Accès refusé”
- Texte explicatif
- Bouton de retour (ex: vers la page d’accueil connectée)

---

## 4) Pages communes (connecté)

### 4.1 Page “Dashboard” (Tableau de bord)

But

- Donner une vue rapide de l’activité avec des compteurs.

Composition

- Grille de cartes statistiques
- Chaque carte affiche :
	- un titre
	- un nombre
	- une petite description

Attributs/états principaux

- stats (liste de cartes)
- total (nombre)
- loading (booléen)
- errorMessage (texte)

Variations selon le rôle

- Admin : compteurs globaux (entités académiques, utilisateurs, etc.)
- Enseignant : compteurs liés à ses cours, classes, devoirs, évaluations
- Étudiant : compteurs liés à ses devoirs, soumissions, notifications

### 4.2 Page “Profil”

But

- Afficher et modifier les informations de l’utilisateur.

Composition

- Carte profil (nom, prénom, email, rôle)
- Zone photo/avatar
- Bouton “Modifier”
- Modal d’édition
	- Champs : prénom, nom, email
	- Bouton enregistrer

Attributs/états principaux

- profilePicture (image/base64 ou “absent”)
- editModalOpen (booléen)
- formFirstName (texte)
- formLastName (texte)
- formEmail (texte)
- saving (booléen)
- errorMessage (texte)

### 4.3 Page “Notifications”

But

- Lister les notifications reçues et permettre de les marquer comme lues.

Composition

- Barre d’actions
	- Filtre (toutes / non lues / lues)
	- Bouton “Marquer tout comme lu”
- Liste de notifications
	- titre
	- message
	- date
	- état lu / non lu
	- bouton “marquer comme lu” (si non lu)

Attributs/états principaux

- filterMode (valeur)
- notifications (liste)
- unreadCount (nombre)
- loading (booléen)

---

## 5) Pages Admin

L’espace Admin est composé de deux familles d’écrans :

1) Écrans “CRUD” (liste + ajouter + modifier + supprimer)
2) Écrans “workflow” (validation, évaluation, approbation)

### 5.1 Écrans CRUD (pattern commun)

But

- Gérer une ressource (ex: enseignants, étudiants, cours, classes…).

Composition (commun)

- En-tête : titre + sous-titre
- Barre d’actions
	- Champ recherche
	- Bouton “Ajouter” (si création activée)
- Tableau
	- Colonnes (données)
	- Actions par ligne : modifier / supprimer
- Modal “Créer/Modifier”
	- Formulaire généré à partir de champs
	- Types de champs : texte, email, nombre, date/heure, case à cocher, liste déroulante

Attributs/états principaux

- items (liste)
- search (texte)
- loading (booléen)
- createModalOpen (booléen)
- editModalOpen (booléen)
- selectedItem (objet)
- formState (objet contenant les champs)
- saving (booléen)
- deletingId (id ou “absent”)

Écrans CRUD Admin (exemples)

- Utilisateurs (souvent en lecture seule)
- Admins
- Enseignants
- Étudiants
- Départements
- Groupes
- Classes
- Cours
- Devoirs
- Matières
- Projets
- Emploi du temps
- Réclamations (admin)
- Commentaires

### 5.2 Page “Soumissions” (Admin)

But

- Consulter les soumissions et (selon le workflow) les évaluer.

Composition

- Recherche + tableau des soumissions
- Bouton “Consulter” (ouvre un modal)
	- détails (étudiant, devoir, contenu, fichier)
- Bouton “Évaluer” (ouvre un modal)
	- champ note
	- champ feedback
	- bouton valider

Attributs/états principaux

- soumissions (liste)
- search (texte)
- consultModalOpen (booléen)
- evaluateModalOpen (booléen)
- selectedSoumission (objet)
- note (nombre)
- feedback (texte)
- saving (booléen)

### 5.3 Page “Absences” (Admin)

But

- Décider d’accepter ou refuser des absences.

Composition

- Recherche + tableau
- Modal “Consulter”
- Actions par ligne (selon statut)
	- Accepter
	- Refuser

Attributs/états principaux

- absences (liste)
- search (texte)
- selectedAbsence (objet)
- decisionInProgress (booléen)
- état client “déjà traité” (pour masquer certains boutons)

### 5.4 Page “Justifications” (Admin)

But

- Consulter les justificatifs (documents) et approuver/refuser.

Composition

- Recherche + tableau
- Modal “Consulter”
	- affiche le motif
	- lien de téléchargement du document (si disponible)
- Boutons décision : approuver / refuser

Attributs/états principaux

- justifications (liste)
- search (texte)
- consultModalOpen (booléen)
- selectedJustification (objet)
- decision (valeur)
- saving (booléen)

### 5.5 Page “Demandes” (Admin)

But

- Traiter les demandes administratives (hors stage).

Composition

- Recherche + tableau
- Modal “Consulter” (détails)
- Actions selon statut : accepter / refuser

Attributs/états principaux

- demandes (liste)
- search (texte)
- selectedDemande (objet)
- decisionInProgress (booléen)

### 5.6 Page “Demandes de stage” (Admin)

But

- Traiter les demandes de stage.

Composition

- Recherche + tableau
- Modal “Consulter”
- Actions selon statut : accepter / refuser

Attributs/états principaux

- demandesStage (liste)
- search (texte)
- selectedDemandeStage (objet)
- decisionInProgress (booléen)

### 5.7 Page “Notes” (Admin) + “Double correction”

But

1) Gérer des notes (édition/suppression)
2) Gérer les demandes de double correction (et les transférer au professeur)

Composition

- Onglet/section “Notes”
	- tableau des notes
	- actions : modifier / supprimer
	- modal modifier : champs note, commentaire (selon modèle)
- Onglet/section “Double correction”
	- liste des demandes en attente
	- modal de traitement
		- champ “valeur proposée”
		- bouton transférer

Attributs/états principaux

- notes (liste)
- editModalOpen (booléen)
- selectedNote (objet)
- noteValue (nombre)
- noteComment (texte)
- doubleCorrectionRequests (liste)
- forwardModalOpen (booléen)
- proposedValue (nombre)

### 5.8 Page “Notifications” (Admin)

But

- Envoyer des notifications.
- Approuver/rejeter les demandes de notifications envoyées par les enseignants.
- Visualiser l’historique et éventuellement supprimer.

Composition

- Tabs
	- Envoyer
	- En attente
	- Toutes
- Tab Envoyer
	- Mode 1 : envoyer à une personne
		- sélection destinataire
		- champ titre
		- champ message
	- Mode 2 : envoyer à un rôle (diffusion)
		- sélection rôle
		- champ titre
		- champ message
- Tab En attente
	- liste des demandes
	- actions : approuver / rejeter
- Tab Toutes
	- liste des notifications
	- action : supprimer

Attributs/états principaux

- tab (valeur)
- users (liste pour sélections)
- sendMode (valeur)
- selectedUserId / selectedRole
- title (texte)
- message (texte)
- pendingRequests (liste)
- allNotifications (liste)
- saving (booléen)
- deletingId (id ou “absent”)

---

## 6) Pages Enseignant

### 6.1 Page “Cours” (Enseignant)

But

- Voir ses cours.
- Créer un cours.
- Ajouter une ressource (document) à un cours.

Composition

- Recherche + tableau des cours
- Bouton “Créer” (modal)
	- champs typiques : nom, description, département
- Bouton “Uploader ressource” (modal)
	- sélecteur de fichier
	- champ optionnel description

Attributs/états principaux

- cours (liste)
- search (texte)
- createModalOpen (booléen)
- uploadModalOpen (booléen)
- selectedCours (objet)
- formNom (texte)
- formDescription (texte)
- formDepartementId (valeur)
- uploadFile (fichier)
- saving (booléen)

### 6.2 Page “Classes” (Enseignant)

But

- Gérer ses classes.

Composition

- Écran CRUD (tableau, recherche, modal créer/modifier)

Attributs/états principaux

- classes (liste)
- search (texte)
- modals create/edit
- selectedClasse
- formState

### 6.3 Page “Devoirs” (Enseignant)

But

- Gérer ses devoirs.

Composition

- Écran CRUD (tableau, recherche, modal créer/modifier)

Attributs/états principaux

- devoirs (liste)
- search (texte)
- modals create/edit
- selectedDevoir
- formState

### 6.4 Page “Évaluations” (Enseignant)

But

- Voir les soumissions à corriger.
- Mettre une note et un feedback.

Composition

- Liste/section “En attente”
	- tableau des soumissions non évaluées
	- formulaire d’évaluation (note + feedback)
- Liste/section “Historique”
	- tableau des soumissions déjà évaluées

Attributs/états principaux

- pending (liste)
- evaluated (liste)
- selectedSoumission
- note (nombre)
- feedback (texte)
- saving (booléen)

### 6.5 Page “Réclamations de notes” (Enseignant)

But

- Traiter une réclamation de note (accepter/refuser) et ajouter un commentaire.

Composition

- Tableau + recherche
- Modal de traitement
	- décision (accepter/refuser)
	- commentaire

Attributs/états principaux

- reclamations (liste)
- search (texte)
- reviewModalOpen (booléen)
- decision (valeur)
- commentaire (texte)

### 6.6 Page “Emploi du temps” (Enseignant)

But

- Afficher un planning basé sur les cours de l’enseignant.

Composition

- Sélection/filtre (si présent)
- Tableau planning (jour, heure, salle, cours, etc.)

Attributs/états principaux

- timetableItems (liste)
- loading (booléen)

### 6.7 Page “Notifications” (Enseignant)

But

- Rédiger des notifications à destination des étudiants.
- Les notifications passent par un processus d’approbation (côté admin).

Composition

- Tabs
	- Créer
	- Historique
- Tab Créer
	- mode 1 : envoyer à un étudiant
	- mode 2 : envoyer à plusieurs (diffusion)
	- champs : destinataires, titre, message
- Tab Historique
	- liste des notifications créées
	- statut (en attente / approuvée / rejetée)

Attributs/états principaux

- tab (valeur)
- sendMode (valeur)
- selectedEtudiants (liste)
- title (texte)
- message (texte)
- createdNotifications (liste)
- saving (booléen)

---

## 7) Pages Étudiant

### 7.1 Page “Cours” (Étudiant)

But

- Consulter la liste des cours.
- Télécharger des ressources de cours.

Composition

- Recherche + liste/tableau des cours
- Pour chaque cours :
	- titre
	- description
	- enseignant (si affiché)
	- ressources (liens/téléchargements)

Attributs/états principaux

- cours (liste)
- search (texte)
- loading (booléen)

### 7.2 Page “Devoirs” (Étudiant)

But

- Voir les devoirs disponibles.
- Comprendre les deadlines.
- Aller vers l’écran de soumission.

Composition

- Regroupement par cours
- Carte/liste de devoirs
	- titre
	- description
	- deadline
	- statut (expiré / actif)
	- bouton “Soumettre”

Attributs/états principaux

- devoirs (liste)
- groupedByCours (structure)
- now (date/heure pour calcul “temps restant”)

### 7.3 Page “Soumissions” (Étudiant)

But

- Déposer une soumission (texte + fichier) pour un devoir.
- Consulter l’historique et le feedback.

Composition

- Formulaire de soumission
	- sélection du devoir
	- champ contenu (texte)
	- sélection fichier
	- bouton “Envoyer”
- Tableau historique
	- devoir
	- date
	- statut
	- note/feedback (si disponible)
	- accès au fichier (si disponible)

Attributs/états principaux

- devoirId (valeur)
- contenu (texte)
- file (fichier)
- submitting (booléen)
- soumissions (liste)

### 7.4 Page “Notes” (Étudiant)

But

- Voir ses notes.
- Calculer une moyenne.
- Demander une double correction.

Composition

- Tableau des notes
	- cours/devoir
	- note
	- commentaire (si présent)
- Bloc “Moyenne”
- Action “Demander double correction” (modal)
	- motif (texte)
	- urgent (case)
	- bouton envoyer

Attributs/états principaux

- notes (liste)
- moyenne (nombre)
- requestModalOpen (booléen)
- motif (texte)
- urgent (booléen)
- saving (booléen)

### 7.5 Page “Emploi du temps” (Étudiant)

But

- Afficher le planning (basé sur la filière/département de l’étudiant).

Composition

- Tableau planning
- (Optionnel) affichage du professeur, salle, etc.

Attributs/états principaux

- timetableItems (liste)
- loading (booléen)

### 7.6 Page “Absences” (Étudiant)

But

- Voir ses absences.
- Déposer un justificatif avec un fichier.

Composition

- Tableau absences
	- date
	- raison (si présente)
	- statut (justifiée/non)
	- action “Justifier”
- Modal “Justifier”
	- motif (texte)
	- fichier
	- bouton envoyer

Attributs/états principaux

- absences (liste)
- justificationModalOpen (booléen)
- selectedAbsence
- motif (texte)
- file (fichier)
- saving (booléen)

### 7.7 Page “Demandes” (Étudiant)

But

- Créer une demande administrative (à partir d’un modèle).
- Suivre son statut.

Composition

- Sélecteur de modèle (cartes/choix)
- Formulaire
	- urgent (case)
	- description (texte)
	- date (si demandée)
	- bouton envoyer
- Historique (tableau)
	- type
	- date
	- statut

Attributs/états principaux

- template (valeur)
- urgent (booléen)
- description (texte)
- dateDemande (valeur)
- demandes (liste)
- saving (booléen)

### 7.8 Page “Demandes de stage” (Étudiant)

But

- Créer une demande de stage.
- Consulter ses informations détaillées.
- Imprimer une lettre (si disponible).

Composition

- Liste à gauche (demandes)
- Détails à droite (dossier)
- Tabs détails
	- Infos
	- Entreprise
	- Encadrement
	- Dépôt
- Bouton “Imprimer” (génère une page imprimable)

Attributs/états principaux

- demandesStage (liste)
- selectedDemandeStage
- createModalOpen (booléen)
- formEntrepriseNom (texte)
- formEntrepriseAdresse (texte)
- formPeriode (valeurs)
- tab (valeur)

Remarque fonctionnelle

- La partie “Dépôt” est présentée comme une interface, mais certains champs peuvent être désactivés si le backend ne gère pas encore l’upload stage.

### 7.9 Page “Réclamations” (Étudiant)

But

- Déposer une réclamation.
- Suivre son statut.

Composition

- Formulaire création
	- sujet (texte)
	- description (texte)
	- urgence (optionnel)
	- bouton envoyer
- Historique (tableau)
	- sujet
	- date
	- statut

Attributs/états principaux

- sujet (texte)
- description (texte)
- urgent (booléen)
- reclamations (liste)
- saving (booléen)

---

## 8) Composants UI réutilisés (ce que les pages utilisent)

### 8.1 Section (bloc)

Utilisation

- Structurer une page en parties : titre, sous-titre, contenu.

Composition

- Header (titre + sous-titre)
- Body (contenu)

### 8.2 Modal (fenêtre)

Utilisation

- Créer/modifier/consulter un élément.

Composition

- Backdrop
- Container
- Header (titre + bouton fermer)
- Body
- Footer (optionnel)

### 8.3 Toast (notification courte)

Utilisation

- Informer succès/erreur rapidement.

Attributs

- message (texte)
- type (succès/erreur/info)
- durée (temps)

### 8.4 CRUD générique (formulaire + tableau)

Formulaire dynamique

- Génère des champs selon une configuration :
	- label
	- name
	- type
	- required
	- placeholder
	- options (pour listes)

Table dynamique

- Affiche automatiquement des colonnes depuis les objets de données.
- Actions : modifier/supprimer selon permissions.

### 8.5 ErrorBoundary

Utilisation

- Si une page provoque une erreur React, on affiche un écran de secours.

