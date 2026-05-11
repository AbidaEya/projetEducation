package com.education.app.service;

import com.education.app.dto.ReclamationNoteCreateRequest;
import com.education.app.dto.ReclamationNoteDTO;
import com.education.app.dto.ReclamationNoteForwardRequest;
import com.education.app.dto.ReclamationNoteReviewRequest;
import com.education.app.dto.ReclamationNoteStudentRequest;
import com.education.app.model.*;
import com.education.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReclamationNoteService {

    private final ReclamationNoteRepository reclamationNoteRepository;
    private final NoteRepository noteRepository;
    private final AdminRepository adminRepository;
    private final EnseignantRepository enseignantRepository;
    private final InscriptionRepository inscriptionRepository;
    private final EtudiantRepository etudiantRepository;

    public ReclamationNoteService(
            ReclamationNoteRepository reclamationNoteRepository,
            NoteRepository noteRepository,
            AdminRepository adminRepository,
            EnseignantRepository enseignantRepository,
            InscriptionRepository inscriptionRepository,
            EtudiantRepository etudiantRepository) {
        this.reclamationNoteRepository = reclamationNoteRepository;
        this.noteRepository = noteRepository;
        this.adminRepository = adminRepository;
        this.enseignantRepository = enseignantRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.etudiantRepository = etudiantRepository;
    }

    public ReclamationNoteDTO create(ReclamationNoteCreateRequest req) {
        if (req == null)
            throw new RuntimeException("Payload manquant");
        if (req.getNoteId() == null)
            throw new RuntimeException("noteId requis");
        if (req.getAdminId() == null)
            throw new RuntimeException("adminId requis");
        if (req.getValeurProposee() == null)
            throw new RuntimeException("valeurProposee requise");
        if (req.getMotif() == null || req.getMotif().trim().isEmpty())
            throw new RuntimeException("motif requis");

        Note note = noteRepository.findById(req.getNoteId())
                .orElseThrow(() -> new RuntimeException("Note introuvable"));

        Matiere matiere = note.getMatiere();
        if (matiere == null || matiere.getEnseignant() == null) {
            throw new RuntimeException("Impossible de déterminer l'enseignant de la matière");
        }

        Enseignant enseignant = enseignantRepository.findById(matiere.getEnseignant().getId())
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        Admin admin = adminRepository.findById(req.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        if (note.getEtudiant() == null) {
            throw new RuntimeException("Impossible de déterminer l'étudiant de la note");
        }
        Etudiant etudiant = etudiantRepository.findById(note.getEtudiant().getId())
                .orElseThrow(() -> new RuntimeException("Etudiant introuvable"));

        ReclamationNote r = new ReclamationNote();
        r.setNote(note);
        r.setEtudiant(etudiant);
        r.setEnseignant(enseignant);
        r.setAdmin(admin);
        r.setMotif(req.getMotif().trim());
        r.setUrgent(Boolean.TRUE.equals(req.getUrgent()));
        r.setStatut(ReclamationNote.Status.EN_ATTENTE_PROF);
        r.setAncienneValeur(note.getValeur());
        r.setValeurProposee(req.getValeurProposee());

        ReclamationNote saved = reclamationNoteRepository.save(r);
        return toDto(saved);
    }

    public ReclamationNoteDTO requestByEtudiant(ReclamationNoteStudentRequest req) {
        if (req == null)
            throw new RuntimeException("Payload manquant");
        if (req.getNoteId() == null)
            throw new RuntimeException("noteId requis");
        if (req.getEtudiantId() == null)
            throw new RuntimeException("etudiantId requis");
        if (req.getMotif() == null || req.getMotif().trim().isEmpty())
            throw new RuntimeException("motif requis");

        Note note = noteRepository.findById(req.getNoteId())
                .orElseThrow(() -> new RuntimeException("Note introuvable"));

        if (note.getEtudiant() == null || note.getEtudiant().getId() == null
                || !note.getEtudiant().getId().equals(req.getEtudiantId())) {
            throw new RuntimeException("Accès refusé: cette note n'appartient pas à cet étudiant");
        }

        Matiere matiere = note.getMatiere();
        if (matiere == null || matiere.getEnseignant() == null) {
            throw new RuntimeException("Impossible de déterminer l'enseignant de la matière");
        }

        Enseignant enseignant = enseignantRepository.findById(matiere.getEnseignant().getId())
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        Etudiant etudiant = etudiantRepository.findById(req.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Etudiant introuvable"));

        ReclamationNote r = new ReclamationNote();
        r.setNote(note);
        r.setEtudiant(etudiant);
        r.setEnseignant(enseignant);
        r.setAdmin(null);
        r.setMotif(req.getMotif().trim());
        r.setUrgent(Boolean.TRUE.equals(req.getUrgent()));
        r.setStatut(ReclamationNote.Status.EN_ATTENTE_PROF);
        r.setAncienneValeur(note.getValeur());
        r.setValeurProposee(null);

        ReclamationNote saved = reclamationNoteRepository.save(r);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ReclamationNoteDTO> listAll() {
        return reclamationNoteRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReclamationNoteDTO> listPendingForAdmin() {
        return reclamationNoteRepository.findByStatut(ReclamationNote.Status.EN_ATTENTE_ADMIN)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReclamationNoteDTO> listPendingForEnseignant(Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));
        return reclamationNoteRepository
                .findByEnseignantAndStatut(enseignant, ReclamationNote.Status.EN_ATTENTE_PROF)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReclamationNoteDTO> listForAdmin(Long adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));
        return reclamationNoteRepository.findByAdmin(admin).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ReclamationNoteDTO review(Long reclamationId, ReclamationNoteReviewRequest req) {
        ReclamationNote r = reclamationNoteRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        if (r.getStatut() != ReclamationNote.Status.EN_ATTENTE_PROF) {
            throw new RuntimeException("Réclamation déjà traitée");
        }

        if (req == null || req.getEnseignantId() == null) {
            throw new RuntimeException("enseignantId requis");
        }

        if (r.getEnseignant() == null || !r.getEnseignant().getId().equals(req.getEnseignantId())) {
            throw new RuntimeException("Accès refusé: cette réclamation n'appartient pas à cet enseignant");
        }

        String decision = req.getDecision() == null ? "" : req.getDecision().trim().toUpperCase();
        if (!decision.equals("ACCEPTER") && !decision.equals("REFUSER")) {
            throw new RuntimeException("decision doit être ACCEPTER ou REFUSER");
        }

        r.setCommentaireProf(req.getCommentaireProf());
        r.setResolvedAt(LocalDateTime.now());

        if (decision.equals("ACCEPTER")) {
            Double valeurFinale = req.getValeurFinale() != null ? req.getValeurFinale() : r.getValeurProposee();
            if (valeurFinale == null) {
                throw new RuntimeException("valeurFinale manquante");
            }
            r.setStatut(ReclamationNote.Status.ACCEPTEE);
            r.setValeurProposee(valeurFinale);
            Note note = r.getNote();
            if (note != null) {
                note.setValeur(valeurFinale);
                note.setUpdatedAt(LocalDateTime.now());
                noteRepository.save(note);
            }
        } else {
            r.setStatut(ReclamationNote.Status.REFUSEE);
        }

        ReclamationNote saved = reclamationNoteRepository.save(r);
        return toDto(saved);
    }

    public ReclamationNoteDTO forwardToEnseignant(Long reclamationId, ReclamationNoteForwardRequest req) {
        ReclamationNote r = reclamationNoteRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        if (r.getStatut() != ReclamationNote.Status.EN_ATTENTE_ADMIN) {
            throw new RuntimeException("Cette réclamation n'est pas en attente admin");
        }

        if (req == null || req.getAdminId() == null) {
            throw new RuntimeException("adminId requis");
        }
        if (req.getValeurProposee() == null) {
            throw new RuntimeException("valeurProposee requise");
        }

        Admin admin = adminRepository.findById(req.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        r.setAdmin(admin);
        r.setValeurProposee(req.getValeurProposee());
        r.setStatut(ReclamationNote.Status.EN_ATTENTE_PROF);

        ReclamationNote saved = reclamationNoteRepository.save(r);
        return toDto(saved);
    }

    private ReclamationNoteDTO toDto(ReclamationNote r) {
        ReclamationNoteDTO dto = new ReclamationNoteDTO();
        dto.setId(r.getId());
        dto.setNoteId(r.getNote() != null ? r.getNote().getId() : null);
        dto.setEtudiantId(r.getEtudiant() != null ? r.getEtudiant().getId() : null);
        dto.setAncienneValeur(r.getAncienneValeur());
        dto.setValeurProposee(r.getValeurProposee());
        dto.setMotif(r.getMotif());
        dto.setUrgent(r.getUrgent());
        dto.setStatut(r.getStatut());
        dto.setAdminId(r.getAdmin() != null ? r.getAdmin().getId() : null);
        dto.setEnseignantId(r.getEnseignant() != null ? r.getEnseignant().getId() : null);
        dto.setCommentaireProf(r.getCommentaireProf());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        dto.setResolvedAt(r.getResolvedAt());

        if (r.getEtudiant() != null) {
            String fn = r.getEtudiant().getFirstName();
            String ln = r.getEtudiant().getLastName();
            dto.setEtudiantNom(String.format("%s %s", fn == null ? "" : fn, ln == null ? "" : ln).trim());

            Optional<Inscription> active = inscriptionRepository
                    .findTopByEtudiantAndStatusOrderByDateInscriptionDesc(r.getEtudiant(),
                            Inscription.Status.ACTIVE);
            if (active.isPresent() && active.get().getClasse() != null) {
                dto.setClasseNom(active.get().getClasse().getName());
            }
        }

        if (r.getNote() != null && r.getNote().getMatiere() != null) {
            dto.setMatiereNom(r.getNote().getMatiere().getNomMatiere());
        }

        return dto;
    }
}
