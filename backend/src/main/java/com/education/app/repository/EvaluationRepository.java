package com.education.app.repository;

import com.education.app.model.Evaluation;
import com.education.app.model.Classe;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByClasse(Classe classe);
    List<Evaluation> findByEnseignant(User enseignant);
    List<Evaluation> findByTitleContainingIgnoreCase(String title);
}
