package com.education.app.dto.actions;

public class MarkAbsenceRequest {
    private Long etudiantId;
    private Long coursId;
    private Long enseignantId;
    // Optional ISO datetime string; if omitted, now()
    private String dateAbsence;

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public Long getCoursId() { return coursId; }
    public void setCoursId(Long coursId) { this.coursId = coursId; }

    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }

    public String getDateAbsence() { return dateAbsence; }
    public void setDateAbsence(String dateAbsence) { this.dateAbsence = dateAbsence; }
}
