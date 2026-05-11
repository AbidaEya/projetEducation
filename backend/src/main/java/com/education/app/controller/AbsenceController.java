package com.education.app.controller;

import com.education.app.model.Absence;
import com.education.app.model.Cours;
import com.education.app.service.AbsenceService;
import com.education.app.service.CoursService;
import com.education.app.service.EtudiantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/absences")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AbsenceController {
    
    private final AbsenceService absenceService;
    private final EtudiantService etudiantService;
    private final CoursService coursService;

    public AbsenceController(AbsenceService absenceService, EtudiantService etudiantService, CoursService coursService) {
        this.absenceService = absenceService;
        this.etudiantService = etudiantService;
        this.coursService = coursService;
    }

    @PostMapping
    public ResponseEntity<Absence> createAbsence(@RequestBody Absence absence) {
        Absence created = absenceService.createAbsence(absence);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Absence> getAbsenceById(@PathVariable Long id) {
        return absenceService.getAbsenceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Absence>> getAllAbsences() {
        List<Absence> absences = absenceService.getAllAbsences();
        return ResponseEntity.ok(absences);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<Absence>> getAbsencesByEtudiant(@PathVariable Long etudiantId) {
        return etudiantService.getEtudiantById(etudiantId)
                .map(etudiant -> ResponseEntity.ok(absenceService.getAbsencesByEtudiant(etudiant)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cours/{coursId}")
    public ResponseEntity<List<Absence>> getAbsencesByCours(@PathVariable Long coursId) {
        java.util.Optional<Cours> coursOpt = coursService.getCoursById(coursId);
        if (coursOpt.isPresent()) {
            return ResponseEntity.ok(absenceService.getAbsencesByCours(coursOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Absence> updateAbsence(@PathVariable Long id, @RequestBody Absence absenceDetails) {
        Absence updated = absenceService.updateAbsence(id, absenceDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAbsence(@PathVariable Long id) {
        absenceService.deleteAbsence(id);
        return ResponseEntity.ok().build();
    }
}
