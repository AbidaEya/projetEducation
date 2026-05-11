package com.education.app.service;

import com.education.app.model.Notification;
import com.education.app.model.User;
import com.education.app.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Notification notification) {
        validateNotificationTarget(notification);
        normalizeNotification(notification);
        return notificationRepository.save(notification);
    }

    public Notification createTypedNotification(User user, Notification.Type type, String refKey, String message) {
        if (user == null)
            throw new IllegalArgumentException("user is required");
        if (message == null || message.isBlank())
            throw new IllegalArgumentException("message is required");

        if (refKey != null && !refKey.isBlank()) {
            boolean exists = notificationRepository.existsByUserAndRefKey(user, refKey);
            if (exists)
                return null;
        }

        Notification n = new Notification();
        n.setUser(user);
        n.setType(type);
        n.setRefKey(refKey);
        n.setMessage(message.trim());
        n.setLu(false);
        n.setDateNotification(LocalDateTime.now());
        n.setUpdatedAt(LocalDateTime.now());
        return notificationRepository.save(n);
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUserAndStatutApprobationOrderByDateNotificationDesc(user,
                Notification.StatutApprobation.APPROUVE);
    }

    public List<Notification> getUnreadNotificationsByUser(User user) {
        return notificationRepository.findByUserAndStatutApprobationAndLuOrderByDateNotificationDesc(user,
                Notification.StatutApprobation.APPROUVE, false);
    }

    public List<Notification> getLatestNotificationsByUser(User user, int limit) {
        if (limit <= 10)
            return notificationRepository.findTop10ByUserAndStatutApprobationOrderByDateNotificationDesc(user,
                    Notification.StatutApprobation.APPROUVE);
        return notificationRepository.findTop20ByUserAndStatutApprobationOrderByDateNotificationDesc(user,
                Notification.StatutApprobation.APPROUVE);
    }

    public int markAllAsRead(User user) {
        List<Notification> unread = notificationRepository
                .findByUserAndStatutApprobationAndLuOrderByDateNotificationDesc(
                        user,
                        Notification.StatutApprobation.APPROUVE,
                        false);
        if (unread.isEmpty())
            return 0;
        for (Notification n : unread) {
            n.setLu(true);
            n.setUpdatedAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    public Notification markAsRead(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification existing = notification.get();
            existing.setLu(true);
            return notificationRepository.save(existing);
        }
        return null;
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification existing = notification.get();
            existing.setMessage(notificationDetails.getMessage());
            existing.setTitre(notificationDetails.getTitre());
            existing.setAttachmentPath(notificationDetails.getAttachmentPath());
            existing.setDateNotification(notificationDetails.getDateNotification());
            existing.setLu(notificationDetails.getLu());
            existing.setUser(notificationDetails.getUser());
            return notificationRepository.save(existing);
        }
        return null;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // Get notifications pending approval
    public List<Notification> getPendingApproval() {
        return notificationRepository.findByStatutApprobation(Notification.StatutApprobation.EN_ATTENTE);
    }

    // Get approved notifications for a user
    public List<Notification> getApprovedNotificationsForUser(User user) {
        return notificationRepository.findByUserAndStatutApprobationOrderByDateNotificationDesc(user,
                Notification.StatutApprobation.APPROUVE);
    }

    // Get notifications created by a specific user (teacher)
    public List<Notification> getNotificationsCreatedBy(User createdBy) {
        return notificationRepository.findByCreatedBy(createdBy);
    }

    // Approve notification
    public Notification approveNotification(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification existing = notification.get();
            existing.setStatutApprobation(Notification.StatutApprobation.APPROUVE);
            existing.setUpdatedAt(LocalDateTime.now());
            return notificationRepository.save(existing);
        }
        return null;
    }

    // Reject notification
    public Notification rejectNotification(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification existing = notification.get();
            existing.setStatutApprobation(Notification.StatutApprobation.REJETE);
            existing.setUpdatedAt(LocalDateTime.now());
            return notificationRepository.save(existing);
        }
        return null;
    }

    // Create notification request (from teacher, needs approval)
    public Notification createNotificationRequest(Notification notification, User createdBy) {
        validateNotificationTarget(notification);
        normalizeNotification(notification);
        notification.setCreatedBy(createdBy);
        notification.setStatutApprobation(Notification.StatutApprobation.EN_ATTENTE);
        notification.setDateNotification(LocalDateTime.now());
        notification.setLu(false);
        notification.setUpdatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // Create direct notification (from admin, auto-approved)
    public Notification createDirectNotification(Notification notification, User createdBy) {
        validateNotificationTarget(notification);
        normalizeNotification(notification);
        notification.setCreatedBy(createdBy);
        notification.setStatutApprobation(Notification.StatutApprobation.APPROUVE);
        notification.setDateNotification(LocalDateTime.now());
        notification.setLu(false);
        notification.setUpdatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    private void validateNotificationTarget(Notification notification) {
        if (notification == null) {
            throw new IllegalArgumentException("notification is required");
        }
        if (notification.getUser() == null) {
            throw new IllegalArgumentException("notification user is required");
        }
        if (notification.getMessage() == null || notification.getMessage().isBlank()) {
            throw new IllegalArgumentException("notification message is required");
        }
    }

    private void normalizeNotification(Notification notification) {
        if (notification.getMessage() != null) {
            notification.setMessage(notification.getMessage().trim());
        }
        if (notification.getTitre() != null) {
            String titre = notification.getTitre().trim();
            notification.setTitre(titre.isEmpty() ? null : titre);
        }
        if (notification.getType() == null) {
            notification.setType(Notification.Type.ANNONCE);
        }
        if (notification.getLu() == null) {
            notification.setLu(false);
        }
        if (notification.getDateNotification() == null) {
            notification.setDateNotification(LocalDateTime.now());
        }
        notification.setUpdatedAt(LocalDateTime.now());
    }
}
