import { useState, useEffect } from 'react';
import { Award, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPut, apiDelete, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Tabs, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, Pagination, FormField, Input, Textarea, ConfirmDialog,
} from '../../components/ui-components';

interface Note { id: number; valeur: number; observation?: string; type?: string; dateNote?: string; etudiant?: { id: number; firstName: string; lastName: string }; matiere?: { id: number; nomMatiere: string }; cours?: { id: number; nomCours: string }; enseignant?: { firstName: string; lastName: string }; }
interface ReclamationNote {
    id: number;
    motif: string;
    urgent: boolean;
    statut?: 'EN_ATTENTE_ADMIN' | 'EN_ATTENTE_PROF' | 'ACCEPTEE' | 'REFUSEE' | string;
    valeurProposee?: number | null;
    ancienneValeur?: number;
    etudiantNom?: string;
    matiereNom?: string;
    classeNom?: string;
    commentaireProf?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export default function AdminNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [reclamations, setReclamations] = useState<ReclamationNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [tab, setTab] = useState('notes');
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editForm, setEditForm] = useState({ valeur: 0, observation: '' });
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [delConfirm, setDelConfirm] = useState<number | null>(null);
    const PS = 10;

    const load = async () => {
        setLoading(true);
        try {
            const [n, r] = await Promise.all([apiGet<Note[]>('/notes/admin-view').catch(() => []), apiGet<ReclamationNote[]>('/reclamation-notes/all').catch(() => [])]);
            setNotes(Array.isArray(n) ? n : []); setReclamations(Array.isArray(r) ? r : []);
        } catch { } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleEditNote = async () => {
        if (!editingNote) return;
        try { await apiPut(`/notes/${editingNote.id}`, editForm); setMsg({ type: 'success', text: 'Note modifiée' }); setEditingNote(null); load(); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const handleDeleteNote = async () => {
        if (!delConfirm) return;
        try { await apiDelete(`/notes/${delConfirm}`); setMsg({ type: 'success', text: 'Note supprimée' }); setDelConfirm(null); load(); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const items = tab === 'notes' ? notes : reclamations;
    const filtered = items.filter(i => !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Notes & Réclamations" icon={Award} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Tabs tabs={[{ id: 'notes', label: 'Notes', count: notes.length }, { id: 'reclamations', label: 'Réclamations', count: reclamations.length }]} active={tab} onChange={t => { setTab(t); setPage(0); }} />

            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} /></div>
                {tab === 'notes' ? (
                    pd.length === 0 ? <EmptyState icon={Award} title="Aucune note" /> : (
                        <Table><Thead><tr><Th>Matière</Th><Th>Étudiant</Th><Th>Professeur</Th><Th>Note</Th><Th>Observation</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                            <Tbody>{(pd as Note[]).map(n => (
                                <Tr key={n.id}>
                                    <Td>{n.matiere?.nomMatiere || n.cours?.nomCours || '—'}</Td>
                                    <Td className="text-muted-foreground">{n.etudiant ? `${n.etudiant.firstName} ${n.etudiant.lastName}` : '—'}</Td>
                                    <Td className="text-muted-foreground">{n.enseignant ? `${n.enseignant.firstName} ${n.enseignant.lastName}` : '—'}</Td>
                                    <Td><span className={`font-bold ${n.valeur >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{n.valeur}/20</span></Td>
                                    <Td className="text-muted-foreground max-w-[150px] truncate">{n.observation || '—'}</Td>
                                    <Td className="text-muted-foreground">{n.dateNote ? new Date(n.dateNote).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td className="text-right"><div className="flex items-center justify-end gap-1">
                                        <button onClick={() => { setEditingNote(n); setEditForm({ valeur: n.valeur, observation: n.observation || '' }); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => setDelConfirm(n.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div></Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    )
                ) : (
                    pd.length === 0 ? <EmptyState icon={Award} title="Aucune réclamation" /> : (
                        <Table><Thead><tr><Th>Étudiant</Th><Th>Classe</Th><Th>Matière</Th><Th>Ancienne</Th><Th>Décision prof</Th><Th>Statut</Th><Th>Motif</Th><Th>Urgent</Th></tr></Thead>
                            <Tbody>{(pd as ReclamationNote[]).map(r => (
                                <Tr key={r.id}>
                                    <Td>{r.etudiantNom || '—'}</Td>
                                    <Td className="text-muted-foreground">{r.classeNom || '—'}</Td>
                                    <Td className="text-muted-foreground">{r.matiereNom || '—'}</Td>
                                    <Td><span className="font-bold text-red-600">{r.ancienneValeur ?? '—'}/20</span></Td>
                                    <Td><span className="font-bold text-emerald-600">{r.valeurProposee != null ? `${r.valeurProposee}/20` : '—'}</span></Td>
                                    <Td>
                                        {r.statut === 'ACCEPTEE' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">Acceptée</span>}
                                        {r.statut === 'REFUSEE' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20">Refusée</span>}
                                        {r.statut === 'EN_ATTENTE_PROF' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">En attente prof</span>}
                                        {r.statut === 'EN_ATTENTE_ADMIN' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">En attente admin</span>}
                                        {!r.statut && '—'}
                                    </Td>
                                    <Td className="text-muted-foreground max-w-[200px] truncate">{r.motif}</Td>
                                    <Td>{r.urgent ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20">Urgent</span> : '—'}</Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    )
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {editingNote && (
                <Modal open onClose={() => setEditingNote(null)} title="Modifier la note" footer={<><Btn variant="ghost" onClick={() => setEditingNote(null)}>Annuler</Btn><Btn onClick={handleEditNote}>Enregistrer</Btn></>}>
                    <div className="space-y-4">
                        <FormField label="Note /20"><Input type="number" min={0} max={20} value={editForm.valeur} onChange={e => setEditForm(p => ({ ...p, valeur: Number(e.target.value) }))} /></FormField>
                        <FormField label="Observation"><Textarea value={editForm.observation} onChange={e => setEditForm(p => ({ ...p, observation: e.target.value }))} rows={3} /></FormField>
                    </div>
                </Modal>
            )}
            <ConfirmDialog open={!!delConfirm} title="Supprimer la note ?" message="Cette action est irréversible." variant="danger" confirmLabel="Supprimer" onConfirm={handleDeleteNote} onCancel={() => setDelConfirm(null)} />
        </div>
    );
}
