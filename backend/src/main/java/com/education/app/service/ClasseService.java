package com.education.app.service;

import com.education.app.dto.ClasseDTO;
import com.education.app.model.Classe;
import com.education.app.model.User;
import com.education.app.repository.ClasseRepository;
import com.education.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClasseService {
    
    private final ClasseRepository classeRepository;
    private final UserRepository userRepository;
    
    public ClasseService(ClasseRepository classeRepository, UserRepository userRepository) {
        this.classeRepository = classeRepository;
        this.userRepository = userRepository;
    }
    
    public ClasseDTO createClasse(ClasseDTO classeDTO) {
        User enseignant = userRepository.findById(classeDTO.getEnseignantId())
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        
        Classe classe = new Classe();
        classe.setName(classeDTO.getName());
        classe.setDescription(classeDTO.getDescription());
        classe.setLevel(classeDTO.getLevel());
        classe.setEnseignant(enseignant);
        
        Classe savedClasse = classeRepository.save(classe);
        return convertToDTO(savedClasse);
    }
    
    public ClasseDTO getClasseById(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return convertToDTO(classe);
    }
    
    public List<ClasseDTO> getAllClasses() {
        return classeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ClasseDTO> getClassesByEnseignant(Long enseignantId) {
        User enseignant = userRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        return classeRepository.findByEnseignant(enseignant).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ClasseDTO> getClassesByLevel(Integer level) {
        return classeRepository.findByLevel(level).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ClasseDTO updateClasse(Long id, ClasseDTO classeDTO) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        
        classe.setName(classeDTO.getName());
        classe.setDescription(classeDTO.getDescription());
        classe.setLevel(classeDTO.getLevel());
        classe.setUpdatedAt(LocalDateTime.now());
        
        Classe updatedClasse = classeRepository.save(classe);
        return convertToDTO(updatedClasse);
    }
    
    public void deleteClasse(Long id) {
        classeRepository.deleteById(id);
    }
    
    private ClasseDTO convertToDTO(Classe classe) {
        return new ClasseDTO(
                classe.getId(),
                classe.getName(),
                classe.getDescription(),
                classe.getLevel(),
                classe.getEnseignant().getId(),
                classe.getEnseignant().getFirstName() + " " + classe.getEnseignant().getLastName(),
                classe.getCreatedAt(),
                classe.getUpdatedAt()
        );
    }
}
