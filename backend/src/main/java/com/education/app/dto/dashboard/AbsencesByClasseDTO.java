package com.education.app.dto.dashboard;

public class AbsencesByClasseDTO {
    private String classe;
    private long absences;

    public AbsencesByClasseDTO() {}

    public AbsencesByClasseDTO(String classe, long absences) {
        this.classe = classe;
        this.absences = absences;
    }

    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }

    public long getAbsences() { return absences; }
    public void setAbsences(long absences) { this.absences = absences; }
}
