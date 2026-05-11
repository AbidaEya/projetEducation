package com.education.app.controller;

import com.education.app.model.Commentaire;
import com.education.app.service.CommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commentaires")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentaireController {
    
    @Autowired
    private CommentaireService commentaireService;
    
    @PostMapping("/create")
    public ResponseEntity<Commentaire> createCommentaire(@RequestBody Commentaire commentaire) {
        Commentaire created = commentaireService.createCommentaire(commentaire);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Commentaire> getCommentaireById(@PathVariable Long id) {
        Optional<Commentaire> commentaire = commentaireService.getCommentaireById(id);
        if (commentaire.isPresent()) {
            return ResponseEntity.ok(commentaire.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Commentaire>> getAllCommentaires() {
        List<Commentaire> commentaires = commentaireService.getAllCommentaires();
        return ResponseEntity.ok(commentaires);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Commentaire>> getActiveCommentaires() {
        List<Commentaire> commentaires = commentaireService.getActiveCommentaires();
        return ResponseEntity.ok(commentaires);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Commentaire> updateCommentaire(
            @PathVariable Long id,
            @RequestBody Commentaire commentaire) {
        Optional<Commentaire> existing = commentaireService.getCommentaireById(id);
        if (existing.isPresent()) {
            commentaire.setId(id);
            Commentaire updated = commentaireService.updateCommentaire(commentaire);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.softDeleteCommentaire(id);
        return ResponseEntity.noContent().build();
    }
}
