package com.education.app.config;

import com.education.app.model.*;
import com.education.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            AdminRepository adminRepository,
            EnseignantRepository enseignantRepository,
            EtudiantRepository etudiantRepository,
            DepartementRepository departementRepository,
            CoursRepository coursRepository,
            AbsenceRepository absenceRepository,
            EmploiDuTempsRepository emploiDuTempsRepository,
            ProjetRepository projetRepository,
            DemandeRepository demandeRepository,
            NotificationRepository notificationRepository,
            GroupeRepository groupeRepository,
            ClasseRepository classeRepository,
            InscriptionRepository inscriptionRepository,
            MatiereRepository matiereRepository,
            NoteRepository noteRepository,
            DevoirRepository devoirRepository,
            SoumissionRepository soumissionRepository,
            EvaluationRepository evaluationRepository,
            CommentaireRepository commentaireRepository,
            JustificationRepository justificationRepository,
            ReclamationRepository reclamationRepository,
            Demande_StageRepository demandeStageRepository,
            UserRepository userRepository) {
        return args -> {
            AtomicBoolean seededAny = new AtomicBoolean(false);

            // Département (unique par nom)
            Departement dept = departementRepository.findByNomDepartement("Informatique").orElseGet(() -> {
                Departement d = new Departement();
                d.setNomDepartement("Informatique");
                d.setDescription("Département d'Informatique et de Technologie");
                seededAny.set(true);
                return departementRepository.save(d);
            });

            // Groupes (unique par nom)
            Groupe groupeA = groupeRepository.findByNomGroupe("Groupe A").orElseGet(() -> {
                Groupe g = new Groupe("Groupe A");
                g.setNiveau(3);
                seededAny.set(true);
                return groupeRepository.save(g);
            });
            Groupe groupeB = groupeRepository.findByNomGroupe("Groupe B").orElseGet(() -> {
                Groupe g = new Groupe("Groupe B");
                g.setNiveau(3);
                seededAny.set(true);
                return groupeRepository.save(g);
            });
            Groupe groupeC = groupeRepository.findByNomGroupe("Groupe C").orElseGet(() -> {
                Groupe g = new Groupe("Groupe C");
                g.setNiveau(2);
                seededAny.set(true);
                return groupeRepository.save(g);
            });

            // Admin (unique par email)
            Admin admin = adminRepository.findByEmail("admin@education.com").orElseGet(() -> {
                Admin a = new Admin();
                a.setEmail("admin@education.com");
                a.setPassword("admin123");
                a.setFirstName("Admin");
                a.setLastName("System");
                a.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345678"));
                a.setAddress("123 Rue de l'Éducation");
                a.setIsActive(true);
                seededAny.set(true);
                return adminRepository.save(a);
            });

            // Enseignants (unique par email)
            Enseignant enseignant1 = enseignantRepository.findByEmail("enseignant1@education.com").orElseGet(() -> {
                Enseignant e = new Enseignant();
                e.setEmail("enseignant1@education.com");
                e.setPassword("pass123");
                e.setFirstName("Jean");
                e.setLastName("Dupont");
                e.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345679"));
                e.setAddress("456 Avenue de l'École");
                e.setIsActive(true);
                e.setSpecialite("Développement Web");
                e.setDepartement(dept);
                seededAny.set(true);
                return enseignantRepository.save(e);
            });
            Enseignant enseignant2 = enseignantRepository.findByEmail("enseignant2@education.com").orElseGet(() -> {
                Enseignant e = new Enseignant();
                e.setEmail("enseignant2@education.com");
                e.setPassword("pass123");
                e.setFirstName("Marie");
                e.setLastName("Martin");
                e.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345680"));
                e.setAddress("789 Boulevard de l'Université");
                e.setIsActive(true);
                e.setSpecialite("Bases de Données");
                e.setDepartement(dept);
                seededAny.set(true);
                return enseignantRepository.save(e);
            });

            // Classes (recherche par nom)
            Classe classeL3A = classeRepository.findByNameContainingIgnoreCase("L3 - A")
                    .stream()
                    .filter(c -> "L3 - A".equals(c.getName()))
                    .findFirst()
                    .orElseGet(() -> {
                        Classe c = new Classe("L3 - A", "Classe L3 encadrée par Jean Dupont", 3, enseignant1);
                        seededAny.set(true);
                        return classeRepository.save(c);
                    });

            Classe classeL2C = classeRepository.findByNameContainingIgnoreCase("L2 - C")
                    .stream()
                    .filter(c -> "L2 - C".equals(c.getName()))
                    .findFirst()
                    .orElseGet(() -> {
                        Classe c = new Classe("L2 - C", "Classe L2 encadrée par Marie Martin", 2, enseignant2);
                        seededAny.set(true);
                        return classeRepository.save(c);
                    });

            // Étudiants (unique par email)
            Etudiant etudiant1 = etudiantRepository.findByEmail("etudiant1@education.com").orElseGet(() -> {
                Etudiant e = new Etudiant();
                e.setEmail("etudiant1@education.com");
                e.setPassword("pass123");
                e.setFirstName("Pierre");
                e.setLastName("Bernard");
                e.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345681"));
                e.setAddress("321 Rue des Étudiants");
                e.setIsActive(true);
                e.setNiveau("L3");
                e.setGroupe(groupeA);
                e.setDepartement(dept);
                seededAny.set(true);
                return etudiantRepository.save(e);
            });
            Etudiant etudiant2 = etudiantRepository.findByEmail("etudiant2@education.com").orElseGet(() -> {
                Etudiant e = new Etudiant();
                e.setEmail("etudiant2@education.com");
                e.setPassword("pass123");
                e.setFirstName("Sophie");
                e.setLastName("Lefevre");
                e.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345682"));
                e.setAddress("654 Avenue des Talents");
                e.setIsActive(true);
                e.setNiveau("L3");
                e.setGroupe(groupeB);
                e.setDepartement(dept);
                seededAny.set(true);
                return etudiantRepository.save(e);
            });
            Etudiant etudiant3 = etudiantRepository.findByEmail("etudiant3@education.com").orElseGet(() -> {
                Etudiant e = new Etudiant();
                e.setEmail("etudiant3@education.com");
                e.setPassword("pass123");
                e.setFirstName("Luc");
                e.setLastName("Morin");
                e.setPhoneNumber(resolveSeedPhone(userRepository, "+33612345683"));
                e.setAddress("987 Boulevard des Savoirs");
                e.setIsActive(true);
                e.setNiveau("L2");
                e.setGroupe(groupeC);
                e.setDepartement(dept);
                seededAny.set(true);
                return etudiantRepository.save(e);
            });

            // Inscription (idempotent via count)
            if (inscriptionRepository.count() == 0) {
                Inscription inscription1 = new Inscription(etudiant1, classeL3A);
                inscriptionRepository.save(inscription1);
                Inscription inscription2 = new Inscription(etudiant2, classeL3A);
                inscriptionRepository.save(inscription2);
                Inscription inscription3 = new Inscription(etudiant3, classeL2C);
                inscriptionRepository.save(inscription3);
                seededAny.set(true);
            }

            // Cours (recherche par nom)
            Cours cours1 = coursRepository.findByNomCoursContainingIgnoreCase("Développement Web")
                    .stream()
                    .filter(c -> "Développement Web".equals(c.getNomCours()))
                    .findFirst()
                    .orElseGet(() -> {
                        Cours c = new Cours();
                        c.setNomCours("Développement Web");
                        c.setDescription("Apprentissage du développement web avec HTML, CSS et JavaScript");
                        c.setCoefficient(3);
                        c.setVolumeHoraire(30);
                        c.setDepartement(dept);
                        c.setEnseignant(enseignant1);
                        c.setRessourcePath("/uploads/cours/web-dev-resources.txt");
                        seededAny.set(true);
                        return coursRepository.save(c);
                    });

            Cours cours2 = coursRepository.findByNomCoursContainingIgnoreCase("Bases de Données")
                    .stream()
                    .filter(c -> "Bases de Données".equals(c.getNomCours()))
                    .findFirst()
                    .orElseGet(() -> {
                        Cours c = new Cours();
                        c.setNomCours("Bases de Données");
                        c.setDescription("Introduction aux systèmes de gestion de bases de données");
                        c.setCoefficient(4);
                        c.setVolumeHoraire(40);
                        c.setDepartement(dept);
                        c.setEnseignant(enseignant2);
                        c.setRessourcePath("/uploads/cours/database-resources.txt");
                        seededAny.set(true);
                        return coursRepository.save(c);
                    });

            // Absences
            Absence absence1;
            if (absenceRepository.count() == 0) {
                Absence a = new Absence();
                a.setDateAbsence(LocalDateTime.now().minusDays(1));
                a.setStatut(Absence.Status.NON_JUSTIFIEE);
                a.setEtudiant(etudiant1);
                a.setCours(cours1);
                a.setEnseignant(enseignant1);
                absence1 = absenceRepository.save(a);
                seededAny.set(true);
            } else {
                absence1 = absenceRepository.findAll().get(0);
            }

            // Justification
            if (justificationRepository.count() == 0) {
                Justification j = new Justification("Rendez-vous médical urgent", absence1);
                j.setDocument(null); // Pas de fichier pour l'exemple
                j.setStatut(Justification.Status.EN_ATTENTE);
                justificationRepository.save(j);
                seededAny.set(true);
            }

            // Emplois du temps - Horaire complet de la semaine
            if (emploiDuTempsRepository.count() == 0) {
                // Lundi
                EmploiDuTemps emploi1 = new EmploiDuTemps();
                emploi1.setJour("Lundi");
                emploi1.setHeureDebut(LocalTime.of(9, 0));
                emploi1.setHeureFin(LocalTime.of(11, 0));
                emploi1.setSalle("A101");
                emploi1.setCours(cours1);
                emploiDuTempsRepository.save(emploi1);

                EmploiDuTemps emploi1b = new EmploiDuTemps();
                emploi1b.setJour("Lundi");
                emploi1b.setHeureDebut(LocalTime.of(14, 0));
                emploi1b.setHeureFin(LocalTime.of(16, 0));
                emploi1b.setSalle("B102");
                emploi1b.setCours(cours2);
                emploiDuTempsRepository.save(emploi1b);

                // Mardi
                EmploiDuTemps emploi2 = new EmploiDuTemps();
                emploi2.setJour("Mardi");
                emploi2.setHeureDebut(LocalTime.of(8, 30));
                emploi2.setHeureFin(LocalTime.of(10, 30));
                emploi2.setSalle("A102");
                emploi2.setCours(cours2);
                emploiDuTempsRepository.save(emploi2);

                EmploiDuTemps emploi2b = new EmploiDuTemps();
                emploi2b.setJour("Mardi");
                emploi2b.setHeureDebut(LocalTime.of(11, 0));
                emploi2b.setHeureFin(LocalTime.of(13, 0));
                emploi2b.setSalle("Lab1");
                emploi2b.setCours(cours1);
                emploiDuTempsRepository.save(emploi2b);

                // Mercredi
                EmploiDuTemps emploi3 = new EmploiDuTemps();
                emploi3.setJour("Mercredi");
                emploi3.setHeureDebut(LocalTime.of(14, 0));
                emploi3.setHeureFin(LocalTime.of(16, 0));
                emploi3.setSalle("B202");
                emploi3.setCours(cours2);
                emploiDuTempsRepository.save(emploi3);

                // Jeudi
                EmploiDuTemps emploi4 = new EmploiDuTemps();
                emploi4.setJour("Jeudi");
                emploi4.setHeureDebut(LocalTime.of(9, 0));
                emploi4.setHeureFin(LocalTime.of(12, 0));
                emploi4.setSalle("A101");
                emploi4.setCours(cours1);
                emploiDuTempsRepository.save(emploi4);

                EmploiDuTemps emploi4b = new EmploiDuTemps();
                emploi4b.setJour("Jeudi");
                emploi4b.setHeureDebut(LocalTime.of(14, 0));
                emploi4b.setHeureFin(LocalTime.of(16, 0));
                emploi4b.setSalle("Lab2");
                emploi4b.setCours(cours2);
                emploiDuTempsRepository.save(emploi4b);

                // Vendredi
                EmploiDuTemps emploi5 = new EmploiDuTemps();
                emploi5.setJour("Vendredi");
                emploi5.setHeureDebut(LocalTime.of(10, 0));
                emploi5.setHeureFin(LocalTime.of(12, 0));
                emploi5.setSalle("B101");
                emploi5.setCours(cours1);
                emploiDuTempsRepository.save(emploi5);

                EmploiDuTemps emploi5b = new EmploiDuTemps();
                emploi5b.setJour("Vendredi");
                emploi5b.setHeureDebut(LocalTime.of(14, 0));
                emploi5b.setHeureFin(LocalTime.of(17, 0));
                emploi5b.setSalle("Lab1");
                emploi5b.setCours(cours2);
                emploiDuTempsRepository.save(emploi5b);

                seededAny.set(true);
            }

            // Matières
            Matiere matiereWeb = matiereRepository.findByNomMatiere("HTML/CSS/JS");
            if (matiereWeb == null) {
                Matiere m = new Matiere("HTML/CSS/JS", cours1, enseignant1);
                m.setDescription("Fondamentaux du web: HTML, CSS, JavaScript");
                m.setCredit(3);
                matiereWeb = matiereRepository.save(m);
                seededAny.set(true);
            }
            Matiere matiereSQL = matiereRepository.findByNomMatiere("SQL Avancé");
            if (matiereSQL == null) {
                Matiere m = new Matiere("SQL Avancé", cours2, enseignant2);
                m.setDescription("Requêtes avancées, indexation, optimisation");
                m.setCredit(4);
                matiereSQL = matiereRepository.save(m);
                seededAny.set(true);
            }

            // Notes
            if (noteRepository.findByEtudiantAndMatiere(etudiant1, matiereWeb).isEmpty()) {
                Note n = new Note(15.5, etudiant1, matiereWeb);
                n.setObservation("Bon travail");
                noteRepository.save(n);
                seededAny.set(true);
            }
            if (noteRepository.findByEtudiantAndMatiere(etudiant2, matiereWeb).isEmpty()) {
                Note n = new Note(13.0, etudiant2, matiereWeb);
                n.setObservation("Peut mieux faire");
                noteRepository.save(n);
                seededAny.set(true);
            }
            if (noteRepository.findByEtudiantAndMatiere(etudiant3, matiereSQL).isEmpty()) {
                Note n = new Note(16.0, etudiant3, matiereSQL);
                n.setObservation("Très bon niveau");
                noteRepository.save(n);
                seededAny.set(true);
            }

            // Devoirs - Plusieurs devoirs pour les deux cours
            Devoir devoir1;
            Devoir devoir3;
            if (devoirRepository.count() == 0) {
                Devoir d1 = new Devoir(
                        "TP 1 - Site vitrine",
                        "Créer une landing page responsive avec HTML, CSS et JavaScript. Le site doit être compatible mobile.",
                        cours1,
                        enseignant1,
                        LocalDateTime.now().minusDays(10),
                        LocalDateTime.now().plusDays(7));
                devoir1 = devoirRepository.save(d1);

                Devoir d2 = new Devoir(
                        "TP 2 - Formulaire interactif",
                        "Créer un formulaire de contact avec validation JavaScript côté client et affichage dynamique des erreurs.",
                        cours1,
                        enseignant1,
                        LocalDateTime.now().minusDays(3),
                        LocalDateTime.now().plusDays(14));
                devoirRepository.save(d2);

                Devoir d3 = new Devoir(
                        "TP SQL - Requêtes avancées",
                        "Écrire des requêtes SQL incluant des jointures, sous-requêtes et agrégations sur la base de données fournie.",
                        cours2,
                        enseignant2,
                        LocalDateTime.now().minusDays(5),
                        LocalDateTime.now().plusDays(10));
                devoir3 = devoirRepository.save(d3);

                seededAny.set(true);
            } else {
                List<Devoir> allDevoirs = devoirRepository.findAll();
                devoir1 = allDevoirs.size() > 0 ? allDevoirs.get(0) : null;
                devoir3 = allDevoirs.size() > 2 ? allDevoirs.get(2) : null;
            }

            // Soumissions (skip if any already exist for this devoir)
            if (devoir1 != null) {
                List<Soumission> existingSoumissions1 = soumissionRepository.findByDevoirAndEtudiant(devoir1,
                        etudiant1);
                if (existingSoumissions1.isEmpty()) {
                    Soumission s = new Soumission(devoir1, etudiant1);
                    s.setContenu("Voici ma soumission du TP 1 - Site vitrine responsive.");
                    s.setFilePath(null); // Pas de fichier pour l'exemple
                    s.setIsEvaluated(true);
                    s.setNote(17.5);
                    s.setFeedback("Excellent rendu, design moderne et responsive parfait!");
                    soumissionRepository.save(s);
                    seededAny.set(true);
                }
                List<Soumission> existingSoumissions2 = soumissionRepository.findByDevoirAndEtudiant(devoir1,
                        etudiant2);
                if (existingSoumissions2.isEmpty()) {
                    Soumission s = new Soumission(devoir1, etudiant2);
                    s.setContenu("TP 1: ma première version du site vitrine.");
                    s.setFilePath(null);
                    s.setIsEvaluated(false);
                    soumissionRepository.save(s);
                    seededAny.set(true);
                }
            }

            // Soumission pour devoir3 (SQL)
            if (devoir3 != null) {
                List<Soumission> existingSoumissions3 = soumissionRepository.findByDevoirAndEtudiant(devoir3,
                        etudiant3);
                if (existingSoumissions3.isEmpty()) {
                    Soumission s = new Soumission(devoir3, etudiant3);
                    s.setContenu("Mes requêtes SQL pour le TP.");
                    s.setFilePath(null);
                    s.setIsEvaluated(true);
                    s.setNote(16.0);
                    s.setFeedback("Très bon travail sur les jointures!");
                    soumissionRepository.save(s);
                    seededAny.set(true);
                }
            }

            // Évaluations
            if (evaluationRepository.findByTitleContainingIgnoreCase("Quiz Web").isEmpty()) {
                Evaluation eval = new Evaluation("Quiz Web", classeL3A, enseignant1, LocalDateTime.now().plusDays(5));
                eval.setDureeMinutes(45);
                eval.setDescription("Quiz sur HTML/CSS/JS");
                eval.setNoteMaximale(20.0);
                evaluationRepository.save(eval);
                seededAny.set(true);
            }
            if (evaluationRepository.findByTitleContainingIgnoreCase("Quiz SQL").isEmpty()) {
                Evaluation eval = new Evaluation("Quiz SQL", classeL2C, enseignant2, LocalDateTime.now().plusDays(10));
                eval.setDureeMinutes(60);
                eval.setDescription("Quiz sur SQL et modélisation relationnelle");
                eval.setNoteMaximale(20.0);
                evaluationRepository.save(eval);
                seededAny.set(true);
            }

            // Projet (avec étudiants)
            if (projetRepository.count() == 0) {
                Projet projet = new Projet();
                projet.setTitre("Plateforme e-learning");
                projet.setDescription("Développer une plateforme de e-learning complète");
                projet.setDateDebut(LocalDateTime.now());
                projet.setDateFin(LocalDateTime.now().plusMonths(2));
                projet.setEnseignant(enseignant1);
                projet.setEtudiants(List.of(etudiant1, etudiant2));
                projetRepository.save(projet);
                seededAny.set(true);
            }

            // Demandes
            if (demandeRepository.count() == 0) {
                Demande demande = new Demande();
                demande.setType(Demande.Type.STAGE);
                demande.setDateDemande(LocalDateTime.now());
                demande.setStatut(Demande.Statut.EN_ATTENTE);
                demande.setUrgent(false);
                demande.setDescription("Demande de stage en développement web");
                demande.setEtudiant(etudiant1);
                demande.setAdmin(admin);
                demandeRepository.save(demande);
                seededAny.set(true);
            }

            // Demandes de stage
            if (demandeStageRepository.count() == 0) {
                Demande_Stage ds = new Demande_Stage(etudiant3);
                ds.setDescription("Je cherche un stage en data / SQL");
                ds.setEntreprise("DataCorp");
                ds.setResponsableStage("Mme. Durand");
                ds.setUrgent(true);
                ds.setStatut(Demande_Stage.Status.EN_ATTENTE);
                demandeStageRepository.save(ds);
                seededAny.set(true);
            }

            // Réclamations
            if (reclamationRepository.count() == 0) {
                Reclamation rec = new Reclamation("Erreur sur la note affichée", etudiant2);
                rec.setTypeReclamation("NOTE");
                rec.setUrgent(true);
                rec.setAdmin(admin);
                rec.setStatut(Reclamation.Status.EN_ATTENTE);
                reclamationRepository.save(rec);
                seededAny.set(true);
            }

            // Commentaires
            if (commentaireRepository.count() == 0) {
                Commentaire com = new Commentaire("Super cours, merci!", etudiant1);
                com.setSupprimeur(false);
                commentaireRepository.save(com);
                seededAny.set(true);
            }

            // Notifications
            if (notificationRepository.count() == 0) {
                Notification notif1 = new Notification();
                notif1.setMessage("Bienvenue sur la plateforme éducative!");
                notif1.setDateNotification(LocalDateTime.now());
                notif1.setLu(false);
                notif1.setUser(etudiant1);
                notificationRepository.save(notif1);
                seededAny.set(true);
            }

            if (seededAny.get()) {
                System.out.println("====================================");
                System.out.println("Données d'exemple (seed) prêtes!");
                System.out.println("====================================");
                System.out.println("Admin: admin@education.com / admin123");
                System.out.println("Enseignants: enseignant1@education.com, enseignant2@education.com / pass123");
                System.out.println(
                        "Étudiants: etudiant1@education.com, etudiant2@education.com, etudiant3@education.com / pass123");
                System.out.println("Département: Informatique");
                System.out.println("====================================");
            }
        };
    }

    private String resolveSeedPhone(UserRepository userRepository, String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return null;
        }
        return userRepository.existsByPhoneNumber(phoneNumber) ? null : phoneNumber;
    }
}
