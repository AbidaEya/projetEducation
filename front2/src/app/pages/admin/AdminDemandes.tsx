import { useState, useEffect } from 'react';
import { FileText, Eye, Briefcase } from 'lucide-react';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Alert, LoadingState, EmptyState, Tabs,
    StatusBadge, Table, Thead, Th, Tbody, Tr, Td, Pagination, Modal, Btn,
} from '../../components/ui-components';

interface Demande {
    id: number; type: string; description: string; statut: string; urgent: boolean;
    etudiant?: { id: number; firstName: string; lastName: string; email: string };
    createdAt?: string;
}

interface DemandeStage {
    id: number; entreprise: string; responsableStage?: string; description: string; statut: string; urgent: boolean;
    etudiant?: { id: number; firstName: string; lastName: string; email: string };
    createdAt?: string;
}

function DetailField({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
            <div className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/60">{value}</div>
        </div>
    );
}

export default function AdminDemandes() {
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [stages, setStages] = useState<DemandeStage[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'demandes' | 'stages'>('demandes');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [selectedStage, setSelectedStage] = useState<DemandeStage | null>(null);
    const [acting, setActing] = useState(false);
    const PS = 10;

    const load = async () => {
        setLoading(true);
        try {
            const [r1, r2] = await Promise.all([
                apiGet<Demande[]>('/demandes').catch(() => []),
                apiGet<DemandeStage[]>('/demandes-stage').catch(() => []),
            ]);
            setDemandes(Array.isArray(r1) ? r1 : []);
            setStages(Array.isArray(r2) ? r2 : []);
        } catch {
            setDemandes([]);
            setStages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAction = async (id: number, statut: string, kind: 'demandes' | 'stages') => {
        setActing(true);
        try {
            if (kind === 'demandes') await apiPut(`/demandes/${id}`, { statut });
            else await apiPut(`/demandes-stage/${id}`, { statut });
            setMsg({ type: 'success', text: `Demande ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'}` });
            setSelectedDemande(null);
            setSelectedStage(null);
            await load();
        }
        catch (e) {
            setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' });
        }
        finally {
            setActing(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    const currentItems = tab === 'demandes' ? demandes : stages;
    const filtered = currentItems.filter(d => !search || JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS);
    const pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des demandes…" />;

    return (
        <div className="space-y-4">
            <PageHeader title="Gestion des Demandes" icon={FileText} badge={(demandes.length + stages.length) > 0 ? { label: `${demandes.length + stages.length}`, variant: 'info' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Tabs tabs={[{ id: 'demandes', label: 'Demandes', count: demandes.length }, { id: 'stages', label: 'Demandes stage', count: stages.length }]} active={tab} onChange={(t) => { setTab(t as 'demandes' | 'stages'); setPage(0); }} />

            <Card padding={false}>
                <div className="p-4 pb-0">
                    <Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} />
                </div>

                {pd.length === 0 ? <EmptyState icon={tab === 'demandes' ? FileText : Briefcase} title={tab === 'demandes' ? 'Aucune demande' : 'Aucune demande de stage'} /> : (
                    tab === 'demandes' ? (
                        <Table><Thead><tr><Th>ID</Th><Th>Type</Th><Th>Étudiant</Th><Th>Statut</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                            <Tbody>{(pd as Demande[]).map(d => (
                                <Tr key={d.id}>
                                    <Td className="text-muted-foreground font-mono text-xs">#{d.id}</Td>
                                    <Td className="font-medium">{d.type}</Td>
                                    <Td className="text-muted-foreground">{d.etudiant ? `${d.etudiant.firstName} ${d.etudiant.lastName}` : '—'}</Td>
                                    <Td><StatusBadge status={d.statut} /></Td>
                                    <Td className="text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td className="text-right">
                                        <button onClick={() => setSelectedDemande(d)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
                                            <Eye className="w-3.5 h-3.5" />Consulter
                                        </button>
                                    </Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    ) : (
                        <Table><Thead><tr><Th>ID</Th><Th>Entreprise</Th><Th>Étudiant</Th><Th>Statut</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                            <Tbody>{(pd as DemandeStage[]).map(d => (
                                <Tr key={d.id}>
                                    <Td className="text-muted-foreground font-mono text-xs">#{d.id}</Td>
                                    <Td className="font-medium">{d.entreprise}</Td>
                                    <Td className="text-muted-foreground">{d.etudiant ? `${d.etudiant.firstName} ${d.etudiant.lastName}` : '—'}</Td>
                                    <Td><StatusBadge status={d.statut} /></Td>
                                    <Td className="text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td className="text-right">
                                        <button onClick={() => setSelectedStage(d)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
                                            <Eye className="w-3.5 h-3.5" />Consulter
                                        </button>
                                    </Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    )
                )}

                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {/* Detail Modal — Demande */}
            <Modal
                open={!!selectedDemande}
                onClose={() => setSelectedDemande(null)}
                title={`Demande #${selectedDemande?.id ?? ''}`}
                size="lg"
                footer={
                    selectedDemande?.statut === 'EN_ATTENTE' ? (
                        <>
                            <Btn variant="ghost" onClick={() => setSelectedDemande(null)}>Fermer</Btn>
                            <Btn variant="danger" loading={acting} onClick={() => selectedDemande && handleAction(selectedDemande.id, 'REFUSEE', 'demandes')}>Refuser</Btn>
                            <Btn variant="primary" loading={acting} onClick={() => selectedDemande && handleAction(selectedDemande.id, 'ACCEPTEE', 'demandes')}>Accepter</Btn>
                        </>
                    ) : (
                        <Btn variant="ghost" onClick={() => setSelectedDemande(null)}>Fermer</Btn>
                    )
                }
            >
                {selectedDemande && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="ID" value={`#${selectedDemande.id}`} />
                            <DetailField label="Statut" value={<StatusBadge status={selectedDemande.statut} />} />
                            <DetailField label="Type" value={selectedDemande.type} />
                            <DetailField label="Date" value={selectedDemande.createdAt ? new Date(selectedDemande.createdAt).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Étudiant" value={selectedDemande.etudiant ? `${selectedDemande.etudiant.firstName} ${selectedDemande.etudiant.lastName}` : '—'} />
                            <DetailField label="Email" value={selectedDemande.etudiant?.email || '—'} />
                        </div>
                        <DetailField label="Description" value={selectedDemande.description || '—'} full />
                    </div>
                )}
            </Modal>

            {/* Detail Modal — Demande Stage */}
            <Modal
                open={!!selectedStage}
                onClose={() => setSelectedStage(null)}
                title={`Demande de stage #${selectedStage?.id ?? ''}`}
                size="lg"
                footer={
                    selectedStage?.statut === 'EN_ATTENTE' ? (
                        <>
                            <Btn variant="ghost" onClick={() => setSelectedStage(null)}>Fermer</Btn>
                            <Btn variant="danger" loading={acting} onClick={() => selectedStage && handleAction(selectedStage.id, 'REFUSEE', 'stages')}>Refuser</Btn>
                            <Btn variant="primary" loading={acting} onClick={() => selectedStage && handleAction(selectedStage.id, 'ACCEPTEE', 'stages')}>Accepter</Btn>
                        </>
                    ) : (
                        <Btn variant="ghost" onClick={() => setSelectedStage(null)}>Fermer</Btn>
                    )
                }
            >
                {selectedStage && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="ID" value={`#${selectedStage.id}`} />
                            <DetailField label="Statut" value={<StatusBadge status={selectedStage.statut} />} />
                            <DetailField label="Entreprise" value={selectedStage.entreprise} />
                            <DetailField label="Responsable stage" value={selectedStage.responsableStage || '—'} />
                            <DetailField label="Étudiant" value={selectedStage.etudiant ? `${selectedStage.etudiant.firstName} ${selectedStage.etudiant.lastName}` : '—'} />
                            <DetailField label="Date" value={selectedStage.createdAt ? new Date(selectedStage.createdAt).toLocaleDateString('fr-FR') : '—'} />
                        </div>
                        <DetailField label="Description" value={selectedStage.description || '—'} full />
                    </div>
                )}
            </Modal>
        </div>
    );
}
