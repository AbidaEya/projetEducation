package com.education.app.repository;

import com.education.app.model.Soumission;
import com.education.app.model.Devoir;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SoumissionRepository extends JpaRepository<Soumission, Long> {
    List<Soumission> findByDevoir(Devoir devoir);

    List<Soumission> findByEtudiant(User etudiant);

    List<Soumission> findByDevoirAndEtudiant(Devoir devoir, User etudiant);

    List<Soumission> findByIsEvaluatedFalse();

    List<Soumission> findByIsEvaluatedTrue();

    long countByIsEvaluatedFalse();

    long countByIsEvaluatedTrue();

    long countByDevoirInAndIsEvaluatedTrue(List<Devoir> devoirs);

    long countByDevoirInAndIsEvaluatedFalse(List<Devoir> devoirs);
}
