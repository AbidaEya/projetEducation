package com.education.app.repository;

import com.education.app.model.Cours;
import com.education.app.model.Departement;
import com.education.app.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursRepository extends JpaRepository<Cours, Long> {
    List<Cours> findByDepartement(Departement departement);
    List<Cours> findByEnseignant(Enseignant enseignant);
    List<Cours> findByNomCoursContainingIgnoreCase(String nomCours);
    List<Cours> findByDepartementAndEnseignant(Departement departement, Enseignant enseignant);
}
