import { useState, useEffect, useCallback } from 'react';
import { FileText, Check, X as XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, Pagination, FormField, Textarea, Input,
} from '../../components/ui-components';

interface ReclamationNote {
    id: number;
    etudiantId: number;
    ancienneValeur: number;
    valeurProposee?: number | null;
    motif: string;
    urgent?: boolean;
    statut: string;
    commentaireProf?: string | null;
    createdAt?: string;
    etudiantNom?: string;
    matiereNom?: string;
    classeNom?: string;
}

export default function EnseignantReclamationsNotes() {
    const { user } = useAuth();
    const [reclamations, setReclamations] = useState<ReclamationNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [reviewing, setReviewing] = useState<ReclamationNote | null>(null);
    const [valeurFinale, setValeurFinale] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const PS = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (!user) {
                setReclamations([]);
                return;
            }
            const d = await apiGet<ReclamationNote[]>(`/reclamation-notes/enseignant/${user.id}/pending`);
            setReclamations(Array.isArray(d) ? d : []);
        }
        catch { setReclamations([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleReview = async (decision: 'ACCEPTER' | 'REFUSER') => {
        if (!reviewing || !user) return;
        try {
            await apiPut(`/reclamation-notes/${reviewing.id}/review`, {
                enseignantId: user.id,
                decision,
                commentaireProf: comment || undefined,
                valeurFinale: decision === 'ACCEPTER' ? valeurFinale : undefined,
            });
            setMsg({ type: 'success', text: decision === 'ACCEPTER' ? 'Réclamation acceptée' : 'Réclamation refusée' }); setReviewing(null); setComment(''); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const filtered = reclamations.filter(r => !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Réclamations de Notes" icon={FileText} badge={reclamations.length > 0 ? { label: `${reclamations.length}`, variant: 'warning' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={fetchData} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={FileText} title="Aucune réclamation en attente" /> : (
                    <Table><Thead><tr><Th>Classe</Th><Th>Matière</Th><Th>Étudiant</Th><Th>Ancienne</Th><Th>Proposée</Th><Th>Motif</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(r => (
                            <Tr key={r.id}>
                                <Td className="text-muted-foreground">{r.classeNom || '—'}</Td>
                                <Td className="font-medium">{r.matiereNom || '—'}</Td>
                                <Td className="text-muted-foreground">{r.etudiantNom || `#${r.etudiantId}`}</Td>
                                <Td><span className="font-bold text-red-600">{r.ancienneValeur}/20</span></Td>
                                <Td><span className="font-bold text-emerald-600">{r.valeurProposee != null ? `${r.valeurProposee}/20` : '—'}</span></Td>
                                <Td className="text-muted-foreground max-w-[150px] truncate">{r.motif}</Td>
                                <Td className="text-muted-foreground text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td className="text-right"><Btn size="sm" onClick={() => { setReviewing(r); setComment(''); setValeurFinale(r.valeurProposee ?? r.ancienneValeur); }}>Examiner</Btn></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {reviewing && (
                <Modal open onClose={() => setReviewing(null)} title="Examiner la réclamation" size="lg" footer={<div className="flex gap-2"><Btn variant="ghost" onClick={() => setReviewing(null)}>Annuler</Btn><Btn variant="danger" icon={XIcon} onClick={() => handleReview('REFUSER')}>Refuser</Btn><Btn variant="success" icon={Check} onClick={() => handleReview('ACCEPTER')}>Accepter</Btn></div>}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[['Classe', reviewing.classeNom || '—'], ['Matière', reviewing.matiereNom || '—'], ['Étudiant', reviewing.etudiantNom || '—'], ['Date', reviewing.createdAt ? new Date(reviewing.createdAt).toLocaleDateString('fr-FR') : '—']].map(([l, v], i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">{l}</p><p className="text-sm font-medium text-foreground">{v}</p></div>
                        ))}
                        <div className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Ancienne note</p><p className="text-sm font-bold text-red-600">{reviewing.ancienneValeur}/20</p></div>
                        <div className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Note proposée</p><p className="text-sm font-bold text-emerald-600">{reviewing.valeurProposee != null ? `${reviewing.valeurProposee}/20` : 'Aucune'}</p></div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg mt-3"><p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Motif</p><p className="text-sm text-foreground">{reviewing.motif}</p></div>
                    <FormField label="Note finale décidée par le professeur" className="mt-4"><Input type="number" min={0} max={20} step="0.25" value={valeurFinale} onChange={e => setValeurFinale(Number(e.target.value))} /></FormField>
                    <FormField label="Commentaire (optionnel)" className="mt-4"><Textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Votre commentaire…" /></FormField>
                </Modal>
            )}
        </div>
    );
}
