package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "devoirs")
public class Devoir {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "cours_id", nullable = false)
    private Cours cours;
    
    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private User enseignant;
    
    @Column(nullable = false)
    private LocalDateTime dateDebut;
    
    @Column(nullable = false)
    private LocalDateTime dateEchéance;
    
    @OneToMany(mappedBy = "devoir", cascade = CascadeType.ALL)
    private List<Soumission> soumissions;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Devoir() {}

    public Devoir(String title, String description, Cours cours, User enseignant, LocalDateTime dateDebut, LocalDateTime dateEchéance) {
        this.title = title;
        this.description = description;
        this.cours = cours;
        this.enseignant = enseignant;
        this.dateDebut = dateDebut;
        this.dateEchéance = dateEchéance;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Cours getCours() { return cours; }
    public void setCours(Cours cours) { this.cours = cours; }

    public User getEnseignant() { return enseignant; }
    public void setEnseignant(User enseignant) { this.enseignant = enseignant; }

    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }

    public LocalDateTime getDateEchéance() { return dateEchéance; }
    public void setDateEchéance(LocalDateTime dateEchéance) { this.dateEchéance = dateEchéance; }

    public List<Soumission> getSoumissions() { return soumissions; }
    public void setSoumissions(List<Soumission> soumissions) { this.soumissions = soumissions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
