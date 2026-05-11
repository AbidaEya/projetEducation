package com.education.app.dto;

import java.time.LocalDateTime;

public class DevoirDTO {
    private Long id;
    private String title;
    private String description;
    private Long coursId;
    private String coursNom;
    private String coursRessourcePath;
    private Long enseignantId;
    private String enseignantNom;
    private LocalDateTime dateDebut;
    private LocalDateTime dateEchéance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DevoirDTO() {
    }

    public DevoirDTO(Long id, String title, String description, Long coursId, String coursNom,
            String coursRessourcePath, Long enseignantId, String enseignantNom, LocalDateTime dateDebut,
            LocalDateTime dateEchéance, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.coursId = coursId;
        this.coursNom = coursNom;
        this.coursRessourcePath = coursRessourcePath;
        this.enseignantId = enseignantId;
        this.enseignantNom = enseignantNom;
        this.dateDebut = dateDebut;
        this.dateEchéance = dateEchéance;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCoursId() {
        return coursId;
    }

    public void setCoursId(Long coursId) {
        this.coursId = coursId;
    }

    public String getCoursNom() {
        return coursNom;
    }

    public void setCoursNom(String coursNom) {
        this.coursNom = coursNom;
    }

    public String getCoursRessourcePath() {
        return coursRessourcePath;
    }

    public void setCoursRessourcePath(String coursRessourcePath) {
        this.coursRessourcePath = coursRessourcePath;
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public String getEnseignantNom() {
        return enseignantNom;
    }

    public void setEnseignantNom(String enseignantNom) {
        this.enseignantNom = enseignantNom;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateEchéance() {
        return dateEchéance;
    }

    public void setDateEchéance(LocalDateTime dateEchéance) {
        this.dateEchéance = dateEchéance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
