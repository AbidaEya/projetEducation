package com.education.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    public enum Type {
        DEVOIR_UPLOAD,
        ETUDIANT_ABSENT,
        DEADLINE_PROCHE,
        ANNONCE
    }

    public enum StatutApprobation {
        EN_ATTENTE,
        APPROUVE,
        REJETE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String titre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type = Type.ANNONCE;

    @Column
    private String refKey;

    @Column(length = 1024)
    private String attachmentPath;

    @Column(nullable = false)
    private LocalDateTime dateNotification;

    @Column
    private Boolean lu = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutApprobation statutApprobation = StatutApprobation.APPROUVE;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Notification() {
    }

    public Notification(String message, User user) {
        this.message = message;
        this.user = user;
        this.dateNotification = LocalDateTime.now();
        this.lu = false;
        this.type = Type.ANNONCE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Notification(String message, Type type, String refKey, User user) {
        this.message = message;
        this.type = type;
        this.refKey = refKey;
        this.user = user;
        this.dateNotification = LocalDateTime.now();
        this.lu = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getRefKey() {
        return refKey;
    }

    public void setRefKey(String refKey) {
        this.refKey = refKey;
    }

    public String getAttachmentPath() {
        return attachmentPath;
    }

    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }

    public LocalDateTime getDateNotification() {
        return dateNotification;
    }

    public void setDateNotification(LocalDateTime dateNotification) {
        this.dateNotification = dateNotification;
    }

    public Boolean getLu() {
        return lu;
    }

    public void setLu(Boolean lu) {
        this.lu = lu;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public StatutApprobation getStatutApprobation() {
        return statutApprobation;
    }

    public void setStatutApprobation(StatutApprobation statutApprobation) {
        this.statutApprobation = statutApprobation;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Long getCreatedById() {
        return createdBy != null ? createdBy.getId() : null;
    }

    public String getCreatedByName() {
        return createdBy != null ? createdBy.getFirstName() + " " + createdBy.getLastName() : null;
    }

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public String getUserName() {
        return user != null ? user.getFirstName() + " " + user.getLastName() : null;
    }
}
