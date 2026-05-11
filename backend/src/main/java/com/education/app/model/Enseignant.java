package com.education.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue("ENSEIGNANT")
public class Enseignant extends User {
    
    @Column
    private String specialite;
    
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;
    
    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cours> cours;
    
    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Absence> absences;
    
    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Projet> projets;
    
    public Enseignant() {
        super();
    }

    public Enseignant(String email, String password, String firstName, String lastName, String specialite) {
        super(email, password, firstName, lastName);
        this.specialite = specialite;
    }

    // Getters and Setters
    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }

    public List<Cours> getCours() { return cours; }
    public void setCours(List<Cours> cours) { this.cours = cours; }

    public List<Absence> getAbsences() { return absences; }
    public void setAbsences(List<Absence> absences) { this.absences = absences; }

    public List<Projet> getProjets() { return projets; }
    public void setProjets(List<Projet> projets) { this.projets = projets; }
}
