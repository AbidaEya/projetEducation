package com.education.app.dto;

import com.education.app.model.Demande_Stage;
import java.time.LocalDateTime;

public class Demande_StageDTO {
    private Long id;
    private String description;
    private String entreprise;
    private String responsableStage;
    private Demande_Stage.Status statut;
    private Boolean urgent;
    private Long etudiantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Demande_StageDTO() {}

    public Demande_StageDTO(Long id, String description, String entreprise, String responsableStage, Demande_Stage.Status statut, Boolean urgent, Long etudiantId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.description = description;
        this.entreprise = entreprise;
        this.responsableStage = responsableStage;
        this.statut = statut;
        this.urgent = urgent;
        this.etudiantId = etudiantId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }

    public String getResponsableStage() { return responsableStage; }
    public void setResponsableStage(String responsableStage) { this.responsableStage = responsableStage; }

    public Demande_Stage.Status getStatut() { return statut; }
    public void setStatut(Demande_Stage.Status statut) { this.statut = statut; }

    public Boolean getUrgent() { return urgent; }
    public void setUrgent(Boolean urgent) { this.urgent = urgent; }

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
