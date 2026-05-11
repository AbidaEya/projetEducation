package com.education.app.dto;

import com.education.app.model.Inscription;
import java.time.LocalDateTime;

public class InscriptionDTO {
    private Long id;
    private Long etudiantId;
    private Long classeId;
    private LocalDateTime dateInscription;
    private Inscription.Status status;
    private Double moyenneFinale;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InscriptionDTO() {}

    public InscriptionDTO(Long id, Long etudiantId, Long classeId, LocalDateTime dateInscription, Inscription.Status status, Double moyenneFinale, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.etudiantId = etudiantId;
        this.classeId = classeId;
        this.dateInscription = dateInscription;
        this.status = status;
        this.moyenneFinale = moyenneFinale;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }

    public LocalDateTime getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDateTime dateInscription) { this.dateInscription = dateInscription; }

    public Inscription.Status getStatus() { return status; }
    public void setStatus(Inscription.Status status) { this.status = status; }

    public Double getMoyenneFinale() { return moyenneFinale; }
    public void setMoyenneFinale(Double moyenneFinale) { this.moyenneFinale = moyenneFinale; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
