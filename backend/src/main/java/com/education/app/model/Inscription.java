package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscriptions")
public class Inscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private User etudiant;
    
    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;
    
    @Column(nullable = false)
    private LocalDateTime dateInscription = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    
    private Double moyenneFinale;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum Status {
        ACTIVE, SUSPENDU, TERMINE
    }

    public Inscription() {}

    public Inscription(User etudiant, Classe classe) {
        this.etudiant = etudiant;
        this.classe = classe;
        this.dateInscription = LocalDateTime.now();
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getEtudiant() { return etudiant; }
    public void setEtudiant(User etudiant) { this.etudiant = etudiant; }

    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }

    public LocalDateTime getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDateTime dateInscription) { this.dateInscription = dateInscription; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Double getMoyenneFinale() { return moyenneFinale; }
    public void setMoyenneFinale(Double moyenneFinale) { this.moyenneFinale = moyenneFinale; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
