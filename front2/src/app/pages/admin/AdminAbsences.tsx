import { useState, useEffect } from 'react';
import { Calendar, Eye } from 'lucide-react';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Alert, LoadingState, EmptyState,
    StatusBadge, Table, Thead, Th, Tbody, Tr, Td, Pagination, Modal, Btn,
} from '../../components/ui-components';

interface Absence {
    id: number; dateAbsence: string; statut: string; createdAt?: string;
    etudiant?: { id: number; firstName: string; lastName: string };
    cours?: { id: number; nomCours: string; enseignant?: { firstName?: string; lastName?: string } };
}

function DetailField({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
            <div className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/60">{value}</div>
        </div>
    );
}

export default function AdminAbsences() {
    const [data, setData] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selected, setSelected] = useState<Absence | null>(null);
    const [acting, setActing] = useState(false);
    const PS = 10;

    const load = async () => { setLoading(true); try { const r = await apiGet<Absence[]>('/absences'); setData(Array.isArray(r) ? r : []); } catch { setData([]); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleAction = async (id: number, statut: string) => {
        setActing(true);
        try {
            await apiPut(`/absences/${id}`, { statut });
            setMsg({ type: 'success', text: `Absence ${statut === 'JUSTIFIEE' ? 'justifiée' : 'non justifiée'}` });
            setSelected(null);
            load();
        } catch (e) {
            setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' });
        } finally {
            setActing(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    const filtered = data.filter(a => !search || JSON.stringify(a).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des absences…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Gestion des Absences" icon={Calendar} badge={data.length > 0 ? { label: `${data.length}`, variant: 'warning' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={Calendar} title="Aucune absence" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Date</Th><Th>Étudiant</Th><Th>Cours</Th><Th>Statut</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(a => (
                            <Tr key={a.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{a.id}</Td>
                                <Td>{a.dateAbsence ? new Date(a.dateAbsence).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td className="text-muted-foreground">{a.etudiant ? `${a.etudiant.firstName} ${a.etudiant.lastName}` : '—'}</Td>
                                <Td className="text-muted-foreground">{a.cours?.nomCours || '—'}</Td>
                                <Td><StatusBadge status={a.statut} /></Td>
                                <Td className="text-right">
                                    <button onClick={() => setSelected(a)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
                                        <Eye className="w-3.5 h-3.5" />Consulter
                                    </button>
                                </Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {/* Detail / Consultation Modal */}
            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                title={`Absence #${selected?.id ?? ''}`}
                size="lg"
                footer={
                    selected?.statut === 'EN_ATTENTE' ? (
                        <>
                            <Btn variant="ghost" onClick={() => setSelected(null)}>Fermer</Btn>
                            <Btn variant="danger" loading={acting} onClick={() => selected && handleAction(selected.id, 'NON_JUSTIFIEE')}>Non justifiée</Btn>
                            <Btn variant="primary" loading={acting} onClick={() => selected && handleAction(selected.id, 'JUSTIFIEE')}>Justifier</Btn>
                        </>
                    ) : (
                        <Btn variant="ghost" onClick={() => setSelected(null)}>Fermer</Btn>
                    )
                }
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="ID" value={`#${selected.id}`} />
                            <DetailField label="Statut" value={<StatusBadge status={selected.statut} />} />
                            <DetailField label="Date absence" value={selected.dateAbsence ? new Date(selected.dateAbsence).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Date création" value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Étudiant" value={selected.etudiant ? `${selected.etudiant.firstName} ${selected.etudiant.lastName}` : '—'} />
                            <DetailField label="Cours" value={selected.cours?.nomCours || '—'} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
