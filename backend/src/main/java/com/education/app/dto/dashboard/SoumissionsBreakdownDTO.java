package com.education.app.dto.dashboard;

public class SoumissionsBreakdownDTO {
    private long corrigees;
    private long enAttente;

    public SoumissionsBreakdownDTO() {}

    public SoumissionsBreakdownDTO(long corrigees, long enAttente) {
        this.corrigees = corrigees;
        this.enAttente = enAttente;
    }

    public long getCorrigees() { return corrigees; }
    public void setCorrigees(long corrigees) { this.corrigees = corrigees; }

    public long getEnAttente() { return enAttente; }
    public void setEnAttente(long enAttente) { this.enAttente = enAttente; }
}
