import { useState, useEffect } from 'react';
import { Eye, Download, Award } from 'lucide-react';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, Pagination, FormField, Input, Textarea,
} from '../../components/ui-components';

interface Soumission {
    id: number; contenu?: string; dateSoumission?: string; fichier?: string; note?: number; feedback?: string; isEvaluated?: boolean;
    etudiant?: { id: number; firstName: string; lastName: string };
    devoir?: { id: number; titre: string };
}

export default function AdminSoumissions() {
    const [data, setData] = useState<Soumission[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<Soumission | null>(null);
    const [evaluating, setEvaluating] = useState<Soumission | null>(null);
    const [evalForm, setEvalForm] = useState({ note: 0, feedback: '' });
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const PS = 10;

    const load = async () => { setLoading(true); try { const r = await apiGet<Soumission[]>('/soumissions/all'); setData(Array.isArray(r) ? r : []); } catch { setData([]); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleEvaluate = async () => {
        if (!evaluating) return;
        try { await apiPost(`/soumissions/${evaluating.id}/evaluate`, evalForm); setMsg({ type: 'success', text: 'Soumission évaluée' }); setEvaluating(null); setEvalForm({ note: 0, feedback: '' }); load(); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const filtered = data.filter(s => !search || JSON.stringify(s).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);
    const noteSuggestions = [20, 18, 16, 14, 12, 10, 8, 5, 0];

    if (loading) return <LoadingState message="Chargement des soumissions…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Soumissions" icon={Award} badge={data.length > 0 ? { label: `${data.length}`, variant: 'info' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={Award} title="Aucune soumission" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Devoir</Th><Th>Étudiant</Th><Th>Date</Th><Th>Fichier</Th><Th>Note</Th><Th>Évalué</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(s => (
                            <Tr key={s.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{s.id}</Td>
                                <Td className="font-medium">{s.devoir?.titre || '—'}</Td>
                                <Td className="text-muted-foreground">{s.etudiant ? `${s.etudiant.firstName} ${s.etudiant.lastName}` : '—'}</Td>
                                <Td className="text-muted-foreground">{s.dateSoumission ? new Date(s.dateSoumission).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td>{s.fichier ? <a href={`/api/files/download?path=${encodeURIComponent(s.fichier)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs"><Download className="w-3 h-3" />Fichier</a> : '—'}</Td>
                                <Td>{s.note != null ? <span className={`font-bold ${Number(s.note) >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{s.note}/20</span> : '—'}</Td>
                                <Td>{s.isEvaluated ? <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> : <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />}</Td>
                                <Td className="text-right"><div className="flex items-center justify-end gap-1">
                                    <button onClick={() => setSelected(s)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                                    {!s.isEvaluated && <button onClick={() => { setEvaluating(s); setEvalForm({ note: 0, feedback: '' }); }} className="p-1.5 rounded-lg hover:bg-muted text-emerald-600"><Award className="w-4 h-4" /></button>}
                                </div></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {/* Evaluate Modal */}
            {evaluating && (
                <Modal open onClose={() => setEvaluating(null)} title="Évaluer la soumission" footer={<><Btn variant="ghost" onClick={() => setEvaluating(null)}>Annuler</Btn><Btn onClick={handleEvaluate}>Évaluer</Btn></>}>
                    <p className="text-sm text-muted-foreground mb-4">{evaluating.etudiant?.firstName} {evaluating.etudiant?.lastName} — {evaluating.devoir?.titre}</p>
                    <FormField label="Note /20" required>
                        <Input type="number" min={0} max={20} value={evalForm.note} onChange={e => setEvalForm(p => ({ ...p, note: Number(e.target.value) }))} />
                        <div className="flex flex-wrap gap-1.5 mt-2">{noteSuggestions.map(n => <button key={n} onClick={() => setEvalForm(p => ({ ...p, note: n }))} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${evalForm.note === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}>{n}</button>)}</div>
                    </FormField>
                    <FormField label="Feedback" className="mt-4">
                        <Textarea value={evalForm.feedback} onChange={e => setEvalForm(p => ({ ...p, feedback: e.target.value }))} rows={3} />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {['Excellent !', 'Très bon travail', 'Bon travail', 'Peut mieux faire', 'Insuffisant'].map(f => <button key={f} onClick={() => setEvalForm(p => ({ ...p, feedback: f }))} className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground hover:bg-muted">{f}</button>)}
                        </div>
                    </FormField>
                </Modal>
            )}

            {/* View Modal */}
            {selected && !evaluating && (
                <Modal open onClose={() => setSelected(null)} title={`Soumission #${selected.id}`}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[['Étudiant', `${selected.etudiant?.firstName} ${selected.etudiant?.lastName}`], ['Devoir', selected.devoir?.titre || '—'], ['Date', selected.dateSoumission ? new Date(selected.dateSoumission).toLocaleDateString('fr-FR') : '—']].map(([l, v], i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">{l}</p><p className="text-sm font-medium text-foreground">{v}</p></div>
                        ))}
                        {selected.note != null && <div className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Note</p><p className={`text-sm font-bold ${Number(selected.note) >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{selected.note}/20</p></div>}
                    </div>
                    {selected.contenu && <div className="p-3 rounded-lg bg-muted/30 mt-3"><p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Contenu</p><p className="text-sm text-foreground">{selected.contenu}</p></div>}
                    {selected.feedback && <div className="p-3 rounded-lg bg-muted/30 mt-3"><p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Feedback</p><p className="text-sm text-foreground">{selected.feedback}</p></div>}
                    {selected.fichier && <a href={`/api/files/download?path=${encodeURIComponent(selected.fichier)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mt-3"><Download className="w-4 h-4" />Télécharger le fichier</a>}
                </Modal>
            )}
        </div>
    );
}
