package com.education.app.service;

import com.education.app.model.Groupe;
import com.education.app.repository.GroupeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupeService {
    
    @Autowired
    private GroupeRepository groupeRepository;
    
    public Groupe createGroupe(Groupe groupe) {
        return groupeRepository.save(groupe);
    }
    
    public Optional<Groupe> getGroupeById(Long id) {
        return groupeRepository.findById(id);
    }
    
    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
    }
    
    public Optional<Groupe> getGroupeByName(String nomGroupe) {
        return groupeRepository.findByNomGroupe(nomGroupe);
    }
    
    public Groupe updateGroupe(Groupe groupe) {
        return groupeRepository.save(groupe);
    }
    
    public void deleteGroupe(Long id) {
        groupeRepository.deleteById(id);
    }
}
