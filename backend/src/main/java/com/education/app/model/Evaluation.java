package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;
    
    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private User enseignant;
    
    @Column(nullable = false)
    private LocalDateTime dateEvaluation;
    
    private Integer dureeMinutes;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Double noteMaximale = 20.0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Evaluation() {}

    public Evaluation(String title, Classe classe, User enseignant, LocalDateTime dateEvaluation) {
        this.title = title;
        this.classe = classe;
        this.enseignant = enseignant;
        this.dateEvaluation = dateEvaluation;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }

    public User getEnseignant() { return enseignant; }
    public void setEnseignant(User enseignant) { this.enseignant = enseignant; }

    public LocalDateTime getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(LocalDateTime dateEvaluation) { this.dateEvaluation = dateEvaluation; }

    public Integer getDureeMinutes() { return dureeMinutes; }
    public void setDureeMinutes(Integer dureeMinutes) { this.dureeMinutes = dureeMinutes; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getNoteMaximale() { return noteMaximale; }
    public void setNoteMaximale(Double noteMaximale) { this.noteMaximale = noteMaximale; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
