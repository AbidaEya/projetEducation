package com.education.app.dto;

import java.time.LocalDateTime;

public class NoteDTO {
    private Long id;
    private Double valeur;
    private String observation;
    private Long etudiantId;
    private Long matiereId;
    private LocalDateTime dateNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NoteDTO() {}

    public NoteDTO(Long id, Double valeur, String observation, Long etudiantId, Long matiereId, LocalDateTime dateNote, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.valeur = valeur;
        this.observation = observation;
        this.etudiantId = etudiantId;
        this.matiereId = matiereId;
        this.dateNote = dateNote;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getValeur() { return valeur; }
    public void setValeur(Double valeur) { this.valeur = valeur; }

    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public Long getMatiereId() { return matiereId; }
    public void setMatiereId(Long matiereId) { this.matiereId = matiereId; }

    public LocalDateTime getDateNote() { return dateNote; }
    public void setDateNote(LocalDateTime dateNote) { this.dateNote = dateNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
