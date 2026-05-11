package com.education.app.controller;

import com.education.app.dto.SoumissionDTO;
import com.education.app.service.FileStorageService;
import com.education.app.service.SoumissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/soumissions")
@CrossOrigin(origins = "*")
public class SoumissionController {

    private final SoumissionService soumissionService;
    private final FileStorageService fileStorageService;

    public SoumissionController(SoumissionService soumissionService, FileStorageService fileStorageService) {
        this.soumissionService = soumissionService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/submit")
    public ResponseEntity<SoumissionDTO> submitDevoir(@RequestBody SoumissionDTO soumissionDTO) {
        SoumissionDTO createdSoumission = soumissionService.submitDevoir(soumissionDTO);
        return new ResponseEntity<>(createdSoumission, HttpStatus.CREATED);
    }

    @PostMapping(value = "/submit-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SoumissionDTO> submitDevoirFile(
            @RequestParam("devoirId") Long devoirId,
            @RequestParam("etudiantId") Long etudiantId,
            @RequestParam(value = "contenu", required = false) String contenu,
            @RequestPart("file") MultipartFile file) {

        String url = fileStorageService.store(file, "soumissions");

        SoumissionDTO dto = new SoumissionDTO();
        dto.setDevoirId(devoirId);
        dto.setEtudiantId(etudiantId);
        dto.setContenu(contenu);
        dto.setFilePath(url);

        SoumissionDTO created = soumissionService.submitDevoir(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SoumissionDTO> getSoumissionById(@PathVariable Long id) {
        SoumissionDTO soumissionDTO = soumissionService.getSoumissionById(id);
        return ResponseEntity.ok(soumissionDTO);
    }

    @GetMapping("/devoir/{devoirId}")
    public ResponseEntity<List<SoumissionDTO>> getSoumissionsByDevoir(@PathVariable Long devoirId) {
        List<SoumissionDTO> soumissions = soumissionService.getSoumissionsByDevoir(devoirId);
        return ResponseEntity.ok(soumissions);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<SoumissionDTO>> getSoumissionsByEtudiant(@PathVariable Long etudiantId) {
        List<SoumissionDTO> soumissions = soumissionService.getSoumissionsByEtudiant(etudiantId);
        return ResponseEntity.ok(soumissions);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SoumissionDTO>> getPendingEvaluations() {
        List<SoumissionDTO> soumissions = soumissionService.getPendingEvaluations();
        return ResponseEntity.ok(soumissions);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SoumissionDTO>> getAllSoumissions() {
        List<SoumissionDTO> soumissions = soumissionService.getAllSoumissions();
        return ResponseEntity.ok(soumissions);
    }

    @PostMapping("/{id}/evaluate")
    public ResponseEntity<SoumissionDTO> evaluateSoumission(
            @PathVariable Long id,
            @RequestBody Map<String, Object> evaluationData) {
        Double note = Double.valueOf(evaluationData.get("note").toString());
        String feedback = evaluationData.get("feedback").toString();
        SoumissionDTO evaluatedSoumission = soumissionService.evaluateSoumission(id, note, feedback);
        return ResponseEntity.ok(evaluatedSoumission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSoumission(@PathVariable Long id) {
        soumissionService.deleteSoumission(id);
        return ResponseEntity.noContent().build();
    }
}
