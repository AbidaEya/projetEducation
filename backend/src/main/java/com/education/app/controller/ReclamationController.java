package com.education.app.controller;

import com.education.app.model.Reclamation;
import com.education.app.service.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReclamationController {
    
    @Autowired
    private ReclamationService reclamationService;

    @GetMapping
    public ResponseEntity<List<Reclamation>> list() {
        return getAllReclamations();
    }

    @PostMapping
    public ResponseEntity<Reclamation> create(@RequestBody Reclamation reclamation) {
        return createReclamation(reclamation);
    }
    
    @PostMapping("/create")
    public ResponseEntity<Reclamation> createReclamation(@RequestBody Reclamation reclamation) {
        Reclamation created = reclamationService.createReclamation(reclamation);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getReclamationById(@PathVariable Long id) {
        Optional<Reclamation> reclamation = reclamationService.getReclamationById(id);
        if (reclamation.isPresent()) {
            return ResponseEntity.ok(reclamation.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Reclamation>> getAllReclamations() {
        List<Reclamation> reclamations = reclamationService.getAllReclamations();
        return ResponseEntity.ok(reclamations);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Reclamation>> getPendingReclamations() {
        List<Reclamation> reclamations = reclamationService.getPendingReclamations();
        return ResponseEntity.ok(reclamations);
    }
    
    @GetMapping("/urgent")
    public ResponseEntity<List<Reclamation>> getUrgentReclamations() {
        List<Reclamation> reclamations = reclamationService.getUrgentReclamations();
        return ResponseEntity.ok(reclamations);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> updateReclamation(
            @PathVariable Long id,
            @RequestBody Reclamation reclamation) {
        Optional<Reclamation> existing = reclamationService.getReclamationById(id);
        if (existing.isPresent()) {
            reclamation.setId(id);
            Reclamation updated = reclamationService.updateReclamation(reclamation);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
        return ResponseEntity.noContent().build();
    }
}
