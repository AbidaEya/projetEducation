package com.education.app.dto;

import java.time.LocalDateTime;

public class ClasseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer level;
    private Long enseignantId;
    private String enseignantName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClasseDTO() {}

    public ClasseDTO(Long id, String name, String description, Integer level, Long enseignantId, String enseignantName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.level = level;
        this.enseignantId = enseignantId;
        this.enseignantName = enseignantName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }

    public String getEnseignantName() { return enseignantName; }
    public void setEnseignantName(String enseignantName) { this.enseignantName = enseignantName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
