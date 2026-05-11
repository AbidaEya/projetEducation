import { useState, useEffect, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import { apiGet, apiPostForm, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Btn, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Select, Textarea,
} from '../../components/ui-components';

interface Devoir { id: number; title: string; description?: string | null; dateEchéance?: string | null; }
interface Soumission { id: number; devoirId: number; etudiantId: number; contenu?: string; filePath?: string | null; fichierPath?: string | null; dateSubmission?: string | null; dateSoumission?: string | null; note?: number | null; feedback?: string | null; isEvaluated?: boolean | null; evaluated?: boolean | null; }

export default function EtudiantSoumissions() {
    const { user } = useAuth();
    const [params] = useSearchParams();
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDevoir, setSelectedDevoir] = useState('');
    const [contenu, setContenu] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const devoirsMap = new Map(devoirs.map(d => [d.id, d]));

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try {
            const [d, s] = await Promise.all([apiGet<Devoir[]>('/devoirs').catch(() => []), apiGet<Soumission[]>(`/soumissions/etudiant/${user.id}`).catch(() => [])]);
            setDevoirs(Array.isArray(d) ? d : []); setSoumissions((Array.isArray(s) ? s : []).sort((a, b) => (b.dateSubmission || b.dateSoumission || '').localeCompare(a.dateSubmission || a.dateSoumission || '')));
        } catch { } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { const did = params.get('devoirId'); if (did) setSelectedDevoir(did); }, [params]);

    const handleSubmit = async () => {
        if (!user || !selectedDevoir || !file) return;
        try {
            const fd = new FormData(); fd.append('devoirId', selectedDevoir); fd.append('etudiantId', String(user.id)); if (contenu) fd.append('contenu', contenu); fd.append('file', file);
            await apiPostForm('/soumissions/submit', fd);
            setMsg({ type: 'success', text: 'Soumission envoyée' }); setContenu(''); setFile(null); setSelectedDevoir(''); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const selectedDevoirObj = selectedDevoir ? devoirsMap.get(Number(selectedDevoir)) : null;

    return (
        <div className="space-y-6">
            <PageHeader title="Soumissions" icon={Upload} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Card>
                <h3 className="text-[15px] font-semibold text-foreground mb-4">📤 Soumettre un devoir</h3>
                <div className="space-y-4">
                    <FormField label="Devoir" required><Select value={selectedDevoir} onChange={e => setSelectedDevoir(e.target.value)}><option value="">Sélectionner…</option>{devoirs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</Select></FormField>
                    {selectedDevoirObj && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                            {selectedDevoirObj.description && <p className="text-muted-foreground">{selectedDevoirObj.description}</p>}
                            {selectedDevoirObj.dateEchéance && <p className="text-xs text-muted-foreground mt-1">📅 Échéance: {new Date(selectedDevoirObj.dateEchéance).toLocaleDateString('fr-FR')}</p>}
                        </div>
                    )}
                    <FormField label="Commentaire"><Textarea value={contenu} onChange={e => setContenu(e.target.value)} rows={3} placeholder="Ajoutez un commentaire…" /></FormField>
                    <FormField label="Fichier" required>
                        <div className="border-2 border-dashed border-border/60 rounded-lg p-4 text-center">
                            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        {file && <p className="text-sm text-primary mt-1">📄 {file.name}</p>}
                    </FormField>
                    <Btn onClick={handleSubmit} disabled={!selectedDevoir || !file}>📤 Envoyer</Btn>
                </div>
            </Card>

            <Card padding={false}>
                <div className="p-4 pb-0 flex items-center justify-between"><h3 className="font-semibold text-foreground">Historique</h3><Btn variant="ghost" size="sm" onClick={fetchData}>Actualiser</Btn></div>
                {loading ? <LoadingState /> : soumissions.length === 0 ? <EmptyState icon={Upload} title="Aucune soumission" /> : (
                    <Table><Thead><tr><Th>Devoir</Th><Th>Date</Th><Th>Statut</Th><Th>Note</Th><Th>Feedback</Th><Th>Fichier</Th></tr></Thead>
                        <Tbody>{soumissions.map(s => {
                            const fp = s.filePath || s.fichierPath, isEval = s.isEvaluated || s.evaluated;
                            return (
                                <Tr key={s.id}>
                                    <Td className="font-medium">{devoirsMap.get(s.devoirId)?.title || `#${s.devoirId}`}</Td>
                                    <Td className="text-muted-foreground">{(s.dateSubmission || s.dateSoumission) ? new Date(s.dateSubmission || s.dateSoumission!).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td>{isEval ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">Évaluée</span> : <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">En attente</span>}</Td>
                                    <Td>{s.note != null ? <span className={`font-bold ${s.note >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>{s.note}/20</span> : '—'}</Td>
                                    <Td className="text-muted-foreground max-w-[200px] truncate">{s.feedback || '—'}</Td>
                                    <Td>{fp ? <a href={`/api/files/download?path=${encodeURIComponent(fp)}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1"><Download className="w-3 h-3" />Ouvrir</a> : '—'}</Td>
                                </Tr>
                            );
                        })}</Tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
