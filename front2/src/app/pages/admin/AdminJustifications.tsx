import { useState, useEffect } from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Alert, LoadingState, EmptyState,
    StatusBadge, Table, Thead, Th, Tbody, Tr, Td, Pagination, Modal, Btn,
} from '../../components/ui-components';

interface Justification {
    id: number; motif: string; dateJustification: string; document?: string; statut: string;
    absence?: { id: number; dateAbsence: string; etudiant?: { firstName: string; lastName: string }; cours?: { nomCours: string } };
}

function DetailField({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
            <div className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/60">{value}</div>
        </div>
    );
}

export default function AdminJustifications() {
    const [data, setData] = useState<Justification[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selected, setSelected] = useState<Justification | null>(null);
    const [acting, setActing] = useState(false);
    const PS = 10;

    const load = async () => { setLoading(true); try { const r = await apiGet<Justification[]>('/justifications'); setData(Array.isArray(r) ? r : []); } catch { setData([]); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleAction = async (id: number, statut: string) => {
        setActing(true);
        try {
            await apiPut(`/justifications/${id}`, { statut });
            setMsg({ type: 'success', text: `Justification ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'}` });
            setSelected(null);
            load();
        } catch (e) {
            setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' });
        } finally {
            setActing(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    const filtered = data.filter(j => !search || JSON.stringify(j).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des justifications…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Justifications" icon={FileText} badge={data.length > 0 ? { label: `${data.length}`, variant: 'info' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={FileText} title="Aucune justification" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Motif</Th><Th>Étudiant</Th><Th>Cours</Th><Th>Statut</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(j => (
                            <Tr key={j.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{j.id}</Td>
                                <Td className="max-w-[200px] truncate">{j.motif}</Td>
                                <Td className="text-muted-foreground">{j.absence?.etudiant ? `${j.absence.etudiant.firstName} ${j.absence.etudiant.lastName}` : '—'}</Td>
                                <Td className="text-muted-foreground">{j.absence?.cours?.nomCours || '—'}</Td>
                                <Td><StatusBadge status={j.statut} /></Td>
                                <Td className="text-right">
                                    <button onClick={() => setSelected(j)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
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
                title={`Justification #${selected?.id ?? ''}`}
                size="lg"
                footer={
                    selected?.statut === 'EN_ATTENTE' ? (
                        <>
                            <Btn variant="ghost" onClick={() => setSelected(null)}>Fermer</Btn>
                            <Btn variant="danger" loading={acting} onClick={() => selected && handleAction(selected.id, 'REFUSEE')}>Refuser</Btn>
                            <Btn variant="primary" loading={acting} onClick={() => selected && handleAction(selected.id, 'ACCEPTEE')}>Accepter</Btn>
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
                            <DetailField label="Date justification" value={selected.dateJustification ? new Date(selected.dateJustification).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Date absence" value={selected.absence?.dateAbsence ? new Date(selected.absence.dateAbsence).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Étudiant" value={selected.absence?.etudiant ? `${selected.absence.etudiant.firstName} ${selected.absence.etudiant.lastName}` : '—'} />
                            <DetailField label="Cours" value={selected.absence?.cours?.nomCours || '—'} />
                        </div>
                        <DetailField label="Motif" value={selected.motif} full />
                        {selected.document && (
                            <div>
                                <span className="block text-xs font-medium text-muted-foreground mb-1">Document</span>
                                <a
                                    href={`/api/files/download?path=${encodeURIComponent(selected.document)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    <Download className="w-4 h-4" />Télécharger le document
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
