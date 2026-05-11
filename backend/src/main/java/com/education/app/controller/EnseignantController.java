package com.education.app.controller;

import com.education.app.model.Enseignant;
import com.education.app.service.EnseignantService;
import com.education.app.service.DepartementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EnseignantController {
    
    private final EnseignantService enseignantService;
    private final DepartementService departementService;

    public EnseignantController(EnseignantService enseignantService, DepartementService departementService) {
        this.enseignantService = enseignantService;
        this.departementService = departementService;
    }

    @PostMapping
    public ResponseEntity<Enseignant> createEnseignant(@RequestBody Enseignant enseignant) {
        Enseignant created = enseignantService.createEnseignant(enseignant);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignantById(@PathVariable Long id) {
        return enseignantService.getEnseignantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Enseignant>> getAllEnseignants() {
        List<Enseignant> enseignants = enseignantService.getAllEnseignants();
        return ResponseEntity.ok(enseignants);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<Enseignant> getEnseignantByEmail(@PathVariable String email) {
        return enseignantService.getEnseignantByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/departement/{departementId}")
    public ResponseEntity<List<Enseignant>> getEnseignantsByDepartement(@PathVariable Long departementId) {
        return departementService.getDepartementById(departementId)
                .map(departement -> ResponseEntity.ok(enseignantService.getEnseignantsByDepartement(departement)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(@PathVariable Long id, @RequestBody Enseignant enseignantDetails) {
        Enseignant updated = enseignantService.updateEnseignant(id, enseignantDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        enseignantService.deleteEnseignant(id);
        return ResponseEntity.ok().build();
    }
}
