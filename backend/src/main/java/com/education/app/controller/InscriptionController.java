package com.education.app.controller;

import com.education.app.dto.InscriptionDTO;
import com.education.app.service.InscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
@CrossOrigin(origins = "*")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @PostMapping("/enroll/{etudiantId}/{classeId}")
    public ResponseEntity<InscriptionDTO> enrollStudent(@PathVariable Long etudiantId, @PathVariable Long classeId) {
        InscriptionDTO inscriptionDTO = inscriptionService.enrollStudent(etudiantId, classeId);
        return new ResponseEntity<>(inscriptionDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscriptionDTO> getInscriptionById(@PathVariable Long id) {
        InscriptionDTO inscriptionDTO = inscriptionService.getInscriptionById(id);
        return ResponseEntity.ok(inscriptionDTO);
    }

    @GetMapping
    public ResponseEntity<List<InscriptionDTO>> getAllInscriptions() {
        return ResponseEntity.ok(inscriptionService.getAllInscriptions());
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<InscriptionDTO>> getInscriptionsByEtudiant(@PathVariable Long etudiantId) {
        List<InscriptionDTO> inscriptions = inscriptionService.getInscriptionsByEtudiant(etudiantId);
        return ResponseEntity.ok(inscriptions);
    }

    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<InscriptionDTO>> getInscriptionsByClasse(@PathVariable Long classeId) {
        List<InscriptionDTO> inscriptions = inscriptionService.getInscriptionsByClasse(classeId);
        return ResponseEntity.ok(inscriptions);
    }

    @GetMapping("/classe/{classeId}/active")
    public ResponseEntity<List<InscriptionDTO>> getActiveInscriptionsForClasse(@PathVariable Long classeId) {
        List<InscriptionDTO> inscriptions = inscriptionService.getActiveInscriptionsForClasse(classeId);
        return ResponseEntity.ok(inscriptions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InscriptionDTO> updateInscription(@PathVariable Long id,
            @RequestBody InscriptionDTO inscriptionDTO) {
        InscriptionDTO updatedInscription = inscriptionService.updateInscription(id, inscriptionDTO);
        return ResponseEntity.ok(updatedInscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeStudentFromClass(@PathVariable Long id) {
        inscriptionService.removeStudentFromClass(id);
        return ResponseEntity.noContent().build();
    }
}
