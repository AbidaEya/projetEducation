package com.education.app.controller;

import com.education.app.model.Groupe;
import com.education.app.service.GroupeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groupes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroupeController {
    
    @Autowired
    private GroupeService groupeService;
    
    @PostMapping
    public ResponseEntity<Groupe> createGroupe(@RequestBody Groupe groupe) {
        Groupe created = groupeService.createGroupe(groupe);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Backward-compatible endpoint
    @PostMapping("/create")
    public ResponseEntity<Groupe> createGroupeLegacy(@RequestBody Groupe groupe) {
        return createGroupe(groupe);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Groupe> getGroupeById(@PathVariable Long id) {
        Optional<Groupe> groupe = groupeService.getGroupeById(id);
        if (groupe.isPresent()) {
            return ResponseEntity.ok(groupe.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<Groupe>> getAllGroupes() {
        List<Groupe> groupes = groupeService.getAllGroupes();
        return ResponseEntity.ok(groupes);
    }

    // Backward-compatible endpoint
    @GetMapping("/all")
    public ResponseEntity<List<Groupe>> getAllGroupesLegacy() {
        return getAllGroupes();
    }
    
    @GetMapping("/search/{nom}")
    public ResponseEntity<Groupe> getGroupeByName(@PathVariable String nom) {
        Optional<Groupe> groupe = groupeService.getGroupeByName(nom);
        if (groupe.isPresent()) {
            return ResponseEntity.ok(groupe.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Groupe> updateGroupe(
            @PathVariable Long id,
            @RequestBody Groupe groupe) {
        Optional<Groupe> existing = groupeService.getGroupeById(id);
        if (existing.isPresent()) {
            groupe.setId(id);
            Groupe updated = groupeService.updateGroupe(groupe);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupe(@PathVariable Long id) {
        groupeService.deleteGroupe(id);
        return ResponseEntity.noContent().build();
    }
}
