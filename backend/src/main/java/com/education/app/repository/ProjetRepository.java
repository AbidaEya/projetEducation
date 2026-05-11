package com.education.app.repository;

import com.education.app.model.Projet;
import com.education.app.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
    List<Projet> findByEnseignant(Enseignant enseignant);
}
