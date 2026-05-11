package com.education.app.repository;

import com.education.app.model.Demande_Stage;
import com.education.app.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface Demande_StageRepository extends JpaRepository<Demande_Stage, Long> {
    List<Demande_Stage> findByEtudiant(Etudiant etudiant);
    List<Demande_Stage> findByStatut(Demande_Stage.Status statut);
    List<Demande_Stage> findByUrgentTrue();
}
