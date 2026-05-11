package com.education.app.controller;

import com.education.app.model.Matiere;
import com.education.app.service.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matieres")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MatiereController {
    
    @Autowired
    private MatiereService matiereService;

    @GetMapping
    public ResponseEntity<List<Matiere>> list() {
        return getAllMatieres();
    }

    @PostMapping
    public ResponseEntity<Matiere> create(@RequestBody Matiere matiere) {
        return createMatiere(matiere);
    }
    
    @PostMapping("/create")
    public ResponseEntity<Matiere> createMatiere(@RequestBody Matiere matiere) {
        Matiere created = matiereService.createMatiere(matiere);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getMatiereById(@PathVariable Long id) {
        Optional<Matiere> matiere = matiereService.getMatiereById(id);
        if (matiere.isPresent()) {
            return ResponseEntity.ok(matiere.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Matiere>> getAllMatieres() {
        List<Matiere> matieres = matiereService.getAllMatieres();
        return ResponseEntity.ok(matieres);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Matiere> updateMatiere(
            @PathVariable Long id,
            @RequestBody Matiere matiere) {
        Optional<Matiere> existing = matiereService.getMatiereById(id);
        if (existing.isPresent()) {
            matiere.setId(id);
            Matiere updated = matiereService.updateMatiere(matiere);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatiere(@PathVariable Long id) {
        matiereService.deleteMatiere(id);
        return ResponseEntity.noContent().build();
    }
}
