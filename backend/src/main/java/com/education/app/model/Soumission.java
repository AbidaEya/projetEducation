package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "soumissions")
public class Soumission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "devoir_id", nullable = false)
    private Devoir devoir;
    
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private User etudiant;
    
    @Column(columnDefinition = "TEXT")
    private String contenu;
    
    private String filePath;
    
    @Column(nullable = false)
    private LocalDateTime dateSubmission = LocalDateTime.now();
    
    private Double note;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Boolean isEvaluated = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Soumission() {}

    public Soumission(Devoir devoir, User etudiant) {
        this.devoir = devoir;
        this.etudiant = etudiant;
        this.dateSubmission = LocalDateTime.now();
        this.isEvaluated = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Devoir getDevoir() { return devoir; }
    public void setDevoir(Devoir devoir) { this.devoir = devoir; }

    public User getEtudiant() { return etudiant; }
    public void setEtudiant(User etudiant) { this.etudiant = etudiant; }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getDateSubmission() { return dateSubmission; }
    public void setDateSubmission(LocalDateTime dateSubmission) { this.dateSubmission = dateSubmission; }

    public Double getNote() { return note; }
    public void setNote(Double note) { this.note = note; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Boolean getIsEvaluated() { return isEvaluated; }
    public void setIsEvaluated(Boolean isEvaluated) { this.isEvaluated = isEvaluated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
