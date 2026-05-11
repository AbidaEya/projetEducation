import { createBrowserRouter, Navigate } from 'react-router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EnseignantDashboard from './pages/enseignant/EnseignantDashboard';
import EtudiantDashboard from './pages/etudiant/EtudiantDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ResourcePage from './pages/ResourcePage';
import type { UserRole } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Admin specialized pages
import AdminDemandes from './pages/admin/AdminDemandes';
import AdminAbsences from './pages/admin/AdminAbsences';
import AdminJustifications from './pages/admin/AdminJustifications';
import AdminSoumissions from './pages/admin/AdminSoumissions';
import AdminNotes from './pages/admin/AdminNotes';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReclamations from './pages/admin/AdminReclamations';

// Enseignant specialized pages
import EnseignantCours from './pages/enseignant/EnseignantCours';
import EnseignantEvaluations from './pages/enseignant/EnseignantEvaluations';
import EnseignantReclamationsNotes from './pages/enseignant/EnseignantReclamationsNotes';
import EnseignantEmploiDuTemps from './pages/enseignant/EnseignantEmploiDuTemps';
import EnseignantNotifications from './pages/enseignant/EnseignantNotifications';

// Etudiant specialized pages
import EtudiantCours from './pages/etudiant/EtudiantCours';
import EtudiantDevoirs from './pages/etudiant/EtudiantDevoirs';
import EtudiantSoumissions from './pages/etudiant/EtudiantSoumissions';
import EtudiantNotes from './pages/etudiant/EtudiantNotes';
import EtudiantDemandes from './pages/etudiant/EtudiantDemandes';
import EtudiantDemandesStage from './pages/etudiant/EtudiantDemandesStage';
import EtudiantAbsences from './pages/etudiant/EtudiantAbsences';
import EtudiantReclamations from './pages/etudiant/EtudiantReclamations';
import EtudiantNotifications from './pages/etudiant/EtudiantNotifications';
import EtudiantEmploiDuTemps from './pages/etudiant/EtudiantEmploiDuTemps';

// ─── Dashboard redirect helper ──────────────────────────────────────────────
function DashboardHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'enseignant') return <EnseignantDashboard />;
  return <EtudiantDashboard />;
}

// ─── Navigation configuration ───────────────────────────────────────────────

export interface NavItem {
  label: string;
  to: string;
  roles: UserRole[];
  group?: string;
}

