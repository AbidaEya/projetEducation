package com.education.app.service;

import com.education.app.model.Demande_Stage;
import com.education.app.model.Etudiant;
import com.education.app.repository.Demande_StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class Demande_StageService {
    
    @Autowired
    private Demande_StageRepository demandeStageRepository;
    
    public Demande_Stage createDemande(Demande_Stage demande) {
        return demandeStageRepository.save(demande);
    }
    
    public Optional<Demande_Stage> getDemandeById(Long id) {
        return demandeStageRepository.findById(id);
    }
    
    public List<Demande_Stage> getAllDemandes() {
        return demandeStageRepository.findAll();
    }
    
    public List<Demande_Stage> getDemandesByEtudiant(Etudiant etudiant) {
        return demandeStageRepository.findByEtudiant(etudiant);
    }
    
    public List<Demande_Stage> getDemandesByStatus(Demande_Stage.Status status) {
        return demandeStageRepository.findByStatut(status);
    }
    
    public List<Demande_Stage> getUrgentDemandes() {
        return demandeStageRepository.findByUrgentTrue();
    }
    
    public Demande_Stage updateDemande(Demande_Stage demande) {
        return demandeStageRepository.save(demande);
    }
    
    public void deleteDemande(Long id) {
        demandeStageRepository.deleteById(id);
    }
    
    public List<Demande_Stage> getPendingDemandes() {
        return getDemandesByStatus(Demande_Stage.Status.EN_ATTENTE);
    }
}
