package com.education.app.repository;

import com.education.app.model.Note;
import com.education.app.model.Etudiant;
import com.education.app.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByEtudiant(Etudiant etudiant);
    List<Note> findByMatiere(Matiere matiere);
    Optional<Note> findByEtudiantAndMatiere(Etudiant etudiant, Matiere matiere);
}
