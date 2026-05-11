package com.education.app.repository;

import com.education.app.model.Classe;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {
    List<Classe> findByEnseignant(User enseignant);
    List<Classe> findByNameContainingIgnoreCase(String name);
    List<Classe> findByLevel(Integer level);
}
