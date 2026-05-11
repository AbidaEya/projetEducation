package com.education.app.service;

import com.education.app.model.Justification;
import com.education.app.model.Absence;
import com.education.app.repository.JustificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JustificationService {
    
    @Autowired
    private JustificationRepository justificationRepository;
    
    public Justification createJustification(Justification justification) {
        return justificationRepository.save(justification);
    }
    
    public Optional<Justification> getJustificationById(Long id) {
        return justificationRepository.findById(id);
    }
    
    public List<Justification> getAllJustifications() {
        return justificationRepository.findAll();
    }
    
    public List<Justification> getJustificationsByAbsence(Absence absence) {
        return justificationRepository.findByAbsence(absence);
    }
    
    public List<Justification> getJustificationsByStatus(Justification.Status status) {
        return justificationRepository.findByStatut(status);
    }
    
    public Justification updateJustification(Justification justification) {
        return justificationRepository.save(justification);
    }
    
    public void deleteJustification(Long id) {
        justificationRepository.deleteById(id);
    }
    
    public List<Justification> getPendingJustifications() {
        return getJustificationsByStatus(Justification.Status.EN_ATTENTE);
    }
}
