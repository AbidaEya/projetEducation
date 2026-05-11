package com.education.app.repository;

import com.education.app.model.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {
    Optional<Groupe> findByNomGroupe(String nomGroupe);
}
