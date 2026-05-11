import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPostForm, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Btn, Modal, Alert, LoadingState, EmptyState, StatusBadge, Toolbar,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Textarea, Pagination,
} from '../../components/ui-components';

interface Absence { id: number; dateAbsence?: string | null; motif?: string | null; statut?: string; justifie?: boolean; coursNom?: string | null; }

const PER = 10;

export default function EtudiantAbsences() {
    const { user } = useAuth();
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [justifyTarget, setJustifyTarget] = useState<Absence | null>(null);
    const [motif, setMotif] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const data = await apiGet<Absence[]>(`/absences/etudiant/${user.id}`); setAbsences(Array.isArray(data) ? data : []); }
        catch { setAbsences([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const canJustify = (a: Absence) => a.statut !== 'JUSTIFIEE' && a.statut !== 'EN_ATTENTE';

    const handleJustify = async () => {
        if (!justifyTarget) return;
        try {
            const fd = new FormData(); fd.append('absenceId', String(justifyTarget.id)); if (motif) fd.append('motif', motif); if (file) fd.append('file', file);
            await apiPostForm(`/absences/${justifyTarget.id}/justify`, fd);
            setMsg({ type: 'success', text: 'Justification envoyée' }); setJustifyTarget(null); setMotif(''); setFile(null); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const filtered = absences.filter(a => !search || a.coursNom?.toLowerCase().includes(search.toLowerCase()) || a.motif?.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / PER);
    const paginated = filtered.slice((page - 1) * PER, page * PER);

    if (loading) return <LoadingState message="Chargement des absences…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Absences" icon={AlertCircle} badge={{ label: `${absences.length}`, variant: absences.length > 5 ? 'danger' : 'info' }} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(1); }} onRefresh={fetchData} loading={loading} />

            <Card padding={false}>
                {filtered.length === 0 ? <EmptyState icon={AlertCircle} title="Aucune absence" /> : (
                    <>
                        <Table><Thead><tr><Th>Date</Th><Th>Cours</Th><Th>Statut</Th><Th>Motif</Th><Th className="text-right">Action</Th></tr></Thead>
                            <Tbody>{paginated.map(a => (
                                <Tr key={a.id}>
                                    <Td className="text-muted-foreground">{a.dateAbsence ? new Date(a.dateAbsence).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td className="font-medium">{a.coursNom || '—'}</Td>
                                    <Td><StatusBadge status={a.statut || 'NON_JUSTIFIEE'} /></Td>
                                    <Td className="text-muted-foreground max-w-[200px] truncate">{a.motif || '—'}</Td>
                                    <Td className="text-right">{canJustify(a) && <Btn size="sm" icon={Upload} onClick={() => { setJustifyTarget(a); setMotif(''); setFile(null); }}>Justifier</Btn>}</Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                        {totalPages > 1 && <div className="p-4 border-t border-border/60"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>}
                    </>
                )}
            </Card>

            {justifyTarget && (
                <Modal open onClose={() => setJustifyTarget(null)} title="Justifier l'absence" footer={<><Btn variant="ghost" onClick={() => setJustifyTarget(null)}>Annuler</Btn><Btn onClick={handleJustify}>Envoyer</Btn></>}>
                    <div className="p-3 bg-muted/30 rounded-lg text-sm mb-4">
                        <p><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{justifyTarget.dateAbsence ? new Date(justifyTarget.dateAbsence).toLocaleDateString('fr-FR') : '—'}</span></p>
                        <p><span className="text-muted-foreground">Cours:</span> <span className="text-foreground">{justifyTarget.coursNom || '—'}</span></p>
                    </div>
                    <FormField label="Motif"><Textarea value={motif} onChange={e => setMotif(e.target.value)} rows={3} placeholder="Motif de l'absence…" /></FormField>
                    <div className="mt-3"><FormField label="Document justificatif">
                        <div className="border-2 border-dashed border-border/60 rounded-lg p-4 text-center">
                            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        {file && <p className="text-sm text-primary mt-1">📄 {file.name}</p>}
                    </FormField></div>
                </Modal>
            )}
        </div>
    );
}
