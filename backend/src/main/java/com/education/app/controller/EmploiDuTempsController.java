package com.education.app.controller;

import com.education.app.model.EmploiDuTemps;
import com.education.app.model.Cours;
import com.education.app.service.EmploiDuTempsService;
import com.education.app.service.CoursService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emploi-du-temps")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmploiDuTempsController {
    
    private final EmploiDuTempsService emploiDuTempsService;
    private final CoursService coursService;

    public EmploiDuTempsController(EmploiDuTempsService emploiDuTempsService, CoursService coursService) {
        this.emploiDuTempsService = emploiDuTempsService;
        this.coursService = coursService;
    }

    @PostMapping
    public ResponseEntity<EmploiDuTemps> createEmploiDuTemps(@RequestBody EmploiDuTemps emploiDuTemps) {
        EmploiDuTemps created = emploiDuTempsService.createEmploiDuTemps(emploiDuTemps);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmploiDuTemps> getEmploiDuTempsById(@PathVariable Long id) {
        return emploiDuTempsService.getEmploiDuTempsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmploiDuTemps>> getAllEmploiDuTemps() {
        List<EmploiDuTemps> emplois = emploiDuTempsService.getAllEmploiDuTemps();
        return ResponseEntity.ok(emplois);
    }

    @GetMapping("/cours/{coursId}")
    public ResponseEntity<List<EmploiDuTemps>> getEmploiDuTempsByCours(@PathVariable Long coursId) {
        java.util.Optional<Cours> coursOpt = coursService.getCoursById(coursId);
        if (coursOpt.isPresent()) {
            return ResponseEntity.ok(emploiDuTempsService.getEmploiDuTempsByCours(coursOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmploiDuTemps> updateEmploiDuTemps(@PathVariable Long id, @RequestBody EmploiDuTemps emploiDuTempsDetails) {
        EmploiDuTemps updated = emploiDuTempsService.updateEmploiDuTemps(id, emploiDuTempsDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmploiDuTemps(@PathVariable Long id) {
        emploiDuTempsService.deleteEmploiDuTemps(id);
        return ResponseEntity.ok().build();
    }
}
