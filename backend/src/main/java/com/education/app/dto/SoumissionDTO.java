package com.education.app.dto;

import java.time.LocalDateTime;

public class SoumissionDTO {
    private Long id;
    private Long devoirId;
    private Long etudiantId;
    private String contenu;
    private String filePath;
    private LocalDateTime dateSubmission;
    private Double note;
    private String feedback;
    private Boolean isEvaluated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SoumissionDTO() {}

    public SoumissionDTO(Long id, Long devoirId, Long etudiantId, String contenu, String filePath, LocalDateTime dateSubmission, Double note, String feedback, Boolean isEvaluated, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.devoirId = devoirId;
        this.etudiantId = etudiantId;
        this.contenu = contenu;
        this.filePath = filePath;
        this.dateSubmission = dateSubmission;
        this.note = note;
        this.feedback = feedback;
        this.isEvaluated = isEvaluated;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDevoirId() { return devoirId; }
    public void setDevoirId(Long devoirId) { this.devoirId = devoirId; }

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getDateSubmission() { return dateSubmission; }
    public void setDateSubmission(LocalDateTime dateSubmission) { this.dateSubmission = dateSubmission; }

    public Double getNote() { return note; }
    public void setNote(Double note) { this.note = note; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Boolean getIsEvaluated() { return isEvaluated; }
    public void setIsEvaluated(Boolean isEvaluated) { this.isEvaluated = isEvaluated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
