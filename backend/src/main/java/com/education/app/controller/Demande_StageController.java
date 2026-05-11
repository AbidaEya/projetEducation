package com.education.app.controller;

import com.education.app.model.Demande_Stage;
import com.education.app.service.Demande_StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping({"/api/demandes-stage", "/api/demandes_stage"})
@CrossOrigin(origins = "*", maxAge = 3600)
public class Demande_StageController {
    
    @Autowired
    private Demande_StageService demandeStageService;

    @GetMapping
    public ResponseEntity<List<Demande_Stage>> list() {
        return getAllDemandes();
    }

    @PostMapping
    public ResponseEntity<Demande_Stage> create(@RequestBody Demande_Stage demande) {
        return createDemande(demande);
    }
    
    @PostMapping("/create")
    public ResponseEntity<Demande_Stage> createDemande(@RequestBody Demande_Stage demande) {
        Demande_Stage created = demandeStageService.createDemande(demande);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Demande_Stage> getDemandeById(@PathVariable Long id) {
        Optional<Demande_Stage> demande = demandeStageService.getDemandeById(id);
        if (demande.isPresent()) {
            return ResponseEntity.ok(demande.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Demande_Stage>> getAllDemandes() {
        List<Demande_Stage> demandes = demandeStageService.getAllDemandes();
        return ResponseEntity.ok(demandes);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Demande_Stage>> getPendingDemandes() {
        List<Demande_Stage> demandes = demandeStageService.getPendingDemandes();
        return ResponseEntity.ok(demandes);
    }
    
    @GetMapping("/urgent")
    public ResponseEntity<List<Demande_Stage>> getUrgentDemandes() {
        List<Demande_Stage> demandes = demandeStageService.getUrgentDemandes();
        return ResponseEntity.ok(demandes);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Demande_Stage> updateDemande(
            @PathVariable Long id,
            @RequestBody Demande_Stage demande) {
        Optional<Demande_Stage> existing = demandeStageService.getDemandeById(id);
        if (existing.isPresent()) {
            demande.setId(id);
            Demande_Stage updated = demandeStageService.updateDemande(demande);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeStageService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
}
