package com.education.app.repository;

import com.education.app.model.Devoir;
import com.education.app.model.Cours;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DevoirRepository extends JpaRepository<Devoir, Long> {
    List<Devoir> findByCours(Cours cours);
    List<Devoir> findByEnseignant(User enseignant);
    List<Devoir> findByTitleContainingIgnoreCase(String title);

    List<Devoir> findByDateEchéanceBetween(LocalDateTime start, LocalDateTime end);
}
