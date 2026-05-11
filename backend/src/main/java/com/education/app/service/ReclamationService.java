package com.education.app.service;

import com.education.app.model.Reclamation;
import com.education.app.model.Etudiant;
import com.education.app.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {
    
    @Autowired
    private ReclamationRepository reclamationRepository;
    
    public Reclamation createReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    
    public Optional<Reclamation> getReclamationById(Long id) {
        return reclamationRepository.findById(id);
    }
    
    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }
    
    public List<Reclamation> getReclamationsByEtudiant(Etudiant etudiant) {
        return reclamationRepository.findByEtudiant(etudiant);
    }
    
    public List<Reclamation> getReclamationsByStatus(Reclamation.Status status) {
        return reclamationRepository.findByStatut(status);
    }
    
    public List<Reclamation> getUrgentReclamations() {
        return reclamationRepository.findByUrgentTrue();
    }
    
    public Reclamation updateReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    
    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }
    
    public List<Reclamation> getPendingReclamations() {
        return getReclamationsByStatus(Reclamation.Status.EN_ATTENTE);
    }
}
