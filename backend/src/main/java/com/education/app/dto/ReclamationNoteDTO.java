package com.education.app.dto;

import com.education.app.model.ReclamationNote;

import java.time.LocalDateTime;

public class ReclamationNoteDTO {
    private Long id;
    private Long noteId;
    private Long etudiantId;

    private Double ancienneValeur;
    private Double valeurProposee;

    private String motif;
    private Boolean urgent;
    private ReclamationNote.Status statut;

    private Long adminId;
    private Long enseignantId;

    private String commentaireProf;

    private String etudiantNom;
    private String matiereNom;
    private String classeNom;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public ReclamationNoteDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public Long getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(Long etudiantId) {
        this.etudiantId = etudiantId;
    }

    public Double getAncienneValeur() {
        return ancienneValeur;
    }

    public void setAncienneValeur(Double ancienneValeur) {
        this.ancienneValeur = ancienneValeur;
    }

    public Double getValeurProposee() {
        return valeurProposee;
    }

    public void setValeurProposee(Double valeurProposee) {
        this.valeurProposee = valeurProposee;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Boolean getUrgent() {
        return urgent;
    }

    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }

    public ReclamationNote.Status getStatut() {
        return statut;
    }

    public void setStatut(ReclamationNote.Status statut) {
        this.statut = statut;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public String getCommentaireProf() {
        return commentaireProf;
    }

    public void setCommentaireProf(String commentaireProf) {
        this.commentaireProf = commentaireProf;
    }

    public String getEtudiantNom() {
        return etudiantNom;
    }

    public void setEtudiantNom(String etudiantNom) {
        this.etudiantNom = etudiantNom;
    }

    public String getMatiereNom() {
        return matiereNom;
    }

    public void setMatiereNom(String matiereNom) {
        this.matiereNom = matiereNom;
    }

    public String getClasseNom() {
        return classeNom;
    }

    public void setClasseNom(String classeNom) {
        this.classeNom = classeNom;
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

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
