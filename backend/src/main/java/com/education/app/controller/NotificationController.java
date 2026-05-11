package com.education.app.controller;

import com.education.app.model.Notification;
import com.education.app.model.User;
import com.education.app.service.FileStorageService;
import com.education.app.service.NotificationService;
import com.education.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public NotificationController(NotificationService notificationService, UserService userService,
            FileStorageService fileStorageService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAttachment(@RequestParam("file") MultipartFile file) {
        String path = fileStorageService.store(file, "notifications");
        return ResponseEntity.ok(Map.of("path", path));
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification created = notificationService.createNotification(notification);
        return ResponseEntity.ok(created);
    }

    // Admin: Create direct notification (auto-approved)
    @PostMapping("/admin/send")
    public ResponseEntity<?> adminSendNotification(@RequestBody Map<String, Object> payload) {
        Long adminId = payload.get("adminId") != null ? Long.valueOf(payload.get("adminId").toString()) : null;
        Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
        String titre = (String) payload.get("titre");
        String message = (String) payload.get("message");
        String attachmentPath = payload.get("attachmentPath") != null ? payload.get("attachmentPath").toString() : null;

        if (adminId == null || userId == null || message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("adminId, userId et message sont requis");
        }

        java.util.Optional<User> adminOpt = userService.getUserById(adminId);
        java.util.Optional<User> userOpt = userService.getUserById(userId);

        if (adminOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (adminOpt.get().getRole() == null || !"ADMIN".equals(adminOpt.get().getRole().name())) {
            return ResponseEntity.badRequest().body("adminId invalide (doit être un admin)");
        }

        Notification notification = new Notification();
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setAttachmentPath(attachmentPath);
        notification.setUser(userOpt.get());
        notification.setType(Notification.Type.ANNONCE);

        Notification created = notificationService.createDirectNotification(notification, adminOpt.get());
        return ResponseEntity.ok(created);
    }

    // Admin: Send notification to multiple users
    @PostMapping("/admin/broadcast")
    public ResponseEntity<?> adminBroadcastNotification(@RequestBody Map<String, Object> payload) {
        Long adminId = payload.get("adminId") != null ? Long.valueOf(payload.get("adminId").toString()) : null;
        @SuppressWarnings("unchecked")
        List<Long> userIds = payload.get("userIds") != null
                ? ((List<Number>) payload.get("userIds")).stream().map(Number::longValue).toList()
                : null;
        String titre = (String) payload.get("titre");
        String message = (String) payload.get("message");
        String attachmentPath = payload.get("attachmentPath") != null ? payload.get("attachmentPath").toString() : null;
        String targetRole = (String) payload.get("targetRole"); // ETUDIANT, ENSEIGNANT, ADMIN, ALL

        if (adminId == null || message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("adminId et message sont requis");
        }

        java.util.Optional<User> adminOpt = userService.getUserById(adminId);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (adminOpt.get().getRole() == null || !"ADMIN".equals(adminOpt.get().getRole().name())) {
            return ResponseEntity.badRequest().body("adminId invalide (doit être un admin)");
        }

        List<User> targetUsers;
        if (targetRole != null && !targetRole.isEmpty()) {
            String normalizedRole = targetRole.trim().toUpperCase();
            if (normalizedRole.equals("ALL") || normalizedRole.equals("TOUS")) {
                targetUsers = userService.getAllUsers();
            } else {
                targetUsers = userService.getAllUsers().stream()
                        .filter(u -> u.getRole() != null)
                        .filter(u -> u.getRole().name().equals(normalizedRole))
                        .toList();
            }
        } else if (userIds != null && !userIds.isEmpty()) {
            targetUsers = userIds.stream()
                    .map(userService::getUserById)
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .toList();
        } else {
            return ResponseEntity.badRequest().body("userIds ou targetRole requis");
        }

        int count = 0;
        for (User user : targetUsers) {
            Notification notification = new Notification();
            notification.setTitre(titre);
            notification.setMessage(message);
            notification.setAttachmentPath(attachmentPath);
            notification.setUser(user);
            notification.setType(Notification.Type.ANNONCE);
            notificationService.createDirectNotification(notification, adminOpt.get());
            count++;
        }

        return ResponseEntity.ok(Map.of("sent", count));
    }

    // Teacher: Create direct notification to a student
    @PostMapping("/enseignant/request")
    public ResponseEntity<?> teacherRequestNotification(@RequestBody Map<String, Object> payload) {
        Long enseignantId = payload.get("enseignantId") != null ? Long.valueOf(payload.get("enseignantId").toString())
                : null;
        Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
        String titre = (String) payload.get("titre");
        String message = (String) payload.get("message");
        String attachmentPath = payload.get("attachmentPath") != null ? payload.get("attachmentPath").toString() : null;

        if (enseignantId == null || userId == null || message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("enseignantId, userId et message sont requis");
        }

        java.util.Optional<User> enseignantOpt = userService.getUserById(enseignantId);
        java.util.Optional<User> userOpt = userService.getUserById(userId);

        if (enseignantOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (enseignantOpt.get().getRole() == null || !"ENSEIGNANT".equals(enseignantOpt.get().getRole().name())) {
            return ResponseEntity.badRequest().body("enseignantId invalide (doit être un enseignant)");
        }

        Notification notification = new Notification();
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setAttachmentPath(attachmentPath);
        notification.setUser(userOpt.get());
        notification.setType(Notification.Type.ANNONCE);

        Notification created = notificationService.createDirectNotification(notification, enseignantOpt.get());
        return ResponseEntity.ok(created);
    }

    // Teacher: Send notification for multiple students
    @PostMapping("/enseignant/broadcast")
    public ResponseEntity<?> teacherBroadcastRequest(@RequestBody Map<String, Object> payload) {
        Long enseignantId = payload.get("enseignantId") != null ? Long.valueOf(payload.get("enseignantId").toString())
                : null;
        @SuppressWarnings("unchecked")
        List<Long> userIds = payload.get("userIds") != null
                ? ((List<Number>) payload.get("userIds")).stream().map(Number::longValue).toList()
                : null;
        String titre = (String) payload.get("titre");
        String message = (String) payload.get("message");
        String attachmentPath = payload.get("attachmentPath") != null ? payload.get("attachmentPath").toString() : null;

        if (enseignantId == null || userIds == null || userIds.isEmpty() || message == null
                || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("enseignantId, userIds et message sont requis");
        }

        java.util.Optional<User> enseignantOpt = userService.getUserById(enseignantId);
        if (enseignantOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (enseignantOpt.get().getRole() == null || !"ENSEIGNANT".equals(enseignantOpt.get().getRole().name())) {
            return ResponseEntity.badRequest().body("enseignantId invalide (doit être un enseignant)");
        }

        int count = 0;
        for (Long userId : userIds) {
            java.util.Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isPresent()) {
                Notification notification = new Notification();
                notification.setTitre(titre);
                notification.setMessage(message);
                notification.setAttachmentPath(attachmentPath);
                notification.setUser(userOpt.get());
                notification.setType(Notification.Type.ANNONCE);
                notificationService.createDirectNotification(notification, enseignantOpt.get());
                count++;
            }
        }

        return ResponseEntity.ok(Map.of("sent", count));
    }

    // Get notifications created by a teacher
    @GetMapping("/enseignant/{enseignantId}/created")
    public ResponseEntity<List<Notification>> getNotificationsCreatedBy(@PathVariable Long enseignantId) {
        java.util.Optional<User> enseignantOpt = userService.getUserById(enseignantId);
        if (enseignantOpt.isPresent()) {
            return ResponseEntity.ok(notificationService.getNotificationsCreatedBy(enseignantOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    // Admin: Get pending notifications
    @GetMapping("/admin/pending")
    public ResponseEntity<List<Notification>> getPendingNotifications() {
        return ResponseEntity.ok(notificationService.getPendingApproval());
    }

    // Admin: Approve notification
    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<Notification> approveNotification(@PathVariable Long id) {
        Notification approved = notificationService.approveNotification(id);
        return approved != null ? ResponseEntity.ok(approved) : ResponseEntity.notFound().build();
    }

    // Backward compatibility: allow POST approve
    @PostMapping("/admin/{id}/approve")
    public ResponseEntity<Notification> approveNotificationPost(@PathVariable Long id) {
        return approveNotification(id);
    }

    // Admin: Reject notification
    @PutMapping("/admin/{id}/reject")
    public ResponseEntity<Notification> rejectNotification(@PathVariable Long id) {
        Notification rejected = notificationService.rejectNotification(id);
        return rejected != null ? ResponseEntity.ok(rejected) : ResponseEntity.notFound().build();
    }

    // Backward compatibility: allow POST reject
    @PostMapping("/admin/{id}/reject")
    public ResponseEntity<Notification> rejectNotificationPost(@PathVariable Long id) {
        return rejectNotification(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        java.util.Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(notificationService.getNotificationsByUser(userOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        java.util.Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(notificationService.getUnreadNotificationsByUser(userOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<List<Notification>> getLatestNotifications(
            @PathVariable Long userId,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        java.util.Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(notificationService.getLatestNotificationsByUser(userOpt.get(), limit));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Integer> markAllAsRead(@PathVariable Long userId) {
        java.util.Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isPresent()) {
            int count = notificationService.markAllAsRead(userOpt.get());
            return ResponseEntity.ok(count);
        }
        return ResponseEntity.notFound().build();
    }

    // Backward compatibility: allow POST read-all
    @PostMapping("/user/{userId}/read-all")
    public ResponseEntity<Integer> markAllAsReadPost(@PathVariable Long userId) {
        return markAllAsRead(userId);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification updated = notificationService.markAsRead(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Backward compatibility: allow POST read
    @PostMapping("/{id}/read")
    public ResponseEntity<Notification> markAsReadPost(@PathVariable Long id) {
        return markAsRead(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id,
            @RequestBody Notification notificationDetails) {
        Notification updated = notificationService.updateNotification(id, notificationDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}
