package com.education.app.controller;

import com.education.app.model.Departement;
import com.education.app.service.DepartementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DepartementController {
    
    private final DepartementService departementService;

    public DepartementController(DepartementService departementService) {
        this.departementService = departementService;
    }

    @PostMapping
    public ResponseEntity<Departement> createDepartement(@RequestBody Departement departement) {
        Departement created = departementService.createDepartement(departement);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        return departementService.getDepartementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Departement>> getAllDepartements() {
        List<Departement> departements = departementService.getAllDepartements();
        return ResponseEntity.ok(departements);
    }

    @GetMapping("/by-name/{nom}")
    public ResponseEntity<Departement> getDepartementByNom(@PathVariable String nom) {
        return departementService.getDepartementByNom(nom)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departement> updateDepartement(@PathVariable Long id, @RequestBody Departement departementDetails) {
        Departement updated = departementService.updateDepartement(id, departementDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartement(@PathVariable Long id) {
        departementService.deleteDepartement(id);
        return ResponseEntity.ok().build();
    }
}
