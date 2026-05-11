package com.education.app.repository;

import com.education.app.model.Matiere;
import com.education.app.model.Cours;
import com.education.app.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Long> {
    List<Matiere> findByCours(Cours cours);
    List<Matiere> findByEnseignant(Enseignant enseignant);
    Matiere findByNomMatiere(String nomMatiere);
}
