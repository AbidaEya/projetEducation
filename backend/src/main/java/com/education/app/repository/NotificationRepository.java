package com.education.app.repository;

import com.education.app.model.Notification;
import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);

    List<Notification> findByUserAndLu(User user, Boolean lu);

    List<Notification> findByUserAndStatutApprobation(User user, Notification.StatutApprobation statut);

    List<Notification> findByUserAndStatutApprobationAndLuOrderByDateNotificationDesc(User user,
            Notification.StatutApprobation statut, Boolean lu);

    List<Notification> findByStatutApprobation(Notification.StatutApprobation statut);

    List<Notification> findByCreatedBy(User createdBy);

    boolean existsByUserAndRefKey(User user, String refKey);

    List<Notification> findTop10ByUserOrderByDateNotificationDesc(User user);

    List<Notification> findTop20ByUserOrderByDateNotificationDesc(User user);

    List<Notification> findTop10ByUserAndStatutApprobationOrderByDateNotificationDesc(User user,
            Notification.StatutApprobation statut);

    List<Notification> findTop20ByUserAndStatutApprobationOrderByDateNotificationDesc(User user,
            Notification.StatutApprobation statut);

    List<Notification> findByUserAndStatutApprobationOrderByDateNotificationDesc(User user,
            Notification.StatutApprobation statut);
}
