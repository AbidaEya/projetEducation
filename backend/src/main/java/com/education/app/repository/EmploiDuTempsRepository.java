package com.education.app.repository;

import com.education.app.model.EmploiDuTemps;
import com.education.app.model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Long> {
    List<EmploiDuTemps> findByCours(Cours cours);
}
