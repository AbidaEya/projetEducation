package com.education.app.dto;

import java.time.LocalDateTime;

public class NoteAdminViewDTO {
    private Long id;
    private Double valeur;
    private String observation;
    private LocalDateTime dateNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long etudiantId;
    private String etudiantNom;
    private String etudiantEmail;

    private Long matiereId;
    private String matiereNom;

    private Long enseignantId;
    private String enseignantNom;

    private Long classeId;
    private String classeNom;

    public NoteAdminViewDTO() {
    }

    public NoteAdminViewDTO(
            Long id,
            Double valeur,
            String observation,
            LocalDateTime dateNote,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Long etudiantId,
            String etudiantNom,
            String etudiantEmail,
            Long matiereId,
            String matiereNom,
            Long enseignantId,
            String enseignantNom,
            Long classeId,
            String classeNom) {
        this.id = id;
        this.valeur = valeur;
        this.observation = observation;
        this.dateNote = dateNote;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.etudiantId = etudiantId;
        this.etudiantNom = etudiantNom;
        this.etudiantEmail = etudiantEmail;
        this.matiereId = matiereId;
        this.matiereNom = matiereNom;
        this.enseignantId = enseignantId;
        this.enseignantNom = enseignantNom;
        this.classeId = classeId;
        this.classeNom = classeNom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValeur() {
        return valeur;
    }

    public void setValeur(Double valeur) {
        this.valeur = valeur;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public LocalDateTime getDateNote() {
        return dateNote;
    }

    public void setDateNote(LocalDateTime dateNote) {
        this.dateNote = dateNote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(Long etudiantId) {
        this.etudiantId = etudiantId;
    }

    public String getEtudiantNom() {
        return etudiantNom;
    }

    public void setEtudiantNom(String etudiantNom) {
        this.etudiantNom = etudiantNom;
    }

    public String getEtudiantEmail() {
        return etudiantEmail;
    }

    public void setEtudiantEmail(String etudiantEmail) {
        this.etudiantEmail = etudiantEmail;
    }

    public Long getMatiereId() {
        return matiereId;
    }

    public void setMatiereId(Long matiereId) {
        this.matiereId = matiereId;
    }

    public String getMatiereNom() {
        return matiereNom;
    }

    public void setMatiereNom(String matiereNom) {
        this.matiereNom = matiereNom;
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public String getEnseignantNom() {
        return enseignantNom;
    }

    public void setEnseignantNom(String enseignantNom) {
        this.enseignantNom = enseignantNom;
    }

    public Long getClasseId() {
        return classeId;
    }

    public void setClasseId(Long classeId) {
        this.classeId = classeId;
    }

    public String getClasseNom() {
        return classeNom;
    }

    public void setClasseNom(String classeNom) {
        this.classeNom = classeNom;
    }
}
