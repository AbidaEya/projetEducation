package com.education.app.service;

import com.education.app.model.Enseignant;
import com.education.app.model.Departement;
import com.education.app.repository.EnseignantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EnseignantService {
    
    private final EnseignantRepository enseignantRepository;

    public EnseignantService(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    public Enseignant createEnseignant(Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }

    public Optional<Enseignant> getEnseignantById(Long id) {
        return enseignantRepository.findById(id);
    }

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    public Optional<Enseignant> getEnseignantByEmail(String email) {
        return enseignantRepository.findByEmail(email);
    }

    public List<Enseignant> getEnseignantsByDepartement(Departement departement) {
        return enseignantRepository.findByDepartement(departement);
    }

    public Enseignant updateEnseignant(Long id, Enseignant enseignantDetails) {
        Optional<Enseignant> enseignant = enseignantRepository.findById(id);
        if (enseignant.isPresent()) {
            Enseignant existing = enseignant.get();
            if (enseignantDetails.getEmail() != null) {
                existing.setEmail(enseignantDetails.getEmail());
            }
            if (enseignantDetails.getPassword() != null && !enseignantDetails.getPassword().isEmpty()) {
                existing.setPassword(enseignantDetails.getPassword());
            }
            if (enseignantDetails.getFirstName() != null) {
                existing.setFirstName(enseignantDetails.getFirstName());
            }
            if (enseignantDetails.getLastName() != null) {
                existing.setLastName(enseignantDetails.getLastName());
            }
            if (enseignantDetails.getPhoneNumber() != null) {
                existing.setPhoneNumber(enseignantDetails.getPhoneNumber());
            }
            if (enseignantDetails.getAddress() != null) {
                existing.setAddress(enseignantDetails.getAddress());
            }
            if (enseignantDetails.getProfilePicture() != null) {
                existing.setProfilePicture(enseignantDetails.getProfilePicture());
            }
            if (enseignantDetails.getIsActive() != null) {
                existing.setIsActive(enseignantDetails.getIsActive());
            }
            if (enseignantDetails.getSpecialite() != null) {
                existing.setSpecialite(enseignantDetails.getSpecialite());
            }
            if (enseignantDetails.getDepartement() != null) {
                existing.setDepartement(enseignantDetails.getDepartement());
            }
            return enseignantRepository.save(existing);
        }
        return null;
    }

    public void deleteEnseignant(Long id) {
        enseignantRepository.deleteById(id);
    }
}
