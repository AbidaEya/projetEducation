package com.education.app.controller;

import com.education.app.model.Etudiant;
import com.education.app.service.EtudiantService;
import com.education.app.service.DepartementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EtudiantController {
    
    private final EtudiantService etudiantService;
    private final DepartementService departementService;

    public EtudiantController(EtudiantService etudiantService, DepartementService departementService) {
        this.etudiantService = etudiantService;
        this.departementService = departementService;
    }

    @PostMapping
    public ResponseEntity<Etudiant> createEtudiant(@RequestBody Etudiant etudiant) {
        Etudiant created = etudiantService.createEtudiant(etudiant);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        return etudiantService.getEtudiantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Etudiant>> getAllEtudiants() {
        List<Etudiant> etudiants = etudiantService.getAllEtudiants();
        return ResponseEntity.ok(etudiants);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<Etudiant> getEtudiantByEmail(@PathVariable String email) {
        return etudiantService.getEtudiantByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/departement/{departementId}")
    public ResponseEntity<List<Etudiant>> getEtudiantsByDepartement(@PathVariable Long departementId) {
        return departementService.getDepartementById(departementId)
                .map(departement -> ResponseEntity.ok(etudiantService.getEtudiantsByDepartement(departement)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiantDetails) {
        Etudiant updated = etudiantService.updateEtudiant(id, etudiantDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        etudiantService.deleteEtudiant(id);
        return ResponseEntity.ok().build();
    }
}
