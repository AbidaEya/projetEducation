package com.education.app.controller;

import com.education.app.model.Cours;
import com.education.app.model.Departement;
import com.education.app.model.Enseignant;
import com.education.app.service.CoursService;
import com.education.app.service.DepartementService;
import com.education.app.service.EnseignantService;
import com.education.app.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/cours")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CoursController {

    private final CoursService coursService;
    private final DepartementService departementService;
    private final EnseignantService enseignantService;
    private final FileStorageService fileStorageService;

    public CoursController(CoursService coursService, DepartementService departementService,
            EnseignantService enseignantService, FileStorageService fileStorageService) {
        this.coursService = coursService;
        this.departementService = departementService;
        this.enseignantService = enseignantService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Cours> createCours(@RequestBody Cours cours) {
        Cours created = coursService.createCours(cours);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cours> getCoursById(@PathVariable Long id) {
        return coursService.getCoursById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Cours>> getAllCours() {
        List<Cours> cours = coursService.getAllCours();
        return ResponseEntity.ok(cours);
    }

    @GetMapping("/departement/{departementId}")
    public ResponseEntity<List<Cours>> getCoursByDepartement(@PathVariable Long departementId) {
        java.util.Optional<Departement> deptOpt = departementService.getDepartementById(departementId);
        if (deptOpt.isPresent()) {
            return ResponseEntity.ok(coursService.getCoursByDepartement(deptOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<Cours>> getCoursByEnseignant(@PathVariable Long enseignantId) {
        java.util.Optional<Enseignant> ensOpt = enseignantService.getEnseignantById(enseignantId);
        if (ensOpt.isPresent()) {
            return ResponseEntity.ok(coursService.getCoursByEnseignant(ensOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cours> updateCours(@PathVariable Long id, @RequestBody Cours coursDetails) {
        Cours updated = coursService.updateCours(id, coursDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/{id}/upload-resource", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Cours> uploadResource(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        Cours cours = coursService.getCoursById(id).orElse(null);
        if (cours == null)
            return ResponseEntity.notFound().build();

        String url = fileStorageService.store(file, "cours");
        cours.setRessourcePath(url);
        Cours updated = coursService.updateCours(id, cours);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/resource")
    public ResponseEntity<Cours> clearResource(@PathVariable Long id) {
        Cours cours = coursService.getCoursById(id).orElse(null);
        if (cours == null)
            return ResponseEntity.notFound().build();

        cours.setRessourcePath(null);
        Cours updated = coursService.updateCours(id, cours);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCours(@PathVariable Long id) {
        coursService.deleteCours(id);
        return ResponseEntity.ok().build();
    }
}
