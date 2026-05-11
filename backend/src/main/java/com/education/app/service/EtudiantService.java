package com.education.app.service;

import com.education.app.model.Etudiant;
import com.education.app.model.Departement;
import com.education.app.repository.EtudiantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EtudiantService {
    
    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    public Etudiant createEtudiant(Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    public Optional<Etudiant> getEtudiantById(Long id) {
        return etudiantRepository.findById(id);
    }

    public List<Etudiant> getAllEtudiants() {
        return etudiantRepository.findAll();
    }

    public Optional<Etudiant> getEtudiantByEmail(String email) {
        return etudiantRepository.findByEmail(email);
    }

    public List<Etudiant> getEtudiantsByDepartement(Departement departement) {
        return etudiantRepository.findByDepartement(departement);
    }

    public Etudiant updateEtudiant(Long id, Etudiant etudiantDetails) {
        Optional<Etudiant> etudiant = etudiantRepository.findById(id);
        if (etudiant.isPresent()) {
            Etudiant existing = etudiant.get();
            if (etudiantDetails.getEmail() != null) {
                existing.setEmail(etudiantDetails.getEmail());
            }
            if (etudiantDetails.getPassword() != null && !etudiantDetails.getPassword().isEmpty()) {
                existing.setPassword(etudiantDetails.getPassword());
            }
            if (etudiantDetails.getFirstName() != null) {
                existing.setFirstName(etudiantDetails.getFirstName());
            }
            if (etudiantDetails.getLastName() != null) {
                existing.setLastName(etudiantDetails.getLastName());
            }
            if (etudiantDetails.getPhoneNumber() != null) {
                existing.setPhoneNumber(etudiantDetails.getPhoneNumber());
            }
            if (etudiantDetails.getAddress() != null) {
                existing.setAddress(etudiantDetails.getAddress());
            }
            if (etudiantDetails.getProfilePicture() != null) {
                existing.setProfilePicture(etudiantDetails.getProfilePicture());
            }
            if (etudiantDetails.getIsActive() != null) {
                existing.setIsActive(etudiantDetails.getIsActive());
            }
            if (etudiantDetails.getNiveau() != null) {
                existing.setNiveau(etudiantDetails.getNiveau());
            }
            if (etudiantDetails.getGroupe() != null) {
                existing.setGroupe(etudiantDetails.getGroupe());
            }
            if (etudiantDetails.getDepartement() != null) {
                existing.setDepartement(etudiantDetails.getDepartement());
            }
            return etudiantRepository.save(existing);
        }
        return null;
    }

    public void deleteEtudiant(Long id) {
        etudiantRepository.deleteById(id);
    }
}
