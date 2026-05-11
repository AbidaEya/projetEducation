package com.education.app.repository;

import com.education.app.model.Demande;
import com.education.app.model.Etudiant;
import com.education.app.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    List<Demande> findByEtudiant(Etudiant etudiant);
    List<Demande> findByAdmin(Admin admin);
}
