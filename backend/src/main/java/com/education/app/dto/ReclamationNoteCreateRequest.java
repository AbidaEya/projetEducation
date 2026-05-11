package com.education.app.dto;

public class ReclamationNoteCreateRequest {
    private Long noteId;
    private Long adminId;
    private String motif;
    private Double valeurProposee;
    private Boolean urgent;

    public ReclamationNoteCreateRequest() {
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Double getValeurProposee() {
        return valeurProposee;
    }

    public void setValeurProposee(Double valeurProposee) {
        this.valeurProposee = valeurProposee;
    }

    public Boolean getUrgent() {
        return urgent;
    }

    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }
}
