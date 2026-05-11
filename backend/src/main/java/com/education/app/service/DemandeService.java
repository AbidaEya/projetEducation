package com.education.app.service;

import com.education.app.model.Demande;
import com.education.app.model.Etudiant;
import com.education.app.model.Admin;
import com.education.app.repository.DemandeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DemandeService {
    
    private final DemandeRepository demandeRepository;

    public DemandeService(DemandeRepository demandeRepository) {
        this.demandeRepository = demandeRepository;
    }

    public Demande createDemande(Demande demande) {
        return demandeRepository.save(demande);
    }

    public Optional<Demande> getDemandeById(Long id) {
        return demandeRepository.findById(id);
    }

    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    public List<Demande> getDemandesByEtudiant(Etudiant etudiant) {
        return demandeRepository.findByEtudiant(etudiant);
    }

    public List<Demande> getDemandesByAdmin(Admin admin) {
        return demandeRepository.findByAdmin(admin);
    }

    public Demande updateDemande(Long id, Demande demandeDetails) {
        Optional<Demande> demande = demandeRepository.findById(id);
        if (demande.isPresent()) {
            Demande existing = demande.get();
            existing.setType(demandeDetails.getType());
            existing.setStatut(demandeDetails.getStatut());
            existing.setUrgent(demandeDetails.getUrgent());
            existing.setDescription(demandeDetails.getDescription());
            existing.setEtudiant(demandeDetails.getEtudiant());
            existing.setAdmin(demandeDetails.getAdmin());
            return demandeRepository.save(existing);
        }
        return null;
    }

    public void deleteDemande(Long id) {
        demandeRepository.deleteById(id);
    }
}
