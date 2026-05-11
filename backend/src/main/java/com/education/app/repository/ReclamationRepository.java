package com.education.app.repository;

import com.education.app.model.Reclamation;
import com.education.app.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByEtudiant(Etudiant etudiant);
    List<Reclamation> findByStatut(Reclamation.Status statut);
    List<Reclamation> findByUrgentTrue();
}
