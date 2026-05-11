import { useState, useEffect } from 'react';
import { Briefcase, Check, X, Eye } from 'lucide-react';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Alert, LoadingState, EmptyState,
    StatusBadge, Table, Thead, Th, Tbody, Tr, Td, Pagination, ConfirmDialog,
} from '../../components/ui-components';

interface DemandeStage {
    id: number; entreprise: string; responsableStage?: string; description: string; statut: string; urgent: boolean;
    etudiant?: { id: number; firstName: string; lastName: string; email: string }; createdAt?: string;
}

export default function AdminDemandesStage() {
    const [data, setData] = useState<DemandeStage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<DemandeStage | null>(null);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ id: number; action: string } | null>(null);
    const [acting, setActing] = useState(false);
    const PS = 10;

    const load = async () => { setLoading(true); try { const r = await apiGet<DemandeStage[]>('/demandes-stage'); setData(Array.isArray(r) ? r : []); } catch { setData([]); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleAction = async (id: number, statut: string) => {
        setActing(true);
        try { await apiPut(`/demandes-stage/${id}`, { statut }); setMsg({ type: 'success', text: `Demande ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'}` }); load(); setSelected(null); setConfirmAction(null); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        finally { setActing(false); setTimeout(() => setMsg(null), 3000); }
    };

    const filtered = data.filter(d => !search || JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des demandes de stage…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Demandes de Stage" icon={Briefcase} badge={data.length > 0 ? { label: `${data.length}`, variant: 'info' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={Briefcase} title="Aucune demande de stage" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Entreprise</Th><Th>Étudiant</Th><Th>Statut</Th><Th>Urgent</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(d => (
                            <Tr key={d.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{d.id}</Td>
                                <Td className="font-medium">{d.entreprise}</Td>
                                <Td className="text-muted-foreground">{d.etudiant ? `${d.etudiant.firstName} ${d.etudiant.lastName}` : '—'}</Td>
                                <Td><StatusBadge status={d.statut} /></Td>
                                <Td>{d.urgent ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20">Urgent</span> : '—'}</Td>
                                <Td className="text-right"><div className="flex items-center justify-end gap-1">
                                    <button onClick={() => setSelected(d)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                                    {d.statut === 'EN_ATTENTE' && (<>
                                        <button onClick={() => setConfirmAction({ id: d.id, action: 'ACCEPTEE' })} className="p-1.5 rounded-lg hover:bg-muted text-emerald-600"><Check className="w-4 h-4" /></button>
                                        <button onClick={() => setConfirmAction({ id: d.id, action: 'REFUSEE' })} className="p-1.5 rounded-lg hover:bg-muted text-red-600"><X className="w-4 h-4" /></button>
                                    </>)}
                                </div></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {selected && (
                <Modal open onClose={() => setSelected(null)} title={`Stage #${selected.id}`} footer={selected.statut === 'EN_ATTENTE' ? <><Btn variant="success" icon={Check} onClick={() => { setSelected(null); setConfirmAction({ id: selected.id, action: 'ACCEPTEE' }); }}>Accepter</Btn><Btn variant="danger" icon={X} onClick={() => { setSelected(null); setConfirmAction({ id: selected.id, action: 'REFUSEE' }); }}>Refuser</Btn></> : undefined}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[['Entreprise', selected.entreprise], ['Responsable', selected.responsableStage || '—'], ['Étudiant', selected.etudiant ? `${selected.etudiant.firstName} ${selected.etudiant.lastName}` : '—'], ['Urgent', selected.urgent ? '🔴 Oui' : 'Non']].map(([l, v], i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/30"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">{l}</p><p className="text-sm font-medium text-foreground">{v}</p></div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 mt-3"><p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Description</p><p className="text-sm text-foreground">{selected.description}</p></div>
                    <div className="mt-3"><StatusBadge status={selected.statut} size="md" /></div>
                </Modal>
            )}
            <ConfirmDialog open={!!confirmAction} title={confirmAction?.action === 'ACCEPTEE' ? 'Accepter ?' : 'Refuser ?'} message="Confirmer cette action ?" variant={confirmAction?.action === 'ACCEPTEE' ? 'info' : 'danger'} confirmLabel={confirmAction?.action === 'ACCEPTEE' ? 'Accepter' : 'Refuser'} loading={acting} onConfirm={() => confirmAction && handleAction(confirmAction.id, confirmAction.action)} onCancel={() => setConfirmAction(null)} />
        </div>
    );
}
