package com.education.app.service;

import com.education.app.dto.InscriptionDTO;
import com.education.app.model.Inscription;
import com.education.app.model.Classe;
import com.education.app.model.User;
import com.education.app.repository.InscriptionRepository;
import com.education.app.repository.ClasseRepository;
import com.education.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final ClasseRepository classeRepository;
    private final UserRepository userRepository;

    public InscriptionService(InscriptionRepository inscriptionRepository, ClasseRepository classeRepository,
            UserRepository userRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.classeRepository = classeRepository;
        this.userRepository = userRepository;
    }

    public InscriptionDTO enrollStudent(Long etudiantId, Long classeId) {
        User etudiant = userRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        Optional<Inscription> existing = inscriptionRepository.findByEtudiantAndClasse(etudiant, classe);
        if (existing.isPresent()) {
            throw new RuntimeException("L'étudiant est déjà inscrit à cette classe");
        }

        Inscription inscription = new Inscription();
        inscription.setEtudiant(etudiant);
        inscription.setClasse(classe);
        inscription.setStatus(Inscription.Status.ACTIVE);

        Inscription savedInscription = inscriptionRepository.save(inscription);
        return convertToDTO(savedInscription);
    }

    public InscriptionDTO getInscriptionById(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        return convertToDTO(inscription);
    }

    public List<InscriptionDTO> getAllInscriptions() {
        return inscriptionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InscriptionDTO> getInscriptionsByEtudiant(Long etudiantId) {
        User etudiant = userRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        return inscriptionRepository.findByEtudiant(etudiant).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InscriptionDTO> getInscriptionsByClasse(Long classeId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return inscriptionRepository.findByClasse(classe).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InscriptionDTO> getActiveInscriptionsForClasse(Long classeId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return inscriptionRepository.findByClasseAndStatus(classe, Inscription.Status.ACTIVE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InscriptionDTO updateInscription(Long id, InscriptionDTO inscriptionDTO) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        inscription.setStatus(inscriptionDTO.getStatus());
        inscription.setMoyenneFinale(inscriptionDTO.getMoyenneFinale());
        inscription.setUpdatedAt(LocalDateTime.now());

        Inscription updatedInscription = inscriptionRepository.save(inscription);
        return convertToDTO(updatedInscription);
    }

    public void removeStudentFromClass(Long id) {
        inscriptionRepository.deleteById(id);
    }

    private InscriptionDTO convertToDTO(Inscription inscription) {
        return new InscriptionDTO(
                inscription.getId(),
                inscription.getEtudiant().getId(),
                inscription.getClasse().getId(),
                inscription.getDateInscription(),
                inscription.getStatus(),
                inscription.getMoyenneFinale(),
                inscription.getCreatedAt(),
                inscription.getUpdatedAt());
    }
}
