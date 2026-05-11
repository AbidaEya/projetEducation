package com.education.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "absences")
public class Absence {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime dateAbsence;
    
    @Enumerated(EnumType.STRING)
    private Status statut = Status.NON_JUSTIFIEE;
    
    public enum Status {
        JUSTIFIEE,
        EN_ATTENTE,
        NON_JUSTIFIEE
    }
    
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;
    
    @ManyToOne
    @JoinColumn(name = "cours_id", nullable = false)
    private Cours cours;
    
    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;
    
    @OneToMany(mappedBy = "absence", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Justification> justifications;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Absence() {}

    public Absence(Etudiant etudiant, Cours cours, Enseignant enseignant) {
        this.etudiant = etudiant;
        this.cours = cours;
        this.enseignant = enseignant;
        this.dateAbsence = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDateAbsence() { return dateAbsence; }
    public void setDateAbsence(LocalDateTime dateAbsence) { this.dateAbsence = dateAbsence; }

    public Status getStatut() { return statut; }
    public void setStatut(Status statut) { this.statut = statut; }

    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }

    public Cours getCours() { return cours; }
    public void setCours(Cours cours) { this.cours = cours; }

    public Enseignant getEnseignant() { return enseignant; }
    public void setEnseignant(Enseignant enseignant) { this.enseignant = enseignant; }

    @JsonIgnore
    public List<Justification> getJustifications() { return justifications; }
    public void setJustifications(List<Justification> justifications) { this.justifications = justifications; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