export const navItems: NavItem[] = [
  // General
  { label: 'Dashboard', to: 'home', roles: ['admin', 'enseignant', 'etudiant'], group: 'Général' },
  { label: 'Profil', to: 'profile', roles: ['admin', 'enseignant', 'etudiant'], group: 'Général' },
  { label: 'Notifications', to: 'notifications', roles: ['admin', 'enseignant', 'etudiant'], group: 'Général' },

  // Admin - People
  { label: 'Utilisateurs', to: 'admin/users', roles: ['admin'], group: 'Admin · People' },
  { label: 'Admins', to: 'admin/admins', roles: ['admin'], group: 'Admin · People' },
  { label: 'Enseignants', to: 'admin/enseignants', roles: ['admin'], group: 'Admin · People' },
  { label: 'Étudiants', to: 'admin/etudiants', roles: ['admin'], group: 'Admin · People' },

  // Admin - Academic
  { label: 'Départements', to: 'admin/departements', roles: ['admin'], group: 'Admin · Academic' },
  { label: 'Groupes', to: 'admin/groupes', roles: ['admin'], group: 'Admin · Academic' },
  { label: 'Classes', to: 'admin/classes', roles: ['admin'], group: 'Admin · Academic' },
  { label: 'Cours', to: 'admin/cours', roles: ['admin'], group: 'Admin · Academic' },
  { label: 'Matières', to: 'admin/matieres', roles: ['admin'], group: 'Admin · Academic' },
  { label: 'Projets', to: 'admin/projets', roles: ['admin'], group: 'Admin · Academic' },

  // Admin - Evaluation
  { label: 'Devoirs', to: 'admin/devoirs', roles: ['admin'], group: 'Admin · Évaluation' },
  { label: 'Soumissions', to: 'admin/soumissions', roles: ['admin'], group: 'Admin · Évaluation' },
  { label: 'Notes', to: 'admin/notes', roles: ['admin'], group: 'Admin · Évaluation' },

  // Admin - Attendance
  { label: 'Absences', to: 'admin/absences', roles: ['admin'], group: 'Admin · Suivi' },
  { label: 'Justifications', to: 'admin/justifications', roles: ['admin'], group: 'Admin · Suivi' },
  { label: 'Emploi du temps', to: 'admin/emploi-du-temps', roles: ['admin'], group: 'Admin · Suivi' },

  // Admin - Requests
  { label: 'Demandes', to: 'admin/demandes', roles: ['admin'], group: 'Admin · Demandes' },
  { label: 'Réclamations', to: 'admin/reclamations', roles: ['admin'], group: 'Admin · Demandes' },

  // Admin - Comms
  { label: 'Notifications', to: 'admin/notifications-mgmt', roles: ['admin'], group: 'Admin · Comms' },
  { label: 'Commentaires', to: 'admin/commentaires', roles: ['admin'], group: 'Admin · Comms' },

  // Enseignant
  { label: 'Mes Cours', to: 'enseignant/cours', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Mes Classes', to: 'enseignant/classes', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Devoirs', to: 'enseignant/devoirs', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Évaluations', to: 'enseignant/evaluations', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Récl. Notes', to: 'enseignant/reclamations-notes', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Emploi du temps', to: 'enseignant/emploi-du-temps', roles: ['enseignant'], group: 'Enseignement' },
  { label: 'Notifications', to: 'enseignant/notifications', roles: ['enseignant'], group: 'Enseignement' },

  // Étudiant
  { label: 'Cours', to: 'etudiant/cours', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Devoirs', to: 'etudiant/devoirs', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Soumissions', to: 'etudiant/soumissions', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Notes', to: 'etudiant/notes', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Emploi du temps', to: 'etudiant/emploi-du-temps', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Absences', to: 'etudiant/absences', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Demandes', to: 'etudiant/demandes', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Stages', to: 'etudiant/demandes-stage', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Réclamations', to: 'etudiant/reclamations', roles: ['etudiant'], group: 'Étudiant' },
  { label: 'Notifications', to: 'etudiant/notifications', roles: ['etudiant'], group: 'Étudiant' },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navItems.filter(i => i.roles.includes(role));
}

// ─── Route definitions ───────────────────────────────────────────────────────

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Dashboards
          { path: 'admin', Component: AdminDashboard },
          { path: 'enseignant', Component: EnseignantDashboard },
          { path: 'etudiant', Component: EtudiantDashboard },

          // Common
          { path: 'home', element: <DashboardHome /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'notifications', element: <NotificationsPage /> },

          // ─── Admin routes ──────────────────────────────────────────
          { path: 'admin/users', element: <ResourcePage title="Utilisateurs" endpoint="/users" /> },
          {
            path: 'admin/admins',
            element: <ResourcePage title="Admins" endpoint="/admins" fields={[
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'password', label: 'Mot de passe', type: 'password' },
              { name: 'firstName', label: 'Prénom', type: 'text', required: true },
              { name: 'lastName', label: 'Nom', type: 'text', required: true },
              { name: 'phoneNumber', label: 'Téléphone', type: 'text' },
              { name: 'address', label: 'Adresse', type: 'text' },
              { name: 'isActive', label: 'Actif', type: 'checkbox' },
            ]} />,
          },
          {
            path: 'admin/enseignants',
            element: <ResourcePage title="Enseignants" endpoint="/enseignants" fields={[
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'password', label: 'Mot de passe', type: 'password' },
              { name: 'firstName', label: 'Prénom', type: 'text', required: true },
              { name: 'lastName', label: 'Nom', type: 'text', required: true },
              { name: 'specialite', label: 'Spécialité', type: 'text' },
              { name: 'phoneNumber', label: 'Téléphone', type: 'text' },
              { name: 'address', label: 'Adresse', type: 'text' },
              { name: 'departement.id', label: 'Département', type: 'select', optionsEndpoint: '/departements', optionsValuePath: 'id', optionsLabelPath: 'nomDepartement' },
              { name: 'isActive', label: 'Actif', type: 'checkbox' },
            ]} />,
          },
          {
            path: 'admin/etudiants',
            element: <ResourcePage title="Étudiants" endpoint="/etudiants" fields={[
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'password', label: 'Mot de passe', type: 'password' },
              { name: 'firstName', label: 'Prénom', type: 'text', required: true },
              { name: 'lastName', label: 'Nom', type: 'text', required: true },
              { name: 'niveau', label: 'Niveau', type: 'text' },
              { name: 'groupe.id', label: 'Groupe', type: 'select', optionsEndpoint: '/groupes', optionsValuePath: 'id', optionsLabelPath: 'nomGroupe' },
              { name: 'departement.id', label: 'Département', type: 'select', optionsEndpoint: '/departements', optionsValuePath: 'id', optionsLabelPath: 'nomDepartement' },
              { name: 'phoneNumber', label: 'Téléphone', type: 'text' },
              { name: 'address', label: 'Adresse', type: 'text' },
              { name: 'isActive', label: 'Actif', type: 'checkbox' },
            ]} />,
          },
          {
            path: 'admin/departements',
            element: <ResourcePage title="Départements" endpoint="/departements" fields={[
              { name: 'nomDepartement', label: 'Nom', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'text' },
            ]} />,
          },
          {
            path: 'admin/groupes',
            element: <ResourcePage title="Groupes" endpoint="/groupes" fields={[
              { name: 'nomGroupe', label: 'Nom', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'niveau', label: 'Niveau', type: 'number' },
            ]} />,
          },
          {
            path: 'admin/classes',
            element: <ResourcePage title="Classes" endpoint="/classes" fields={[
              { name: 'name', label: 'Nom', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'level', label: 'Niveau', type: 'number', required: true },
              { name: 'enseignantId', label: 'Enseignant', type: 'select', required: true, optionsEndpoint: '/enseignants', optionsValuePath: 'id', optionsLabelPaths: ['firstName', 'lastName'] },
            ]} />,
          },
          {
            path: 'admin/cours',
            element: <ResourcePage title="Cours" endpoint="/cours" fields={[
              { name: 'nomCours', label: 'Nom', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'coefficient', label: 'Coefficient', type: 'number' },
              { name: 'volumeHoraire', label: 'Volume horaire', type: 'number' },
              { name: 'departement.id', label: 'Département', type: 'select', required: true, optionsEndpoint: '/departements', optionsValuePath: 'id', optionsLabelPath: 'nomDepartement' },
              { name: 'enseignant.id', label: 'Enseignant', type: 'select', required: true, optionsEndpoint: '/enseignants', optionsValuePath: 'id', optionsLabelPaths: ['firstName', 'lastName'] },
            ]} />,
          },
          {
            path: 'admin/matieres',
            element: <ResourcePage title="Matières" endpoint="/matieres" fields={[
              { name: 'nomMatiere', label: 'Nom', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'coefficient', label: 'Coefficient', type: 'number' },
              { name: 'departement.id', label: 'Département', type: 'select', optionsEndpoint: '/departements', optionsValuePath: 'id', optionsLabelPath: 'nomDepartement' },
              { name: 'enseignant.id', label: 'Enseignant', type: 'select', optionsEndpoint: '/enseignants', optionsValuePath: 'id', optionsLabelPaths: ['firstName', 'lastName'] },
            ]} />,
          },
          {
            path: 'admin/projets',
            element: <ResourcePage title="Projets" endpoint="/projets" fields={[
              { name: 'titre', label: 'Titre', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'dateDebut', label: 'Date début', type: 'date' },
              { name: 'dateFin', label: 'Date fin', type: 'date' },
              { name: 'statut', label: 'Statut', type: 'select', options: [{ value: 'EN_COURS', label: 'En cours' }, { value: 'TERMINE', label: 'Terminé' }, { value: 'ANNULE', label: 'Annulé' }] },
              { name: 'enseignant.id', label: 'Enseignant', type: 'select', optionsEndpoint: '/enseignants', optionsValuePath: 'id', optionsLabelPaths: ['firstName', 'lastName'] },
            ]} />,
          },
          {
            path: 'admin/devoirs',
            element: <ResourcePage title="Devoirs" endpoint="/devoirs" fields={[
              { name: 'titre', label: 'Titre', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'dateLimite', label: 'Date limite', type: 'date' },
              { name: 'cours.id', label: 'Cours', type: 'select', required: true, optionsEndpoint: '/cours', optionsValuePath: 'id', optionsLabelPath: 'nomCours' },
              { name: 'enseignant.id', label: 'Enseignant', type: 'select', optionsEndpoint: '/enseignants', optionsValuePath: 'id', optionsLabelPaths: ['firstName', 'lastName'] },
            ]} />,
          },
          { path: 'admin/soumissions', element: <AdminSoumissions /> },
          { path: 'admin/notes', element: <AdminNotes /> },
          { path: 'admin/absences', element: <AdminAbsences /> },
          { path: 'admin/justifications', element: <AdminJustifications /> },
          {
            path: 'admin/emploi-du-temps',
            element: <ResourcePage title="Emploi du temps" endpoint="/emploi-du-temps" fields={[
              { name: 'jour', label: 'Jour', type: 'select', required: true, options: [{ value: 'LUNDI', label: 'Lundi' }, { value: 'MARDI', label: 'Mardi' }, { value: 'MERCREDI', label: 'Mercredi' }, { value: 'JEUDI', label: 'Jeudi' }, { value: 'VENDREDI', label: 'Vendredi' }, { value: 'SAMEDI', label: 'Samedi' }] },
              { name: 'heureDebut', label: 'Heure début', type: 'time' },
              { name: 'heureFin', label: 'Heure fin', type: 'time' },
              { name: 'salle', label: 'Salle', type: 'text' },
              { name: 'cours.id', label: 'Cours', type: 'select', required: true, optionsEndpoint: '/cours', optionsValuePath: 'id', optionsLabelPath: 'nomCours' },
            ]} />,
          },
          { path: 'admin/demandes', element: <AdminDemandes /> },
          { path: 'admin/demandes-stage', element: <AdminDemandes /> },
          { path: 'admin/reclamations', element: <AdminReclamations /> },
          { path: 'admin/reclamation-notes', element: <AdminReclamations /> },
          { path: 'admin/commentaires', element: <ResourcePage title="Commentaires" endpoint="/commentaires" readOnly /> },
          { path: 'admin/notifications-mgmt', element: <AdminNotifications /> },

          // ─── Enseignant routes ────────────────────────────────────
          { path: 'enseignant/cours', element: <EnseignantCours /> },
          { path: 'enseignant/classes', element: <ResourcePage title="Mes Classes" endpoint="/classes" readOnly /> },
          {
            path: 'enseignant/devoirs',
            element: <ResourcePage title="Devoirs" endpoint="/devoirs" fields={[
              { name: 'titre', label: 'Titre', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'dateLimite', label: 'Date limite', type: 'date' },
              { name: 'cours.id', label: 'Cours', type: 'select', required: true, optionsEndpoint: '/cours', optionsValuePath: 'id', optionsLabelPath: 'nomCours' },
            ]} />,
          },
          { path: 'enseignant/evaluations', element: <EnseignantEvaluations /> },
          { path: 'enseignant/reclamations-notes', element: <EnseignantReclamationsNotes /> },
          { path: 'enseignant/emploi-du-temps', element: <EnseignantEmploiDuTemps /> },
          { path: 'enseignant/notifications', element: <EnseignantNotifications /> },

          // ─── Étudiant routes ──────────────────────────────────────
          { path: 'etudiant/cours', element: <EtudiantCours /> },
          { path: 'etudiant/devoirs', element: <EtudiantDevoirs /> },
          { path: 'etudiant/soumissions', element: <EtudiantSoumissions /> },
          { path: 'etudiant/notes', element: <EtudiantNotes /> },
          { path: 'etudiant/emploi-du-temps', element: <EtudiantEmploiDuTemps /> },
          { path: 'etudiant/absences', element: <EtudiantAbsences /> },
          { path: 'etudiant/demandes', element: <EtudiantDemandes /> },
          { path: 'etudiant/demandes-stage', element: <EtudiantDemandesStage /> },
          { path: 'etudiant/reclamations', element: <EtudiantReclamations /> },
          { path: 'etudiant/notifications', element: <EtudiantNotifications /> },
        ],
      },
    ],
  },
]);
