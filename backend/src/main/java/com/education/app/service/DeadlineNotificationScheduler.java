package com.education.app.service;

import com.education.app.model.Cours;
import com.education.app.model.Devoir;
import com.education.app.model.Etudiant;
import com.education.app.model.Notification;
import com.education.app.repository.DevoirRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeadlineNotificationScheduler {

    private final DevoirRepository devoirRepository;
    private final NotificationService notificationService;

    public DeadlineNotificationScheduler(DevoirRepository devoirRepository, NotificationService notificationService) {
        this.devoirRepository = devoirRepository;
        this.notificationService = notificationService;
    }

    // Runs every hour; sends notifications for deadlines within next 48h
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void notifyUpcomingDeadlines() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime horizon = now.plusHours(48);
        List<Devoir> devoirs = devoirRepository.findByDateEchéanceBetween(now, horizon);
        for (Devoir d : devoirs) {
            Cours cours = d.getCours();
            if (cours == null || cours.getEtudiants() == null) continue;

            for (Etudiant e : cours.getEtudiants()) {
                String refKey = "DEADLINE:" + d.getId() + ":" + d.getDateEchéance();
                String msg = "Deadline proche: " + d.getTitle() + " (" + d.getDateEchéance() + ")";
                notificationService.createTypedNotification(e, Notification.Type.DEADLINE_PROCHE, refKey, msg);
            }
        }
    }
}
