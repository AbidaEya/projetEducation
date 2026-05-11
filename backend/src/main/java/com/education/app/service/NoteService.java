package com.education.app.service;

import com.education.app.dto.NoteAdminViewDTO;
import com.education.app.model.Enseignant;
import com.education.app.model.Inscription;
import com.education.app.model.Note;
import com.education.app.model.Etudiant;
import com.education.app.model.Matiere;
import com.education.app.repository.EtudiantRepository;
import com.education.app.repository.InscriptionRepository;
import com.education.app.repository.MatiereRepository;
import com.education.app.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private MatiereRepository matiereRepository;

    public Note createNote(Note note) {
        attachReferences(note);
        if (note.getDateNote() == null) {
            note.setDateNote(LocalDateTime.now());
        }
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<NoteAdminViewDTO> getAdminViewNotes() {
        List<Note> notes = noteRepository.findAll();

        return notes.stream()
                .map((n) -> {
                    Long classeId = null;
                    String classeNom = null;
                    Optional<Inscription> active = inscriptionRepository
                            .findTopByEtudiantAndStatusOrderByDateInscriptionDesc(n.getEtudiant(),
                                    Inscription.Status.ACTIVE);
                    if (active.isPresent() && active.get().getClasse() != null) {
                        classeId = active.get().getClasse().getId();
                        classeNom = active.get().getClasse().getName();
                    }

                    String etudiantNom = "";
                    if (n.getEtudiant() != null) {
                        String fn = n.getEtudiant().getFirstName();
                        String ln = n.getEtudiant().getLastName();
                        etudiantNom = String.format("%s %s", fn == null ? "" : fn, ln == null ? "" : ln).trim();
                    }

                    Long enseignantId = null;
                    String enseignantNom = null;
                    if (n.getMatiere() != null) {
                        Enseignant ens = n.getMatiere().getEnseignant();
                        if (ens != null) {
                            enseignantId = ens.getId();
                            String fn = ens.getFirstName();
                            String ln = ens.getLastName();
                            enseignantNom = String.format("%s %s", fn == null ? "" : fn, ln == null ? "" : ln).trim();
                        }
                    }

                    return new NoteAdminViewDTO(
                            n.getId(),
                            n.getValeur(),
                            n.getObservation(),
                            n.getDateNote(),
                            n.getCreatedAt(),
                            n.getUpdatedAt(),
                            n.getEtudiant() != null ? n.getEtudiant().getId() : null,
                            etudiantNom,
                            n.getEtudiant() != null ? n.getEtudiant().getEmail() : null,
                            n.getMatiere() != null ? n.getMatiere().getId() : null,
                            n.getMatiere() != null ? n.getMatiere().getNomMatiere() : null,
                            enseignantId,
                            enseignantNom,
                            classeId,
                            classeNom);
                })
                .sorted((a, b) -> {
                    String ca = a.getClasseNom() == null ? "" : a.getClasseNom();
                    String cb = b.getClasseNom() == null ? "" : b.getClasseNom();
                    int c = ca.compareToIgnoreCase(cb);
                    if (c != 0)
                        return c;
                    String ma = a.getMatiereNom() == null ? "" : a.getMatiereNom();
                    String mb = b.getMatiereNom() == null ? "" : b.getMatiereNom();
                    int m = ma.compareToIgnoreCase(mb);
                    if (m != 0)
                        return m;
                    String ea = a.getEtudiantNom() == null ? "" : a.getEtudiantNom();
                    String eb = b.getEtudiantNom() == null ? "" : b.getEtudiantNom();
                    return ea.compareToIgnoreCase(eb);
                })
                .collect(Collectors.toList());
    }

    public List<Note> getNotesByEtudiant(Etudiant etudiant) {
        return noteRepository.findByEtudiant(etudiant);
    }

    public List<Note> getNotesByMatiere(Matiere matiere) {
        return noteRepository.findByMatiere(matiere);
    }

    public Optional<Note> getNoteByEtudiantAndMatiere(Etudiant etudiant, Matiere matiere) {
        return noteRepository.findByEtudiantAndMatiere(etudiant, matiere);
    }

    public Note updateNote(Note note) {
        attachReferences(note);
        note.setUpdatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    private void attachReferences(Note note) {
        if (note == null)
            return;

        if (note.getEtudiant() != null && note.getEtudiant().getId() != null) {
            Etudiant etudiant = etudiantRepository.findById(note.getEtudiant().getId())
                    .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
            note.setEtudiant(etudiant);
        }

        if (note.getMatiere() != null && note.getMatiere().getId() != null) {
            Matiere matiere = matiereRepository.findById(note.getMatiere().getId())
                    .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
            note.setMatiere(matiere);
        }
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    public Double calculateMoyenne(Etudiant etudiant) {
        List<Note> notes = getNotesByEtudiant(etudiant);
        if (notes.isEmpty()) {
            return 0.0;
        }
        return notes.stream()
                .mapToDouble(Note::getValeur)
                .average()
                .orElse(0.0);
    }
}
