package com.education.app.service;

import com.education.app.model.EmploiDuTemps;
import com.education.app.model.Cours;
import com.education.app.repository.EmploiDuTempsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmploiDuTempsService {
    
    private final EmploiDuTempsRepository emploiDuTempsRepository;

    public EmploiDuTempsService(EmploiDuTempsRepository emploiDuTempsRepository) {
        this.emploiDuTempsRepository = emploiDuTempsRepository;
    }

    public EmploiDuTemps createEmploiDuTemps(EmploiDuTemps emploiDuTemps) {
        return emploiDuTempsRepository.save(emploiDuTemps);
    }

    public Optional<EmploiDuTemps> getEmploiDuTempsById(Long id) {
        return emploiDuTempsRepository.findById(id);
    }

    public List<EmploiDuTemps> getAllEmploiDuTemps() {
        return emploiDuTempsRepository.findAll();
    }

    public List<EmploiDuTemps> getEmploiDuTempsByCours(Cours cours) {
        return emploiDuTempsRepository.findByCours(cours);
    }

    public EmploiDuTemps updateEmploiDuTemps(Long id, EmploiDuTemps emploiDuTempsDetails) {
        Optional<EmploiDuTemps> emploiDuTemps = emploiDuTempsRepository.findById(id);
        if (emploiDuTemps.isPresent()) {
            EmploiDuTemps existing = emploiDuTemps.get();
            existing.setJour(emploiDuTempsDetails.getJour());
            existing.setHeureDebut(emploiDuTempsDetails.getHeureDebut());
            existing.setHeureFin(emploiDuTempsDetails.getHeureFin());
            existing.setSalle(emploiDuTempsDetails.getSalle());
            existing.setCours(emploiDuTempsDetails.getCours());
            return emploiDuTempsRepository.save(existing);
        }
        return null;
    }

    public void deleteEmploiDuTemps(Long id) {
        emploiDuTempsRepository.deleteById(id);
    }
}
