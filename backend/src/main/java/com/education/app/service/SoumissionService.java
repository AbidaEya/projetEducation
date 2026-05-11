package com.education.app.service;

import com.education.app.dto.SoumissionDTO;
import com.education.app.model.Soumission;
import com.education.app.model.Devoir;
import com.education.app.model.User;
import com.education.app.model.Notification;
import com.education.app.repository.SoumissionRepository;
import com.education.app.repository.DevoirRepository;
import com.education.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SoumissionService {
    
    private final SoumissionRepository soumissionRepository;
    private final DevoirRepository devoirRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public SoumissionService(SoumissionRepository soumissionRepository, DevoirRepository devoirRepository, UserRepository userRepository, NotificationService notificationService) {
        this.soumissionRepository = soumissionRepository;
        this.devoirRepository = devoirRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    public SoumissionDTO submitDevoir(SoumissionDTO soumissionDTO) {
        Devoir devoir = devoirRepository.findById(soumissionDTO.getDevoirId())
                .orElseThrow(() -> new RuntimeException("Devoir non trouvé"));
        User etudiant = userRepository.findById(soumissionDTO.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        
        Soumission soumission = new Soumission();
        soumission.setDevoir(devoir);
        soumission.setEtudiant(etudiant);
        soumission.setContenu(soumissionDTO.getContenu());
        soumission.setFilePath(soumissionDTO.getFilePath());
        soumission.setDateSubmission(LocalDateTime.now());
        
        Soumission savedSoumission = soumissionRepository.save(soumission);

        // 🔔 Notify the teacher about a new submission upload
        try {
            User teacher = devoir.getEnseignant();
            String msg = "Nouvel upload devoir: " + devoir.getTitle() + " (" + etudiant.getFirstName() + " " + etudiant.getLastName() + ")";
            String refKey = "SOUMISSION:" + savedSoumission.getId();
            notificationService.createTypedNotification(teacher, Notification.Type.DEVOIR_UPLOAD, refKey, msg);
        } catch (Exception ignored) {
            // Best-effort notification: do not break submission flow
        }

        return convertToDTO(savedSoumission);
    }
    
    public SoumissionDTO getSoumissionById(Long id) {
        Soumission soumission = soumissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée"));
        return convertToDTO(soumission);
    }
    
    public List<SoumissionDTO> getSoumissionsByDevoir(Long devoirId) {
        Devoir devoir = devoirRepository.findById(devoirId)
                .orElseThrow(() -> new RuntimeException("Devoir non trouvé"));
        return soumissionRepository.findByDevoir(devoir).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SoumissionDTO> getSoumissionsByEtudiant(Long etudiantId) {
        User etudiant = userRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        return soumissionRepository.findByEtudiant(etudiant).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SoumissionDTO evaluateSoumission(Long soumissionId, Double note, String feedback) {
        Soumission soumission = soumissionRepository.findById(soumissionId)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée"));
        
        soumission.setNote(note);
        soumission.setFeedback(feedback);
        soumission.setIsEvaluated(true);
        soumission.setUpdatedAt(LocalDateTime.now());
        
        Soumission evaluatedSoumission = soumissionRepository.save(soumission);
        return convertToDTO(evaluatedSoumission);
    }
    
    public List<SoumissionDTO> getPendingEvaluations() {
        return soumissionRepository.findByIsEvaluatedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SoumissionDTO> getAllSoumissions() {
        return soumissionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteSoumission(Long id) {
        soumissionRepository.deleteById(id);
    }
    
    private SoumissionDTO convertToDTO(Soumission soumission) {
        return new SoumissionDTO(
                soumission.getId(),
                soumission.getDevoir().getId(),
                soumission.getEtudiant().getId(),
                soumission.getContenu(),
                soumission.getFilePath(),
                soumission.getDateSubmission(),
                soumission.getNote(),
                soumission.getFeedback(),
                soumission.getIsEvaluated(),
                soumission.getCreatedAt(),
                soumission.getUpdatedAt()
        );
    }
}
