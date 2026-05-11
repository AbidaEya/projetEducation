package com.education.app.repository;

import com.education.app.model.Inscription;
import com.education.app.model.Classe;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByEtudiant(User etudiant);

    List<Inscription> findByClasse(Classe classe);

    Optional<Inscription> findByEtudiantAndClasse(User etudiant, Classe classe);

    List<Inscription> findByStatus(Inscription.Status status);

    List<Inscription> findByClasseAndStatus(Classe classe, Inscription.Status status);

    Optional<Inscription> findTopByEtudiantAndStatusOrderByDateInscriptionDesc(User etudiant,
            Inscription.Status status);
}
