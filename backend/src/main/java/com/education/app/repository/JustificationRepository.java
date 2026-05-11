package com.education.app.repository;

import com.education.app.model.Justification;
import com.education.app.model.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Long> {
    List<Justification> findByAbsence(Absence absence);
    List<Justification> findByStatut(Justification.Status statut);
}
