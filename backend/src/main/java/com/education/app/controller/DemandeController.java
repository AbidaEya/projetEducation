package com.education.app.controller;

import com.education.app.model.Demande;

import com.education.app.service.DemandeService;
import com.education.app.service.EtudiantService;
import com.education.app.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DemandeController {
    
    private final DemandeService demandeService;
    private final EtudiantService etudiantService;
    private final AdminService adminService;

    public DemandeController(DemandeService demandeService, EtudiantService etudiantService, AdminService adminService) {
        this.demandeService = demandeService;
        this.etudiantService = etudiantService;
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<Demande> createDemande(@RequestBody Demande demande) {
        Demande created = demandeService.createDemande(demande);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        return demandeService.getDemandeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Demande>> getAllDemandes() {
        List<Demande> demandes = demandeService.getAllDemandes();
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<Demande>> getDemandesByEtudiant(@PathVariable Long etudiantId) {
        return etudiantService.getEtudiantById(etudiantId)
                .map(etudiant -> ResponseEntity.ok(demandeService.getDemandesByEtudiant(etudiant)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Demande>> getDemandesByAdmin(@PathVariable Long adminId) {
        return adminService.getAdminById(adminId)
                .map(admin -> ResponseEntity.ok(demandeService.getDemandesByAdmin(admin)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Demande> updateDemande(@PathVariable Long id, @RequestBody Demande demandeDetails) {
        Demande updated = demandeService.updateDemande(id, demandeDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeService.deleteDemande(id);
        return ResponseEntity.ok().build();
    }
}
