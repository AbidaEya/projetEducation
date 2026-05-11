package com.education.app.repository;

import com.education.app.model.Commentaire;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByAuteur(User auteur);
    List<Commentaire> findBySupprimeurFalse();
}
