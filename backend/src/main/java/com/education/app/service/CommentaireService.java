package com.education.app.service;

import com.education.app.model.Commentaire;
import com.education.app.model.User;
import com.education.app.repository.CommentaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CommentaireService {
    
    @Autowired
    private CommentaireRepository commentaireRepository;
    
    public Commentaire createCommentaire(Commentaire commentaire) {
        return commentaireRepository.save(commentaire);
    }
    
    public Optional<Commentaire> getCommentaireById(Long id) {
        return commentaireRepository.findById(id);
    }
    
    public List<Commentaire> getAllCommentaires() {
        return commentaireRepository.findAll();
    }
    
    public List<Commentaire> getCommentairesByAuteur(User auteur) {
        return commentaireRepository.findByAuteur(auteur);
    }
    
    public List<Commentaire> getActiveCommentaires() {
        return commentaireRepository.findBySupprimeurFalse();
    }
    
    public Commentaire updateCommentaire(Commentaire commentaire) {
        return commentaireRepository.save(commentaire);
    }
    
    public void deleteCommentaire(Long id) {
        commentaireRepository.deleteById(id);
    }
    
    public void softDeleteCommentaire(Long id) {
        Optional<Commentaire> commentaire = commentaireRepository.findById(id);
        if (commentaire.isPresent()) {
            Commentaire c = commentaire.get();
            c.setSupprimeur(true);
            commentaireRepository.save(c);
        }
    }
}
