package com.education.app.repository;

import com.education.app.model.ReclamationNote;
import com.education.app.model.Enseignant;
import com.education.app.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationNoteRepository extends JpaRepository<ReclamationNote, Long> {
    List<ReclamationNote> findByEnseignant(Enseignant enseignant);

    List<ReclamationNote> findByAdmin(Admin admin);

    List<ReclamationNote> findByStatut(ReclamationNote.Status statut);

    List<ReclamationNote> findByEnseignantAndStatut(Enseignant enseignant, ReclamationNote.Status statut);
}
