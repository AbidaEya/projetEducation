package com.education.app.dto.actions;

public class AddSeanceRequest {
    private Long coursId;
    private String jour;
    private String heureDebut; // HH:mm
    private String heureFin;   // HH:mm
    private String salle;

    public Long getCoursId() { return coursId; }
    public void setCoursId(Long coursId) { this.coursId = coursId; }

    public String getJour() { return jour; }
    public void setJour(String jour) { this.jour = jour; }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }

    public String getSalle() { return salle; }
    public void setSalle(String salle) { this.salle = salle; }
}
