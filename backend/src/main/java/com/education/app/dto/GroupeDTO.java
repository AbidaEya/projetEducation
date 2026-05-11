package com.education.app.dto;

import java.time.LocalDateTime;

public class GroupeDTO {
    private Long id;
    private String nomGroupe;
    private String description;
    private Integer niveau;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GroupeDTO() {}

    public GroupeDTO(Long id, String nomGroupe, String description, Integer niveau, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.nomGroupe = nomGroupe;
        this.description = description;
        this.niveau = niveau;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomGroupe() { return nomGroupe; }
    public void setNomGroupe(String nomGroupe) { this.nomGroupe = nomGroupe; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getNiveau() { return niveau; }
    public void setNiveau(Integer niveau) { this.niveau = niveau; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
