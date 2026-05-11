package com.education.app.repository;

import com.education.app.model.Etudiant;
import com.education.app.model.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByEmail(String email);
    List<Etudiant> findByDepartement(Departement departement);
}
