package com.education.app.controller;

import com.education.app.dto.ClasseDTO;
import com.education.app.service.ClasseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClasseController {
    
    private final ClasseService classeService;
    
    public ClasseController(ClasseService classeService) {
        this.classeService = classeService;
    }
    
    @PostMapping
    public ResponseEntity<ClasseDTO> createClasse(@RequestBody ClasseDTO classeDTO) {
        ClasseDTO createdClasse = classeService.createClasse(classeDTO);
        return new ResponseEntity<>(createdClasse, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ClasseDTO> getClasseById(@PathVariable Long id) {
        ClasseDTO classeDTO = classeService.getClasseById(id);
        return ResponseEntity.ok(classeDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<ClasseDTO>> getAllClasses() {
        List<ClasseDTO> classes = classeService.getAllClasses();
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<ClasseDTO>> getClassesByEnseignant(@PathVariable Long enseignantId) {
        List<ClasseDTO> classes = classeService.getClassesByEnseignant(enseignantId);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/level/{level}")
    public ResponseEntity<List<ClasseDTO>> getClassesByLevel(@PathVariable Integer level) {
        List<ClasseDTO> classes = classeService.getClassesByLevel(level);
        return ResponseEntity.ok(classes);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ClasseDTO> updateClasse(@PathVariable Long id, @RequestBody ClasseDTO classeDTO) {
        ClasseDTO updatedClasse = classeService.updateClasse(id, classeDTO);
        return ResponseEntity.ok(updatedClasse);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable Long id) {
        classeService.deleteClasse(id);
        return ResponseEntity.noContent().build();
    }
}
