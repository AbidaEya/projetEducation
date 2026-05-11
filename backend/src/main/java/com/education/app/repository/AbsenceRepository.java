package com.education.app.repository;

import com.education.app.model.Absence;
import com.education.app.model.Cours;
import com.education.app.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByEtudiant(Etudiant etudiant);
    List<Absence> findByCours(Cours cours);
    List<Absence> findByEtudiantAndCours(Etudiant etudiant, Cours cours);
}
