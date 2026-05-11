package com.education.app.service;

import com.education.app.dto.DevoirDTO;
import com.education.app.dto.actions.AddSeanceRequest;
import com.education.app.dto.actions.MarkAbsenceRequest;
import com.education.app.dto.actions.SendAnnonceRequest;
import com.education.app.model.*;
import com.education.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ActionsService {

    private final DevoirService devoirService;
    private final CoursRepository coursRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final AbsenceService absenceService;
    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final InscriptionRepository inscriptionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ClasseRepository classeRepository;

    public ActionsService(
            DevoirService devoirService,
            CoursRepository coursRepository,
            EmploiDuTempsRepository emploiDuTempsRepository,
            AbsenceService absenceService,
            EtudiantRepository etudiantRepository,
            EnseignantRepository enseignantRepository,
            InscriptionRepository inscriptionRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            ClasseRepository classeRepository
    ) {
        this.devoirService = devoirService;
        this.coursRepository = coursRepository;
        this.emploiDuTempsRepository = emploiDuTempsRepository;
        this.absenceService = absenceService;
        this.etudiantRepository = etudiantRepository;
        this.enseignantRepository = enseignantRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.classeRepository = classeRepository;
    }

    public DevoirDTO creerDevoir(DevoirDTO dto) {
        return devoirService.createDevoir(dto);
    }

    public EmploiDuTemps ajouterSeance(AddSeanceRequest req) {
        if (req.getCoursId() == null) throw new IllegalArgumentException("coursId is required");
        Cours cours = coursRepository.findById(req.getCoursId())
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        EmploiDuTemps e = new EmploiDuTemps();
        e.setCours(cours);
        e.setJour(req.getJour());
        e.setHeureDebut(LocalTime.parse(req.getHeureDebut()));
        e.setHeureFin(LocalTime.parse(req.getHeureFin()));
        e.setSalle(req.getSalle());
        return emploiDuTempsRepository.save(e);
    }

    public Absence marquerAbsence(MarkAbsenceRequest req) {
        if (req.getEtudiantId() == null || req.getCoursId() == null || req.getEnseignantId() == null) {
            throw new IllegalArgumentException("etudiantId, coursId, enseignantId are required");
        }

        Etudiant etudiant = etudiantRepository.findById(req.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        Cours cours = coursRepository.findById(req.getCoursId())
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        Enseignant enseignant = enseignantRepository.findById(req.getEnseignantId())
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

        Absence a = new Absence();
        a.setEtudiant(etudiant);
        a.setCours(cours);
        a.setEnseignant(enseignant);
        if (req.getDateAbsence() != null && !req.getDateAbsence().isBlank()) {
            a.setDateAbsence(LocalDateTime.parse(req.getDateAbsence()));
        } else {
            a.setDateAbsence(LocalDateTime.now());
        }
        a.setStatut(Absence.Status.NON_JUSTIFIEE);
        return absenceService.createAbsence(a);
    }

    public int envoyerAnnonce(SendAnnonceRequest req) {
        if (req.getMessage() == null || req.getMessage().isBlank()) {
            throw new IllegalArgumentException("message is required");
        }

        List<User> targets = new ArrayList<>();
        String role = req.getTargetRole() != null ? req.getTargetRole().trim().toUpperCase() : "ALL";

        if (req.getClasseId() != null) {
            Classe classe = classeRepository.findById(req.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            List<Inscription> inscriptions = inscriptionRepository.findByClasseAndStatus(classe, Inscription.Status.ACTIVE);
            for (Inscription i : inscriptions) {
                if (i.getEtudiant() != null) targets.add(i.getEtudiant());
            }
        } else {
            targets.addAll(userRepository.findByIsActiveTrue());
        }

        int sent = 0;
        for (User u : targets) {
            if (u == null) continue;

            if (!"ALL".equals(role)) {
                // user_type discriminator is not exposed here; use runtime class name as fallback
                String inferred;
                if (u instanceof Etudiant) inferred = "ETUDIANT";
                else if (u instanceof Enseignant) inferred = "ENSEIGNANT";
                else inferred = "ADMIN";

                if (!role.equals(inferred)) continue;
            }

            String refKey = "ANNONCE:" + LocalDateTime.now().toLocalDate() + ":" + Math.abs(req.getMessage().hashCode());
            Notification created = notificationService.createTypedNotification(u, Notification.Type.ANNONCE, refKey, req.getMessage());
            if (created != null) sent++;
        }
        return sent;
    }
}
