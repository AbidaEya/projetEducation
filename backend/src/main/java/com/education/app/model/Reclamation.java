package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamations")
public class Reclamation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String motif;
    
    @Column
    private String typeReclamation;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status statut = Status.EN_ATTENTE;
    
    public enum Status {
        EN_ATTENTE, TRAITEE, ACCEPTEE, REFUSEE
    }
    
    @Column
    private Boolean urgent = false;
    
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;
    
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Reclamation() {}

    public Reclamation(String motif, Etudiant etudiant) {
        this.motif = motif;
        this.etudiant = etudiant;
        this.statut = Status.EN_ATTENTE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(String typeReclamation) { this.typeReclamation = typeReclamation; }

    public Status getStatut() { return statut; }
    public void setStatut(Status statut) { this.statut = statut; }

    public Boolean getUrgent() { return urgent; }
    public void setUrgent(Boolean urgent) { this.urgent = urgent; }

    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
