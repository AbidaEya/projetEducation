package com.education.app.controller;

import com.education.app.dto.NoteAdminViewDTO;
import com.education.app.model.Note;
import com.education.app.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping("/create")
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note created = noteService.createNote(note);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);
        if (note.isPresent()) {
            return ResponseEntity.ok(note.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/admin-view")
    public ResponseEntity<List<NoteAdminViewDTO>> getAdminViewNotes() {
        return ResponseEntity.ok(noteService.getAdminViewNotes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestBody Note note) {
        Optional<Note> existing = noteService.getNoteById(id);
        if (existing.isPresent()) {
            note.setId(id);
            Note updated = noteService.updateNote(note);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/etudiant/{etudiantId}/moyenne")
    public ResponseEntity<Double> getMoyenneEtudiant(@PathVariable Long etudiantId) {
        // Implémentation nécessaire: récupérer l'étudiant et calculer sa moyenne
        return ResponseEntity.ok(0.0);
    }
}
