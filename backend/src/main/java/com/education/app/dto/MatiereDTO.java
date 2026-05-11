package com.education.app.dto;

import java.time.LocalDateTime;

public class MatiereDTO {
    private Long id;
    private String nomMatiere;
    private String description;
    private Integer credit;
    private Long coursId;
    private Long enseignantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MatiereDTO() {}

    public MatiereDTO(Long id, String nomMatiere, String description, Integer credit, Long coursId, Long enseignantId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.nomMatiere = nomMatiere;
        this.description = description;
        this.credit = credit;
        this.coursId = coursId;
        this.enseignantId = enseignantId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomMatiere() { return nomMatiere; }
    public void setNomMatiere(String nomMatiere) { this.nomMatiere = nomMatiere; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getCredit() { return credit; }
    public void setCredit(Integer credit) { this.credit = credit; }

    public Long getCoursId() { return coursId; }
    public void setCoursId(Long coursId) { this.coursId = coursId; }

    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
