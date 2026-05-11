import { useEffect, useState } from 'react';
import { AlertTriangle, Eye, Award } from 'lucide-react';
import { apiGet, apiPut, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Alert, LoadingState, EmptyState, Tabs,
    StatusBadge, Table, Thead, Th, Tbody, Tr, Td, Pagination, Modal, Btn,
} from '../../components/ui-components';

interface Reclamation {
    id: number;
    motif: string;
    typeReclamation?: string;
    statut?: string;
    urgent?: boolean;
    etudiant?: { firstName?: string; lastName?: string };
    createdAt?: string;
}

interface ReclamationNote {
    id: number;
    motif: string;
    urgent: boolean;
    statut?: 'EN_ATTENTE_ADMIN' | 'EN_ATTENTE_PROF' | 'ACCEPTEE' | 'REFUSEE' | string;
    valeurProposee?: number | null;
    ancienneValeur?: number;
    etudiantNom?: string;
    matiereNom?: string;
    classeNom?: string;
    commentaireProf?: string | null;
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

export default function AdminReclamations() {
    const [data, setData] = useState<Reclamation[]>([]);
    const [noteData, setNoteData] = useState<ReclamationNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'standard' | 'notes'>('standard');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedRec, setSelectedRec] = useState<Reclamation | null>(null);
    const [selectedNote, setSelectedNote] = useState<ReclamationNote | null>(null);
    const [acting, setActing] = useState(false);
    const PS = 10;

