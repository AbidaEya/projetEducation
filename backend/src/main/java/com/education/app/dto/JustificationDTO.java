package com.education.app.dto;

import com.education.app.model.Justification;
import java.time.LocalDateTime;

public class JustificationDTO {
    private Long id;
    private String motif;
    private LocalDateTime dateJustification;
    private String document;
    private Justification.Status statut;
    private Long absenceId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JustificationDTO() {}

    public JustificationDTO(Long id, String motif, LocalDateTime dateJustification, String document, Justification.Status statut, Long absenceId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.motif = motif;
        this.dateJustification = dateJustification;
        this.document = document;
        this.statut = statut;
        this.absenceId = absenceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public LocalDateTime getDateJustification() { return dateJustification; }
    public void setDateJustification(LocalDateTime dateJustification) { this.dateJustification = dateJustification; }

    public String getDocument() { return document; }
    public void setDocument(String document) { this.document = document; }

    public Justification.Status getStatut() { return statut; }
    public void setStatut(Justification.Status statut) { this.statut = statut; }

    public Long getAbsenceId() { return absenceId; }
    public void setAbsenceId(Long absenceId) { this.absenceId = absenceId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
