package com.education.app.controller;

import com.education.app.dto.ReclamationNoteCreateRequest;
import com.education.app.dto.ReclamationNoteDTO;
import com.education.app.dto.ReclamationNoteForwardRequest;
import com.education.app.dto.ReclamationNoteReviewRequest;
import com.education.app.dto.ReclamationNoteStudentRequest;
import com.education.app.service.ReclamationNoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamation-notes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReclamationNoteController {

    private final ReclamationNoteService reclamationNoteService;

    public ReclamationNoteController(ReclamationNoteService reclamationNoteService) {
        this.reclamationNoteService = reclamationNoteService;
    }

    @PostMapping("/create")
    public ResponseEntity<ReclamationNoteDTO> create(@RequestBody ReclamationNoteCreateRequest req) {
        return new ResponseEntity<>(reclamationNoteService.create(req), HttpStatus.CREATED);
    }

    @PostMapping("/etudiant/request")
    public ResponseEntity<ReclamationNoteDTO> requestByEtudiant(@RequestBody ReclamationNoteStudentRequest req) {
        return new ResponseEntity<>(reclamationNoteService.requestByEtudiant(req), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReclamationNoteDTO>> all() {
        return ResponseEntity.ok(reclamationNoteService.listAll());
    }

    @GetMapping("/pending-admin")
    public ResponseEntity<List<ReclamationNoteDTO>> pendingForAdmin() {
        return ResponseEntity.ok(reclamationNoteService.listPendingForAdmin());
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<ReclamationNoteDTO>> forAdmin(@PathVariable Long adminId) {
        return ResponseEntity.ok(reclamationNoteService.listForAdmin(adminId));
    }

    @GetMapping("/enseignant/{enseignantId}/pending")
    public ResponseEntity<List<ReclamationNoteDTO>> pendingForEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(reclamationNoteService.listPendingForEnseignant(enseignantId));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ReclamationNoteDTO> review(@PathVariable Long id,
            @RequestBody ReclamationNoteReviewRequest req) {
        return ResponseEntity.ok(reclamationNoteService.review(id, req));
    }

    @PutMapping("/{id}/forward")
    public ResponseEntity<ReclamationNoteDTO> forward(@PathVariable Long id,
            @RequestBody ReclamationNoteForwardRequest req) {
        return ResponseEntity.ok(reclamationNoteService.forwardToEnseignant(id, req));
    }
}
