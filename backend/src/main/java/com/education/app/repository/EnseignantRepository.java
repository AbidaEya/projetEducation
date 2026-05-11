package com.education.app.repository;

import com.education.app.model.Enseignant;
import com.education.app.model.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByEmail(String email);
    List<Enseignant> findByDepartement(Departement departement);
}