    const load = async () => {
        setLoading(true);
        try {
            const [r, rn] = await Promise.all([
                apiGet<Reclamation[]>('/reclamations').catch(() => []),
                apiGet<ReclamationNote[]>('/reclamation-notes/all').catch(() => []),
            ]);
            setData(Array.isArray(r) ? r : []);
            setNoteData(Array.isArray(rn) ? rn : []);
        } catch {
            setData([]);
            setNoteData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAction = async (id: number, statut: 'ACCEPTEE' | 'REFUSEE') => {
        const existing = data.find(d => d.id === id);
        if (!existing) return;
        setActing(true);
        try {
            await apiPut(`/reclamations/${id}`, { ...existing, statut });
            setMsg({ type: 'success', text: `Réclamation ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'}` });
            setSelectedRec(null);
            await load();
        } catch (e) {
            setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' });
        } finally {
            setActing(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    const currentItems = tab === 'standard' ? data : noteData;
    const filtered = currentItems.filter(d => !search || JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS);
    const pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des réclamations…" />;

    return (
        <div className="space-y-4">
            <PageHeader title="Gestion des Réclamations" icon={AlertTriangle} badge={(data.length + noteData.length) > 0 ? { label: `${data.length + noteData.length}`, variant: 'info' } : undefined} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Tabs tabs={[{ id: 'standard', label: 'Réclamations', count: data.length }, { id: 'notes', label: 'Réclamations notes', count: noteData.length }]} active={tab} onChange={(t) => { setTab(t as 'standard' | 'notes'); setPage(0); }} />

            <Card padding={false}>
                <div className="p-4 pb-0">
                    <Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} />
                </div>

                {pd.length === 0 ? <EmptyState icon={tab === 'standard' ? AlertTriangle : Award} title="Aucune réclamation" /> : (
                    tab === 'standard' ? (
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Étudiant</Th>
                                    <Th>Type</Th>
                                    <Th>Motif</Th>
                                    <Th>Statut</Th>
                                    <Th>Date</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {(pd as Reclamation[]).map(r => (
                                    <Tr key={r.id}>
                                        <Td className="text-muted-foreground font-mono text-xs">#{r.id}</Td>
                                        <Td className="text-muted-foreground">{r.etudiant ? `${r.etudiant.firstName || ''} ${r.etudiant.lastName || ''}`.trim() : '—'}</Td>
                                        <Td className="font-medium">{r.typeReclamation || '—'}</Td>
                                        <Td className="text-muted-foreground max-w-[240px] truncate">{r.motif}</Td>
                                        <Td><StatusBadge status={r.statut || 'EN_ATTENTE'} /></Td>
                                        <Td className="text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                        <Td className="text-right">
                                            <button onClick={() => setSelectedRec(r)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
                                                <Eye className="w-3.5 h-3.5" />Consulter
                                            </button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>Étudiant</Th>
                                    <Th>Classe</Th>
                                    <Th>Matière</Th>
                                    <Th>Ancienne</Th>
                                    <Th>Décision prof</Th>
                                    <Th>Statut</Th>
                                    <Th>Date</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {(pd as ReclamationNote[]).map(r => (
                                    <Tr key={r.id}>
                                        <Td>{r.etudiantNom || '—'}</Td>
                                        <Td className="text-muted-foreground">{r.classeNom || '—'}</Td>
                                        <Td className="text-muted-foreground">{r.matiereNom || '—'}</Td>
                                        <Td><span className="font-bold text-red-600">{r.ancienneValeur ?? '—'}/20</span></Td>
                                        <Td><span className="font-bold text-emerald-600">{r.valeurProposee != null ? `${r.valeurProposee}/20` : '—'}</span></Td>
                                        <Td>
                                            {r.statut === 'ACCEPTEE' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">Acceptée</span>}
                                            {r.statut === 'REFUSEE' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20">Refusée</span>}
                                            {r.statut === 'EN_ATTENTE_PROF' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">En attente prof</span>}
                                            {r.statut === 'EN_ATTENTE_ADMIN' && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">En attente admin</span>}
                                            {!r.statut && '—'}
                                        </Td>
                                        <Td className="text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                        <Td className="text-right">
                                            <button onClick={() => setSelectedNote(r)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Consulter">
                                                <Eye className="w-3.5 h-3.5" />Consulter
                                            </button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )
                )}

                <div className="px-4 pb-3">
                    <Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} />
                </div>
            </Card>

            {/* Detail Modal — Réclamation standard */}
            <Modal
                open={!!selectedRec}
                onClose={() => setSelectedRec(null)}
                title={`Réclamation #${selectedRec?.id ?? ''}`}
                size="lg"
                footer={
                    selectedRec?.statut === 'EN_ATTENTE' ? (
                        <>
                            <Btn variant="ghost" onClick={() => setSelectedRec(null)}>Fermer</Btn>
                            <Btn variant="danger" loading={acting} onClick={() => selectedRec && handleAction(selectedRec.id, 'REFUSEE')}>Refuser</Btn>
                            <Btn variant="primary" loading={acting} onClick={() => selectedRec && handleAction(selectedRec.id, 'ACCEPTEE')}>Accepter</Btn>
                        </>
                    ) : (
                        <Btn variant="ghost" onClick={() => setSelectedRec(null)}>Fermer</Btn>
                    )
                }
            >
                {selectedRec && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="ID" value={`#${selectedRec.id}`} />
                            <DetailField label="Statut" value={<StatusBadge status={selectedRec.statut || 'EN_ATTENTE'} />} />
                            <DetailField label="Type" value={selectedRec.typeReclamation || '—'} />
                            <DetailField label="Date" value={selectedRec.createdAt ? new Date(selectedRec.createdAt).toLocaleDateString('fr-FR') : '—'} />
                            <DetailField label="Étudiant" value={selectedRec.etudiant ? `${selectedRec.etudiant.firstName || ''} ${selectedRec.etudiant.lastName || ''}`.trim() : '—'} />
                        </div>
                        <DetailField label="Motif" value={selectedRec.motif} full />
                    </div>
                )}
            </Modal>

            {/* Detail Modal — Réclamation notes (lecture seule) */}
            <Modal
                open={!!selectedNote}
                onClose={() => setSelectedNote(null)}
                title={`Réclamation note #${selectedNote?.id ?? ''}`}
                size="lg"
                footer={<Btn variant="ghost" onClick={() => setSelectedNote(null)}>Fermer</Btn>}
            >
                {selectedNote && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="Étudiant" value={selectedNote.etudiantNom || '—'} />
                            <DetailField label="Classe" value={selectedNote.classeNom || '—'} />
                            <DetailField label="Matière" value={selectedNote.matiereNom || '—'} />
                            <DetailField label="Ancienne note" value={selectedNote.ancienneValeur != null ? `${selectedNote.ancienneValeur}/20` : '—'} />
                            <DetailField label="Note proposée par prof" value={selectedNote.valeurProposee != null ? `${selectedNote.valeurProposee}/20` : '—'} />
                            <DetailField label="Statut" value={
                                selectedNote.statut === 'ACCEPTEE' ? 'Acceptée' :
                                    selectedNote.statut === 'REFUSEE' ? 'Refusée' :
                                        selectedNote.statut === 'EN_ATTENTE_PROF' ? 'En attente prof' :
                                            selectedNote.statut === 'EN_ATTENTE_ADMIN' ? 'En attente admin' : '—'
                            } />
                            <DetailField label="Date" value={selectedNote.createdAt ? new Date(selectedNote.createdAt).toLocaleDateString('fr-FR') : '—'} />
                        </div>
                        <DetailField label="Motif" value={selectedNote.motif} full />
                        {selectedNote.commentaireProf && (
                            <DetailField label="Commentaire du professeur" value={selectedNote.commentaireProf} full />
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
