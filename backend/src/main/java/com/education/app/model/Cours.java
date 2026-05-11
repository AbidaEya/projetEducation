package com.education.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cours")
public class Cours {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nomCours;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column
    private Integer coefficient;
    
    @Column
    private Integer volumeHoraire;
    
    @ManyToOne
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;
    
    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;
    
    @ManyToMany
    @JoinTable(
        name = "cours_etudiants",
        joinColumns = @JoinColumn(name = "cours_id"),
        inverseJoinColumns = @JoinColumn(name = "etudiant_id")
    )
    @JsonIgnore
    private List<Etudiant> etudiants;
    
    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Absence> absences;
    
    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EmploiDuTemps> emploiDuTemps;
    
    private String ressourcePath;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Cours() {}

    public Cours(String nomCours, Departement departement, Enseignant enseignant) {
        this.nomCours = nomCours;
        this.departement = departement;
        this.enseignant = enseignant;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomCours() { return nomCours; }
    public void setNomCours(String nomCours) { this.nomCours = nomCours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getCoefficient() { return coefficient; }
    public void setCoefficient(Integer coefficient) { this.coefficient = coefficient; }

    public Integer getVolumeHoraire() { return volumeHoraire; }
    public void setVolumeHoraire(Integer volumeHoraire) { this.volumeHoraire = volumeHoraire; }

    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }

    public Enseignant getEnseignant() { return enseignant; }
    public void setEnseignant(Enseignant enseignant) { this.enseignant = enseignant; }

    public List<Etudiant> getEtudiants() { return etudiants; }
    public void setEtudiants(List<Etudiant> etudiants) { this.etudiants = etudiants; }

    public List<Absence> getAbsences() { return absences; }
    public void setAbsences(List<Absence> absences) { this.absences = absences; }

    public List<EmploiDuTemps> getEmploiDuTemps() { return emploiDuTemps; }
    public void setEmploiDuTemps(List<EmploiDuTemps> emploiDuTemps) { this.emploiDuTemps = emploiDuTemps; }

    public String getRessourcePath() { return ressourcePath; }
    public void setRessourcePath(String ressourcePath) { this.ressourcePath = ressourcePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
