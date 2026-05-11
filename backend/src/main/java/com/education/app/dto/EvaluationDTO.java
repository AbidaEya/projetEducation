package com.education.app.dto;

import java.time.LocalDateTime;

public class EvaluationDTO {
    private Long id;
    private String title;
    private Long classeId;
    private Long enseignantId;
    private LocalDateTime dateEvaluation;
    private Integer dureeMinutes;
    private String description;
    private Double noteMaximale;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EvaluationDTO() {}

    public EvaluationDTO(Long id, String title, Long classeId, Long enseignantId, LocalDateTime dateEvaluation, Integer dureeMinutes, String description, Double noteMaximale, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.classeId = classeId;
        this.enseignantId = enseignantId;
        this.dateEvaluation = dateEvaluation;
        this.dureeMinutes = dureeMinutes;
        this.description = description;
        this.noteMaximale = noteMaximale;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }

    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }

    public LocalDateTime getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(LocalDateTime dateEvaluation) { this.dateEvaluation = dateEvaluation; }

    public Integer getDureeMinutes() { return dureeMinutes; }
    public void setDureeMinutes(Integer dureeMinutes) { this.dureeMinutes = dureeMinutes; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getNoteMaximale() { return noteMaximale; }
    public void setNoteMaximale(Double noteMaximale) { this.noteMaximale = noteMaximale; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
