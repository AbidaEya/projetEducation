package com.education.app.dto;

public class ReclamationNoteReviewRequest {
    private Long enseignantId;
    private String decision; // ACCEPTER | REFUSER
    private String commentaireProf;
    private Double valeurFinale;

    public ReclamationNoteReviewRequest() {
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getCommentaireProf() {
        return commentaireProf;
    }

    public void setCommentaireProf(String commentaireProf) {
        this.commentaireProf = commentaireProf;
    }

    public Double getValeurFinale() {
        return valeurFinale;
    }

    public void setValeurFinale(Double valeurFinale) {
        this.valeurFinale = valeurFinale;
    }
}
