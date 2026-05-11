package com.education.app.controller;

import com.education.app.dto.DevoirDTO;
import com.education.app.service.DevoirService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/devoirs")
@CrossOrigin(origins = "*")
public class DevoirController {
    
    private final DevoirService devoirService;
    
    public DevoirController(DevoirService devoirService) {
        this.devoirService = devoirService;
    }
    
    @PostMapping
    public ResponseEntity<DevoirDTO> createDevoir(@RequestBody DevoirDTO devoirDTO) {
        DevoirDTO createdDevoir = devoirService.createDevoir(devoirDTO);
        return new ResponseEntity<>(createdDevoir, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DevoirDTO> getDevoirById(@PathVariable Long id) {
        DevoirDTO devoirDTO = devoirService.getDevoirById(id);
        return ResponseEntity.ok(devoirDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<DevoirDTO>> getAllDevoirs() {
        List<DevoirDTO> devoirs = devoirService.getAllDevoirs();
        return ResponseEntity.ok(devoirs);
    }
    
    @GetMapping("/cours/{coursId}")
    public ResponseEntity<List<DevoirDTO>> getDevoirsByCours(@PathVariable Long coursId) {
        List<DevoirDTO> devoirs = devoirService.getDevoirsByCours(coursId);
        return ResponseEntity.ok(devoirs);
    }
    
    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<DevoirDTO>> getDevoirsByEnseignant(@PathVariable Long enseignantId) {
        List<DevoirDTO> devoirs = devoirService.getDevoirsByEnseignant(enseignantId);
        return ResponseEntity.ok(devoirs);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DevoirDTO> updateDevoir(@PathVariable Long id, @RequestBody DevoirDTO devoirDTO) {
        DevoirDTO updatedDevoir = devoirService.updateDevoir(id, devoirDTO);
        return ResponseEntity.ok(updatedDevoir);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevoir(@PathVariable Long id) {
        devoirService.deleteDevoir(id);
        return ResponseEntity.noContent().build();
    }
}
