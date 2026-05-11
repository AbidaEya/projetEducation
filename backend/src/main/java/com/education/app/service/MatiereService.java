package com.education.app.service;

import com.education.app.model.Matiere;
import com.education.app.model.Cours;
import com.education.app.model.Enseignant;
import com.education.app.repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {
    
    @Autowired
    private MatiereRepository matiereRepository;
    
    public Matiere createMatiere(Matiere matiere) {
        return matiereRepository.save(matiere);
    }
    
    public Optional<Matiere> getMatiereById(Long id) {
        return matiereRepository.findById(id);
    }
    
    public List<Matiere> getAllMatieres() {
        return matiereRepository.findAll();
    }
    
    public List<Matiere> getMatieresByCours(Cours cours) {
        return matiereRepository.findByCours(cours);
    }
    
    public List<Matiere> getMatieresByEnseignant(Enseignant enseignant) {
        return matiereRepository.findByEnseignant(enseignant);
    }
    
    public Matiere updateMatiere(Matiere matiere) {
        return matiereRepository.save(matiere);
    }
    
    public void deleteMatiere(Long id) {
        matiereRepository.deleteById(id);
    }
}
