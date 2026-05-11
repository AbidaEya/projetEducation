package com.education.app.service;

import com.education.app.model.Projet;
import com.education.app.model.Enseignant;
import com.education.app.repository.ProjetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjetService {
    
    private final ProjetRepository projetRepository;

    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public Projet createProjet(Projet projet) {
        return projetRepository.save(projet);
    }

    public Optional<Projet> getProjetById(Long id) {
        return projetRepository.findById(id);
    }

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public List<Projet> getProjetsByEnseignant(Enseignant enseignant) {
        return projetRepository.findByEnseignant(enseignant);
    }

    public Projet updateProjet(Long id, Projet projetDetails) {
        Optional<Projet> projet = projetRepository.findById(id);
        if (projet.isPresent()) {
            Projet existing = projet.get();
            existing.setTitre(projetDetails.getTitre());
            existing.setDescription(projetDetails.getDescription());
            existing.setDateDebut(projetDetails.getDateDebut());
            existing.setDateFin(projetDetails.getDateFin());
            existing.setEnseignant(projetDetails.getEnseignant());
            existing.setEtudiants(projetDetails.getEtudiants());
            return projetRepository.save(existing);
        }
        return null;
    }

    public void deleteProjet(Long id) {
        projetRepository.deleteById(id);
    }
}
