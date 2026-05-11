import { useState, useEffect, useCallback, useMemo } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, StatCard, Btn, Modal, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Textarea,
} from '../../components/ui-components';

interface Note { id: number; valeur: number; observation?: string | null; dateNote?: string | null; etudiant?: { id: number } | null; matiere?: { id: number; nomMatiere?: string | null; nom?: string | null } | null; }

export default function EtudiantNotes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [reclamNote, setReclamNote] = useState<Note | null>(null);
    const [motif, setMotif] = useState('');
    const [urgent, setUrgent] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const data = await apiGet<Note[]>('/notes/all'); const all = Array.isArray(data) ? data : []; setNotes(all.filter(n => n.etudiant?.id === user.id)); }
        catch { setNotes([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const moyenne = useMemo(() => notes.length === 0 ? 0 : notes.reduce((s, n) => s + n.valeur, 0) / notes.length, [notes]);

    const handleReclam = async () => {
        if (!reclamNote || !user || !motif) return;
        try { await apiPost('/reclamation-notes/etudiant/request', { noteId: reclamNote.id, etudiantId: user.id, motif, urgent }); setMsg({ type: 'success', text: 'Réclamation envoyée au professeur (visible par l\'admin)' }); setReclamNote(null); setMotif(''); setUrgent(false); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    if (loading) return <LoadingState message="Chargement des notes…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Notes" icon={GraduationCap} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard icon={GraduationCap} label="Total" value={notes.length} color="blue" />
                <StatCard icon={GraduationCap} label="Moyenne" value={`${moyenne.toFixed(2)}/20`} color={moyenne >= 10 ? 'emerald' : 'rose'} />
            </div>

            <Card padding={false}>
                {notes.length === 0 ? <EmptyState icon={GraduationCap} title="Aucune note" /> : (
                    <Table><Thead><tr><Th>Matière</Th><Th>Note</Th><Th>Observation</Th><Th>Date</Th><Th className="text-right">Action</Th></tr></Thead>
                        <Tbody>{notes.map(n => (
                            <Tr key={n.id}>
                                <Td className="font-medium">{n.matiere?.nomMatiere || n.matiere?.nom || '—'}</Td>
                                <Td><span className={`font-bold text-lg ${n.valeur >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{n.valeur}/20</span></Td>
                                <Td className="text-muted-foreground">{n.observation || '—'}</Td>
                                <Td className="text-muted-foreground">{n.dateNote ? new Date(n.dateNote).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td className="text-right"><Btn size="sm" variant="secondary" onClick={() => { setReclamNote(n); setMotif(''); setUrgent(false); }}>Double correction</Btn></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
            </Card>

            {reclamNote && (
                <Modal open onClose={() => setReclamNote(null)} title="Demander double correction" footer={<><Btn variant="ghost" onClick={() => setReclamNote(null)}>Annuler</Btn><Btn onClick={handleReclam} disabled={!motif}>Envoyer</Btn></>}>
                    <div className="p-3 bg-muted/30 rounded-lg text-sm mb-4">
                        <p><span className="text-muted-foreground">Matière:</span> <span className="font-medium text-foreground">{reclamNote.matiere?.nomMatiere || reclamNote.matiere?.nom || '—'}</span></p>
                        <p><span className="text-muted-foreground">Note actuelle:</span> <span className="font-bold text-foreground">{reclamNote.valeur}/20</span></p>
                    </div>
                    <FormField label="Motif" required><Textarea value={motif} onChange={e => setMotif(e.target.value)} rows={3} placeholder="Expliquez pourquoi…" /></FormField>
                    <label className="flex items-center gap-2 mt-3"><input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="accent-primary" /><span className="text-sm text-foreground">Urgent</span></label>
                </Modal>
            )}
        </div>
    );
}
