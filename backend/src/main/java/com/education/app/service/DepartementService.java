package com.education.app.service;

import com.education.app.model.Departement;
import com.education.app.repository.DepartementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartementService {
    
    private final DepartementRepository departementRepository;

    public DepartementService(DepartementRepository departementRepository) {
        this.departementRepository = departementRepository;
    }

    public Departement createDepartement(Departement departement) {
        return departementRepository.save(departement);
    }

    public Optional<Departement> getDepartementById(Long id) {
        return departementRepository.findById(id);
    }

    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    public Optional<Departement> getDepartementByNom(String nomDepartement) {
        return departementRepository.findByNomDepartement(nomDepartement);
    }

    public Departement updateDepartement(Long id, Departement departementDetails) {
        Optional<Departement> departement = departementRepository.findById(id);
        if (departement.isPresent()) {
            Departement existing = departement.get();
            existing.setNomDepartement(departementDetails.getNomDepartement());
            existing.setDescription(departementDetails.getDescription());
            return departementRepository.save(existing);
        }
        return null;
    }

    public void deleteDepartement(Long id) {
        departementRepository.deleteById(id);
    }
}
