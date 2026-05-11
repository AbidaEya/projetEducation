package com.education.app.dto;

public class ReclamationNoteForwardRequest {
    private Long adminId;
    private Double valeurProposee;

    public ReclamationNoteForwardRequest() {
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public Double getValeurProposee() {
        return valeurProposee;
    }

    public void setValeurProposee(Double valeurProposee) {
        this.valeurProposee = valeurProposee;
    }
}
