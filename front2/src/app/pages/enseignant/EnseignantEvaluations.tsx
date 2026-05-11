import { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, Download, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, Pagination, FormField, Input, Textarea,
} from '../../components/ui-components';

interface Soumission { id: number; etudiantId: number; devoirId: number; contenu?: string; fichierPath?: string; dateSoumission?: string; note?: number; feedback?: string; evaluated?: boolean; }
interface Etudiant { id: number; firstName: string; lastName: string; }
interface Devoir { id: number; titre: string; coursId?: number; }
interface Cours { id: number; nomCours: string; }

export default function EnseignantEvaluations() {
    const { user } = useAuth();
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [etudiants, setEtudiants] = useState<Map<number, Etudiant>>(new Map());
    const [devoirs, setDevoirs] = useState<Map<number, Devoir>>(new Map());
    const [coursMap, setCoursMap] = useState<Map<number, Cours>>(new Map());
    const [loading, setLoading] = useState(false);
    const [evaluating, setEvaluating] = useState<Soumission | null>(null);
    const [noteVal, setNoteVal] = useState('');
    const [feedbackVal, setFeedbackVal] = useState('');
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const PS = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [s, e, d, c] = await Promise.all([apiGet<Soumission[]>('/soumissions/all').catch(() => []), apiGet<Etudiant[]>('/etudiants').catch(() => []), apiGet<Devoir[]>('/devoirs').catch(() => []), apiGet<Cours[]>('/cours').catch(() => [])]);
            setSoumissions(Array.isArray(s) ? s : []);
            const em = new Map<number, Etudiant>(); (Array.isArray(e) ? e : []).forEach(et => em.set(et.id, et)); setEtudiants(em);
            const dm = new Map<number, Devoir>(); (Array.isArray(d) ? d : []).forEach(dv => dm.set(dv.id, dv)); setDevoirs(dm);
            const cm = new Map<number, Cours>(); (Array.isArray(c) ? c : []).forEach(cr => cm.set(cr.id, cr)); setCoursMap(cm);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getName = (id: number) => { const e = etudiants.get(id); return e ? `${e.firstName} ${e.lastName}` : `#${id}`; };
    const getDevoir = (id: number) => devoirs.get(id)?.titre || `#${id}`;
    const getMatiere = (did: number) => { const d = devoirs.get(did); if (!d?.coursId) return '—'; return coursMap.get(d.coursId)?.nomCours || '—'; };

    const pending = soumissions.filter(s => !s.evaluated);
    const evaluated = soumissions.filter(s => s.evaluated);

    const handleEvaluate = async () => {
        if (!evaluating) return;
        const note = parseFloat(noteVal);
        if (isNaN(note) || note < 0 || note > 20) { setMsg({ type: 'error', text: 'Note entre 0 et 20' }); return; }
        try {
            await apiPost(`/soumissions/${evaluating.id}/evaluate`, { note, feedback: feedbackVal });
            setMsg({ type: 'success', text: 'Évaluation enregistrée' }); setEvaluating(null); setNoteVal(''); setFeedbackVal(''); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const noteSuggestions = [20, 18, 16, 14, 12, 10, 8, 5, 0];
    const feedbackSuggestions = ['Excellent travail !', 'Très bon travail', 'Bon travail', 'Travail moyen', 'Insuffisant', 'Non rendu'];

    const filteredPending = pending.filter(s => !search || getName(s.etudiantId).toLowerCase().includes(search.toLowerCase()) || getDevoir(s.devoirId).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filteredPending.length / PS), pd = filteredPending.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des évaluations…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Évaluations" icon={ClipboardCheck} badge={pending.length > 0 ? { label: `${pending.length} en attente`, variant: 'warning' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            {/* Evaluate Modal */}
            {evaluating && (
                <Modal open onClose={() => { setEvaluating(null); setNoteVal(''); setFeedbackVal(''); }} title="Évaluer la soumission" size="lg" footer={<><Btn variant="ghost" onClick={() => { setEvaluating(null); setNoteVal(''); setFeedbackVal(''); }}>Annuler</Btn><Btn onClick={handleEvaluate}>Valider</Btn></>}>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        {[['Étudiant', getName(evaluating.etudiantId)], ['Matière', getMatiere(evaluating.devoirId)], ['Devoir', getDevoir(evaluating.devoirId)], ['Date', evaluating.dateSoumission ? new Date(evaluating.dateSoumission).toLocaleDateString('fr-FR') : '—']].map(([l, v], i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">{l}</p><p className="text-sm font-medium text-foreground">{v}</p></div>
                        ))}
                    </div>
                    {evaluating.fichierPath && <a href={`/api/files/download?path=${encodeURIComponent(evaluating.fichierPath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-sm mb-4"><Download className="w-4 h-4" />Télécharger le fichier</a>}
                    {evaluating.contenu && <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground mb-4">{evaluating.contenu}</div>}
                    <FormField label="Note (0-20)" required>
                        <Input type="number" min={0} max={20} step={0.5} value={noteVal} onChange={e => setNoteVal(e.target.value)} />
                        <div className="flex gap-1.5 mt-2 flex-wrap">{noteSuggestions.map(n => <button key={n} onClick={() => setNoteVal(String(n))} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${noteVal === String(n) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}>{n}</button>)}</div>
                    </FormField>
                    <FormField label="Feedback" className="mt-4">
                        <Textarea value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} rows={3} />
                        <div className="flex gap-1.5 mt-2 flex-wrap">{feedbackSuggestions.map(f => <button key={f} onClick={() => setFeedbackVal(f)} className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground hover:bg-muted">{f}</button>)}</div>
                    </FormField>
                </Modal>
            )}

            {/* Pending */}
            <Card padding={false}>
                <div className="p-4 pb-0 flex items-center justify-between"><h3 className="font-semibold text-foreground">En attente ({pending.length})</h3></div>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={fetchData} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={ClipboardCheck} title="Aucune évaluation en attente" /> : (
                    <Table><Thead><tr><Th>Étudiant</Th><Th>Matière</Th><Th>Devoir</Th><Th>Fichier</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(s => (
                            <Tr key={s.id}>
                                <Td className="font-medium">{getName(s.etudiantId)}</Td>
                                <Td className="text-muted-foreground">{getMatiere(s.devoirId)}</Td>
                                <Td className="text-muted-foreground">{getDevoir(s.devoirId)}</Td>
                                <Td>{s.fichierPath ? <a href={`/api/files/download?path=${encodeURIComponent(s.fichierPath)}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1"><Download className="w-3 h-3" />Ouvrir</a> : '—'}</Td>
                                <Td className="text-muted-foreground">{s.dateSoumission ? new Date(s.dateSoumission).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td className="text-right"><Btn size="sm" onClick={() => { setEvaluating(s); setNoteVal(''); setFeedbackVal(''); }}>Évaluer</Btn></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filteredPending.length} pageSize={PS} /></div>
            </Card>

            {/* History */}
            <Card>
                <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 font-semibold text-foreground w-full">
                    Évaluations effectuées ({evaluated.length}) {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showHistory && (
                    <div className="mt-4 -mx-5 -mb-5">
                        <Table><Thead><tr><Th>Étudiant</Th><Th>Matière</Th><Th>Devoir</Th><Th>Note</Th><Th>Feedback</Th><Th>Date</Th></tr></Thead>
                            <Tbody>{evaluated.length === 0 ? <Tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucune évaluation</td></Tr> :
                                evaluated.map(s => (
                                    <Tr key={s.id}>
                                        <Td className="font-medium">{getName(s.etudiantId)}</Td>
                                        <Td className="text-muted-foreground">{getMatiere(s.devoirId)}</Td>
                                        <Td className="text-muted-foreground">{getDevoir(s.devoirId)}</Td>
                                        <Td><span className={`font-bold ${(s.note ?? 0) >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{s.note ?? '—'}/20</span></Td>
                                        <Td className="text-muted-foreground max-w-[200px] truncate">{s.feedback || '—'}</Td>
                                        <Td className="text-muted-foreground">{s.dateSoumission ? new Date(s.dateSoumission).toLocaleDateString('fr-FR') : '—'}</Td>
                                    </Tr>
                                ))}</Tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
}
