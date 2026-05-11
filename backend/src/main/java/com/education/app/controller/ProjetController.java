package com.education.app.controller;

import com.education.app.model.Projet;
import com.education.app.service.ProjetService;
import com.education.app.service.EnseignantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjetController {
    
    private final ProjetService projetService;
    private final EnseignantService enseignantService;

    public ProjetController(ProjetService projetService, EnseignantService enseignantService) {
        this.projetService = projetService;
        this.enseignantService = enseignantService;
    }

    @PostMapping
    public ResponseEntity<Projet> createProjet(@RequestBody Projet projet) {
        Projet created = projetService.createProjet(projet);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> getProjetById(@PathVariable Long id) {
        return projetService.getProjetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Projet>> getAllProjets() {
        List<Projet> projets = projetService.getAllProjets();
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<Projet>> getProjetsByEnseignant(@PathVariable Long enseignantId) {
        return enseignantService.getEnseignantById(enseignantId)
                .map(enseignant -> ResponseEntity.ok(projetService.getProjetsByEnseignant(enseignant)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Projet> updateProjet(@PathVariable Long id, @RequestBody Projet projetDetails) {
        Projet updated = projetService.updateProjet(id, projetDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        projetService.deleteProjet(id);
        return ResponseEntity.ok().build();
    }
}
