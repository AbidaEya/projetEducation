package com.education.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue("ETUDIANT")
public class Etudiant extends User {
    
    @Column
    private String niveau;
    
    @ManyToOne
    @JoinColumn(name = "groupe_id")
    private Groupe groupe;
    
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;
    
    @ManyToMany(mappedBy = "etudiants")
    @JsonIgnore
    private List<Cours> cours;
    
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Absence> absences;
    
    @ManyToMany(mappedBy = "etudiants")
    @JsonIgnore
    private List<Projet> projets;
    
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Demande> demandes;
    
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Note> notes;
    
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reclamation> reclamations;
    
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Demande_Stage> demandesStage;
    
    public Etudiant() {
        super();
    }

    public Etudiant(String email, String password, String firstName, String lastName, String niveau) {
        super(email, password, firstName, lastName);
        this.niveau = niveau;
    }

    // Getters and Setters
    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public Groupe getGroupe() { return groupe; }
    public void setGroupe(Groupe groupe) { this.groupe = groupe; }

    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }

    public List<Cours> getCours() { return cours; }
    public void setCours(List<Cours> cours) { this.cours = cours; }

    public List<Absence> getAbsences() { return absences; }
    public void setAbsences(List<Absence> absences) { this.absences = absences; }

    public List<Projet> getProjets() { return projets; }
    public void setProjets(List<Projet> projets) { this.projets = projets; }

    public List<Demande> getDemandes() { return demandes; }
    public void setDemandes(List<Demande> demandes) { this.demandes = demandes; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }

    public List<Reclamation> getReclamations() { return reclamations; }
    public void setReclamations(List<Reclamation> reclamations) { this.reclamations = reclamations; }

    public List<Demande_Stage> getDemandesStage() { return demandesStage; }
    public void setDemandesStage(List<Demande_Stage> demandesStage) { this.demandesStage = demandesStage; }
}
