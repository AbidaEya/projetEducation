package com.education.app.dto;

import java.time.LocalDateTime;

public class CommentaireDTO {
    private Long id;
    private String contenu;
    private LocalDateTime dateCommentaire;
    private Long userId;
    private Boolean supprimeur;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentaireDTO() {}

    public CommentaireDTO(Long id, String contenu, LocalDateTime dateCommentaire, Long userId, Boolean supprimeur, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.contenu = contenu;
        this.dateCommentaire = dateCommentaire;
        this.userId = userId;
        this.supprimeur = supprimeur;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public LocalDateTime getDateCommentaire() { return dateCommentaire; }
    public void setDateCommentaire(LocalDateTime dateCommentaire) { this.dateCommentaire = dateCommentaire; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getSupprimeur() { return supprimeur; }
    public void setSupprimeur(Boolean supprimeur) { this.supprimeur = supprimeur; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
