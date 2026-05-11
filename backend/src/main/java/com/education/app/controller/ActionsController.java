package com.education.app.controller;

import com.education.app.dto.DevoirDTO;
import com.education.app.dto.actions.AddSeanceRequest;
import com.education.app.dto.actions.MarkAbsenceRequest;
import com.education.app.dto.actions.SendAnnonceRequest;
import com.education.app.model.Absence;
import com.education.app.model.EmploiDuTemps;
import com.education.app.service.ActionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActionsController {

    private final ActionsService actionsService;

    public ActionsController(ActionsService actionsService) {
        this.actionsService = actionsService;
    }

    // ✅ Créer devoir
    @PostMapping("/creer-devoir")
    public ResponseEntity<DevoirDTO> creerDevoir(@RequestBody DevoirDTO dto) {
        return ResponseEntity.ok(actionsService.creerDevoir(dto));
    }

    // ✅ Ajouter séance
    @PostMapping("/ajouter-seance")
    public ResponseEntity<EmploiDuTemps> ajouterSeance(@RequestBody AddSeanceRequest req) {
        return ResponseEntity.ok(actionsService.ajouterSeance(req));
    }

    // ✅ Marquer absences
    @PostMapping("/marquer-absence")
    public ResponseEntity<Absence> marquerAbsence(@RequestBody MarkAbsenceRequest req) {
        return ResponseEntity.ok(actionsService.marquerAbsence(req));
    }

    // ✅ Envoyer annonce (stored as notifications)
    @PostMapping("/envoyer-annonce")
    public ResponseEntity<Integer> envoyerAnnonce(@RequestBody SendAnnonceRequest req) {
        return ResponseEntity.ok(actionsService.envoyerAnnonce(req));
    }
}
