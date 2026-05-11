package com.education.app.controller;

import com.education.app.dto.dashboard.AbsencesByClasseDTO;
import com.education.app.dto.dashboard.DashboardPointDTO;
import com.education.app.dto.dashboard.SoumissionsBreakdownDTO;
import com.education.app.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // 📈 Évolution des notes (line)
    @GetMapping("/notes-evolution")
    public ResponseEntity<List<DashboardPointDTO>> notesEvolution(@RequestParam("etudiantId") Long etudiantId) {
        return ResponseEntity.ok(dashboardService.notesEvolution(etudiantId));
    }

    // 🥧 Répartition des soumissions (corrigées / en attente)
    // Provide either etudiantId OR enseignantId; if none, returns global
    @GetMapping("/soumissions-repartition")
    public ResponseEntity<SoumissionsBreakdownDTO> soumissionsRepartition(
            @RequestParam(name = "etudiantId", required = false) Long etudiantId,
            @RequestParam(name = "enseignantId", required = false) Long enseignantId
    ) {
        return ResponseEntity.ok(dashboardService.soumissionsRepartition(etudiantId, enseignantId));
    }

    // 📊 Absences par classe
    @GetMapping("/absences-par-classe")
    public ResponseEntity<List<AbsencesByClasseDTO>> absencesParClasse(
            @RequestParam(name = "enseignantId", required = false) Long enseignantId
    ) {
        return ResponseEntity.ok(dashboardService.absencesParClasse(enseignantId));
    }
}
