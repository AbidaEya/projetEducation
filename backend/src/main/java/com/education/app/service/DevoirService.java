package com.education.app.service;

import com.education.app.dto.DevoirDTO;
import com.education.app.model.Devoir;
import com.education.app.model.Cours;
import com.education.app.model.User;
import com.education.app.repository.DevoirRepository;
import com.education.app.repository.CoursRepository;
import com.education.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DevoirService {

    private final DevoirRepository devoirRepository;
    private final CoursRepository coursRepository;
    private final UserRepository userRepository;

    public DevoirService(DevoirRepository devoirRepository, CoursRepository coursRepository,
            UserRepository userRepository) {
        this.devoirRepository = devoirRepository;
        this.coursRepository = coursRepository;
        this.userRepository = userRepository;
    }

    public DevoirDTO createDevoir(DevoirDTO devoirDTO) {
        Cours cours = coursRepository.findById(devoirDTO.getCoursId())
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        User enseignant = userRepository.findById(devoirDTO.getEnseignantId())
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

        Devoir devoir = new Devoir();
        devoir.setTitle(devoirDTO.getTitle());
        devoir.setDescription(devoirDTO.getDescription());
        devoir.setCours(cours);
        devoir.setEnseignant(enseignant);
        devoir.setDateDebut(devoirDTO.getDateDebut());
        devoir.setDateEchéance(devoirDTO.getDateEchéance());

        Devoir savedDevoir = devoirRepository.save(devoir);
        return convertToDTO(savedDevoir);
    }

    public DevoirDTO getDevoirById(Long id) {
        Devoir devoir = devoirRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devoir non trouvé"));
        return convertToDTO(devoir);
    }

    public List<DevoirDTO> getAllDevoirs() {
        return devoirRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DevoirDTO> getDevoirsByCours(Long coursId) {
        Cours cours = coursRepository.findById(coursId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return devoirRepository.findByCours(cours).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DevoirDTO> getDevoirsByEnseignant(Long enseignantId) {
        User enseignant = userRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        return devoirRepository.findByEnseignant(enseignant).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DevoirDTO updateDevoir(Long id, DevoirDTO devoirDTO) {
        Devoir devoir = devoirRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devoir non trouvé"));

        devoir.setTitle(devoirDTO.getTitle());
        devoir.setDescription(devoirDTO.getDescription());
        devoir.setDateDebut(devoirDTO.getDateDebut());
        devoir.setDateEchéance(devoirDTO.getDateEchéance());
        devoir.setUpdatedAt(LocalDateTime.now());

        Devoir updatedDevoir = devoirRepository.save(devoir);
        return convertToDTO(updatedDevoir);
    }

    public void deleteDevoir(Long id) {
        devoirRepository.deleteById(id);
    }

    private DevoirDTO convertToDTO(Devoir devoir) {
        String coursNom = devoir.getCours() != null ? devoir.getCours().getNomCours() : null;
        String coursRessourcePath = devoir.getCours() != null ? devoir.getCours().getRessourcePath() : null;
        String enseignantNom = null;
        if (devoir.getEnseignant() != null) {
            enseignantNom = devoir.getEnseignant().getFirstName() + " " + devoir.getEnseignant().getLastName();
        }
        return new DevoirDTO(
                devoir.getId(),
                devoir.getTitle(),
                devoir.getDescription(),
                devoir.getCours().getId(),
                coursNom,
                coursRessourcePath,
                devoir.getEnseignant().getId(),
                enseignantNom,
                devoir.getDateDebut(),
                devoir.getDateEchéance(),
                devoir.getCreatedAt(),
                devoir.getUpdatedAt());
    }
}
