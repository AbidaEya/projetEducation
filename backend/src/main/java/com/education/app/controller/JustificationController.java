package com.education.app.controller;

import com.education.app.model.Justification;
import com.education.app.model.Absence;
import com.education.app.repository.AbsenceRepository;
import com.education.app.service.FileStorageService;
import com.education.app.service.JustificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/justifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JustificationController {

    @Autowired
    private JustificationService justificationService;

    @Autowired
    private AbsenceRepository absenceRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Justification>> list() {
        return getAllJustifications();
    }

    @PostMapping
    public ResponseEntity<Justification> create(@RequestBody Justification justification) {
        return createJustification(justification);
    }

    @PostMapping("/create")
    public ResponseEntity<Justification> createJustification(@RequestBody Justification justification) {
        Justification created = justificationService.createJustification(justification);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping(value = "/create-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Justification> createJustificationWithFile(
            @RequestParam("absenceId") Long absenceId,
            @RequestParam("motif") String motif,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new RuntimeException("Absence introuvable"));

        if (absence.getStatut() == Absence.Status.EN_ATTENTE) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Justification justification = new Justification();
        justification.setAbsence(absence);
        justification.setMotif(motif);
        justification.setDateJustification(LocalDateTime.now());
        justification.setStatut(Justification.Status.EN_ATTENTE);

        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.store(file, "justifications");
            justification.setDocument(url);
        }

        Justification created = justificationService.createJustification(justification);

        absence.setStatut(Absence.Status.EN_ATTENTE);
        absence.setUpdatedAt(LocalDateTime.now());
        absenceRepository.save(absence);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Justification> getJustificationById(@PathVariable Long id) {
        Optional<Justification> justification = justificationService.getJustificationById(id);
        if (justification.isPresent()) {
            return ResponseEntity.ok(justification.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Justification>> getAllJustifications() {
        List<Justification> justifications = justificationService.getAllJustifications();
        return ResponseEntity.ok(justifications);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Justification>> getPendingJustifications() {
        List<Justification> justifications = justificationService.getPendingJustifications();
        return ResponseEntity.ok(justifications);
    }

    @GetMapping("/absence/{absenceId}")
    public ResponseEntity<List<Justification>> getJustificationsByAbsence(@PathVariable Long absenceId) {
        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new RuntimeException("Absence introuvable"));
        return ResponseEntity.ok(justificationService.getJustificationsByAbsence(absence));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Justification> updateJustification(
            @PathVariable Long id,
            @RequestBody Justification justification) {
        Optional<Justification> existing = justificationService.getJustificationById(id);
        if (existing.isPresent()) {
            justification.setId(id);
            Justification updated = justificationService.updateJustification(justification);

            Absence absence = updated.getAbsence();
            if (absence != null) {
                if (updated.getStatut() == Justification.Status.ACCEPTEE) {
                    absence.setStatut(Absence.Status.JUSTIFIEE);
                } else if (updated.getStatut() == Justification.Status.REFUSEE) {
                    absence.setStatut(Absence.Status.NON_JUSTIFIEE);
                } else {
                    absence.setStatut(Absence.Status.EN_ATTENTE);
                }
                absence.setUpdatedAt(LocalDateTime.now());
                absenceRepository.save(absence);
            }

            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/consult")
    public ResponseEntity<Justification> markConsulted(@PathVariable Long id) {
        Optional<Justification> existing = justificationService.getJustificationById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Justification j = existing.get();
        if (j.getStatut() == Justification.Status.EN_ATTENTE) {
            j.setStatut(Justification.Status.CONSULTEE);
            j.setUpdatedAt(LocalDateTime.now());
            Justification saved = justificationService.updateJustification(j);
            return ResponseEntity.ok(saved);
        }

        return ResponseEntity.ok(j);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJustification(@PathVariable Long id) {
        justificationService.deleteJustification(id);
        return ResponseEntity.noContent().build();
    }
}
