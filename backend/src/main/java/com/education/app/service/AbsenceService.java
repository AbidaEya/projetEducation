package com.education.app.service;

import com.education.app.model.Absence;
import com.education.app.model.Cours;
import com.education.app.model.Etudiant;
import com.education.app.model.Notification;
import com.education.app.repository.AbsenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AbsenceService {
    
    private final AbsenceRepository absenceRepository;
    private final NotificationService notificationService;

    public AbsenceService(AbsenceRepository absenceRepository, NotificationService notificationService) {
        this.absenceRepository = absenceRepository;
        this.notificationService = notificationService;
    }

    public Absence createAbsence(Absence absence) {
        Absence saved = absenceRepository.save(absence);

        // 🔔 Notify student about being marked absent
        try {
            String coursName = saved.getCours() != null ? saved.getCours().getNomCours() : "(cours)";
            String date = saved.getDateAbsence() != null ? saved.getDateAbsence().toString() : LocalDateTime.now().toString();
            String msg = "Étudiant absent: " + coursName + " le " + date;
            String refKey = "ABSENCE:" + saved.getId();
            notificationService.createTypedNotification(saved.getEtudiant(), Notification.Type.ETUDIANT_ABSENT, refKey, msg);
        } catch (Exception ignored) {
        }

        return saved;
    }

    public Optional<Absence> getAbsenceById(Long id) {
        return absenceRepository.findById(id);
    }

    public List<Absence> getAllAbsences() {
        return absenceRepository.findAll();
    }

    public List<Absence> getAbsencesByEtudiant(Etudiant etudiant) {
        return absenceRepository.findByEtudiant(etudiant);
    }

    public List<Absence> getAbsencesByCours(Cours cours) {
        return absenceRepository.findByCours(cours);
    }

    public List<Absence> getAbsencesByEtudiantAndCours(Etudiant etudiant, Cours cours) {
        return absenceRepository.findByEtudiantAndCours(etudiant, cours);
    }

    public Absence updateAbsence(Long id, Absence absenceDetails) {
        Optional<Absence> absence = absenceRepository.findById(id);
        if (absence.isPresent()) {
            Absence existingAbsence = absence.get();
            existingAbsence.setDateAbsence(absenceDetails.getDateAbsence());
            existingAbsence.setStatut(absenceDetails.getStatut());
            existingAbsence.setEtudiant(absenceDetails.getEtudiant());
            existingAbsence.setCours(absenceDetails.getCours());
            existingAbsence.setEnseignant(absenceDetails.getEnseignant());
            return absenceRepository.save(existingAbsence);
        }
        return null;
    }

    public void deleteAbsence(Long id) {
        absenceRepository.deleteById(id);
    }
}
