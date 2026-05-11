package com.education.app.dto;

import com.education.app.model.Reclamation;
import java.time.LocalDateTime;

public class ReclamationDTO {
    private Long id;
    private String motif;
    private String typeReclamation;
    private Reclamation.Status statut;
    private Boolean urgent;
    private Long etudiantId;
    private Long adminId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReclamationDTO() {}

    public ReclamationDTO(Long id, String motif, String typeReclamation, Reclamation.Status statut, Boolean urgent, Long etudiantId, Long adminId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.motif = motif;
        this.typeReclamation = typeReclamation;
        this.statut = statut;
        this.urgent = urgent;
        this.etudiantId = etudiantId;
        this.adminId = adminId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(String typeReclamation) { this.typeReclamation = typeReclamation; }

    public Reclamation.Status getStatut() { return statut; }
    public void setStatut(Reclamation.Status statut) { this.statut = statut; }

    public Boolean getUrgent() { return urgent; }
    public void setUrgent(Boolean urgent) { this.urgent = urgent; }

    public Long getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Long etudiantId) { this.etudiantId = etudiantId; }

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
