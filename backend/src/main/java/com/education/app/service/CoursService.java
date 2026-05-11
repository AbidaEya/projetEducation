package com.education.app.service;

import com.education.app.model.Cours;
import com.education.app.model.Departement;
import com.education.app.model.Enseignant;
import com.education.app.repository.CoursRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CoursService {
    
    private final CoursRepository coursRepository;
    
    public CoursService(CoursRepository coursRepository) {
        this.coursRepository = coursRepository;
    }
    
    public Cours createCours(Cours cours) {
        cours.setCreatedAt(LocalDateTime.now());
        cours.setUpdatedAt(LocalDateTime.now());
        return coursRepository.save(cours);
    }
    
    public Optional<Cours> getCoursById(Long id) {
        return coursRepository.findById(id);
    }
    
    public List<Cours> getAllCours() {
        return coursRepository.findAll();
    }
    
    public List<Cours> getCoursByDepartement(Departement departement) {
        return coursRepository.findByDepartement(departement);
    }
    
    public List<Cours> getCoursByEnseignant(Enseignant enseignant) {
        return coursRepository.findByEnseignant(enseignant);
    }
    
    public Cours updateCours(Long id, Cours coursDetails) {
        Optional<Cours> cours = coursRepository.findById(id);
        if (cours.isPresent()) {
            Cours existing = cours.get();
            existing.setNomCours(coursDetails.getNomCours());
            existing.setDescription(coursDetails.getDescription());
            existing.setCoefficient(coursDetails.getCoefficient());
            existing.setVolumeHoraire(coursDetails.getVolumeHoraire());
            existing.setDepartement(coursDetails.getDepartement());
            existing.setEnseignant(coursDetails.getEnseignant());
            existing.setRessourcePath(coursDetails.getRessourcePath());
            existing.setUpdatedAt(LocalDateTime.now());
            return coursRepository.save(existing);
        }
        return null;
    }
    
    public void deleteCours(Long id) {
        coursRepository.deleteById(id);
    }
}
