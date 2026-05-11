package com.education.app.dto;

import java.time.LocalDateTime;

public class CoursDTO {
    private Long id;
    private String title;
    private String description;
    private String content;
    private Long classeId;
    private Long enseignantId;
    private String ressourcePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CoursDTO() {}

    public CoursDTO(Long id, String title, String description, String content, Long classeId, Long enseignantId, String ressourcePath, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.classeId = classeId;
        this.enseignantId = enseignantId;
        this.ressourcePath = ressourcePath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }

    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }

    public String getRessourcePath() { return ressourcePath; }
    public void setRessourcePath(String ressourcePath) { this.ressourcePath = ressourcePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
