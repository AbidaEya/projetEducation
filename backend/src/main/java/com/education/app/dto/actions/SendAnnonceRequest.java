package com.education.app.dto.actions;

public class SendAnnonceRequest {
    private String message;
    // Optional: if set, send to students in this class
    private Long classeId;
    // Optional: ALL | ETUDIANT | ENSEIGNANT | ADMIN
    private String targetRole;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}
