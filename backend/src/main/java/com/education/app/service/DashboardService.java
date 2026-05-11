package com.education.app.service;

import com.education.app.dto.dashboard.AbsencesByClasseDTO;
import com.education.app.dto.dashboard.DashboardPointDTO;
import com.education.app.dto.dashboard.SoumissionsBreakdownDTO;
import com.education.app.model.*;
import com.education.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final NoteRepository noteRepository;
    private final SoumissionRepository soumissionRepository;
    private final DevoirRepository devoirRepository;
    private final UserRepository userRepository;
    private final EtudiantRepository etudiantRepository;
    private final AbsenceRepository absenceRepository;
    private final InscriptionRepository inscriptionRepository;

    public DashboardService(
            NoteRepository noteRepository,
            SoumissionRepository soumissionRepository,
            DevoirRepository devoirRepository,
            UserRepository userRepository,
            EtudiantRepository etudiantRepository,
            AbsenceRepository absenceRepository,
            InscriptionRepository inscriptionRepository
    ) {
        this.noteRepository = noteRepository;
        this.soumissionRepository = soumissionRepository;
        this.devoirRepository = devoirRepository;
        this.userRepository = userRepository;
        this.etudiantRepository = etudiantRepository;
        this.absenceRepository = absenceRepository;
        this.inscriptionRepository = inscriptionRepository;
    }

    public List<DashboardPointDTO> notesEvolution(Long etudiantId) {
        if (etudiantId == null) return List.of();
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        List<Note> notes = new ArrayList<>(noteRepository.findByEtudiant(etudiant));
        notes.sort(Comparator.comparing(n -> Optional.ofNullable(n.getDateNote()).orElse(LocalDateTime.MIN)));

        // Group by month: YYYY-MM
        Map<String, List<Double>> byMonth = new LinkedHashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        for (Note n : notes) {
            LocalDateTime dt = n.getDateNote() != null ? n.getDateNote() : n.getCreatedAt();
            String key = dt.format(fmt);
            byMonth.computeIfAbsent(key, k -> new ArrayList<>()).add(n.getValeur());
        }

        List<DashboardPointDTO> out = new ArrayList<>();
        for (Map.Entry<String, List<Double>> e : byMonth.entrySet()) {
            double avg = e.getValue().stream().filter(Objects::nonNull).mapToDouble(Double::doubleValue).average().orElse(0.0);
            out.add(new DashboardPointDTO(e.getKey(), avg));
        }
        return out;
    }

    public SoumissionsBreakdownDTO soumissionsRepartition(Long etudiantId, Long enseignantId) {
        if (etudiantId != null) {
            User etudiant = userRepository.findById(etudiantId)
                    .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
            List<Soumission> list = soumissionRepository.findByEtudiant(etudiant);
            long corrigees = list.stream().filter(s -> Boolean.TRUE.equals(s.getIsEvaluated())).count();
            long enAttente = list.stream().filter(s -> !Boolean.TRUE.equals(s.getIsEvaluated())).count();
            return new SoumissionsBreakdownDTO(corrigees, enAttente);
        }

        if (enseignantId != null) {
            User enseignant = userRepository.findById(enseignantId)
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
            List<Devoir> devoirs = devoirRepository.findByEnseignant(enseignant);
            if (devoirs.isEmpty()) return new SoumissionsBreakdownDTO(0, 0);

            long corrigees = soumissionRepository.countByDevoirInAndIsEvaluatedTrue(devoirs);
            long enAttente = soumissionRepository.countByDevoirInAndIsEvaluatedFalse(devoirs);
            return new SoumissionsBreakdownDTO(corrigees, enAttente);
        }

        long corrigees = soumissionRepository.countByIsEvaluatedTrue();
        long enAttente = soumissionRepository.countByIsEvaluatedFalse();
        return new SoumissionsBreakdownDTO(corrigees, enAttente);
    }

    public List<AbsencesByClasseDTO> absencesParClasse(Long enseignantId) {
        // Compute by mapping each absence's student to their ACTIVE inscription/class.
        List<Absence> absences = absenceRepository.findAll();
        Map<Long, String> classeNameById = new HashMap<>();
        Map<Long, Long> countsByClasseId = new HashMap<>();

        for (Absence a : absences) {
            if (a.getEtudiant() == null) continue;

            List<Inscription> inscriptions = inscriptionRepository.findByEtudiant(a.getEtudiant());
            if (inscriptions == null || inscriptions.isEmpty()) continue;

            // Pick latest ACTIVE inscription; fallback to latest by date
            inscriptions.sort(Comparator.comparing(Inscription::getDateInscription, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
            Inscription picked = inscriptions.stream()
                    .filter(i -> i.getStatus() == Inscription.Status.ACTIVE)
                    .findFirst()
                    .orElse(inscriptions.get(0));

            Classe classe = picked.getClasse();
            if (classe == null) continue;

            if (enseignantId != null) {
                Long classeEnseignantId = classe.getEnseignant() != null ? classe.getEnseignant().getId() : null;
                if (classeEnseignantId == null || !classeEnseignantId.equals(enseignantId)) continue;
            }

            classeNameById.putIfAbsent(classe.getId(), classe.getName());
            countsByClasseId.put(classe.getId(), countsByClasseId.getOrDefault(classe.getId(), 0L) + 1L);
        }

        List<AbsencesByClasseDTO> out = new ArrayList<>();
        for (Map.Entry<Long, Long> e : countsByClasseId.entrySet()) {
            String name = classeNameById.getOrDefault(e.getKey(), "Classe " + e.getKey());
            out.add(new AbsencesByClasseDTO(name, e.getValue()));
        }
        out.sort(Comparator.comparingLong(AbsencesByClasseDTO::getAbsences).reversed());
        return out;
    }
}
