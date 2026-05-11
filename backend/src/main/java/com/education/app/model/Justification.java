package com.education.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "justifications")
public class Justification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String motif;
    
    @Column(nullable = false)
    private LocalDateTime dateJustification;
    
    @Column
    private String document;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status statut = Status.EN_ATTENTE;
    
    public enum Status {
        EN_ATTENTE, CONSULTEE, ACCEPTEE, REFUSEE
    }
    
    @ManyToOne
    @JoinColumn(name = "absence_id", nullable = false)
    private Absence absence;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Justification() {}

    public Justification(String motif, Absence absence) {
        this.motif = motif;
        this.absence = absence;
        this.dateJustification = LocalDateTime.now();
        this.statut = Status.EN_ATTENTE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public LocalDateTime getDateJustification() { return dateJustification; }
    public void setDateJustification(LocalDateTime dateJustification) { this.dateJustification = dateJustification; }

    public String getDocument() { return document; }
    public void setDocument(String document) { this.document = document; }

    public Status getStatut() { return statut; }
    public void setStatut(Status statut) { this.statut = statut; }

    public Absence getAbsence() { return absence; }
    public void setAbsence(Absence absence) { this.absence = absence; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
