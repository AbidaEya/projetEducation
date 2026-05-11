import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Btn, Alert, LoadingState, EmptyState, StatusBadge,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Input,
} from '../../components/ui-components';

interface Demande { id: number; type: string; dateDemande?: string | null; statut?: string; urgent?: boolean | null; description?: string | null; }

const MODELES = ['Attestation de scolarité', 'Attestation de réussite', 'Relevé de notes', 'Certificat d\'inscription', 'Attestation de présence', 'Lettre de recommandation', 'Attestation de stage', 'Duplicata de diplôme', 'Convention de stage', 'Autre demande'];

export default function EtudiantDemandes() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [showModelList, setShowModelList] = useState(false);
    const [details, setDetails] = useState('');
    const [urgent, setUrgent] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const data = await apiGet<Demande[]>(`/demandes/etudiant/${user.id}`); setDemandes((Array.isArray(data) ? data : []).filter(d => d.type !== 'STAGE')); }
        catch { setDemandes([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async () => {
        if (!user || !selectedModel) return;
        try {
            await apiPost('/demandes', { type: selectedModel === 'Autre demande' ? 'AUTRE' : 'ATTESTATION', urgent, description: details ? `${selectedModel} — ${details}` : selectedModel, dateDemande: new Date().toISOString(), etudiant: { id: user.id } });
            setMsg({ type: 'success', text: 'Demande créée' }); setShowForm(false); setSelectedModel(''); setDetails(''); setUrgent(false); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const pendingCount = demandes.filter(d => d.statut === 'EN_ATTENTE').length;
    const filteredModels = MODELES.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

    if (loading) return <LoadingState message="Chargement…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Demandes" icon={FileText} badge={pendingCount > 0 ? { label: `${pendingCount} en attente`, variant: 'warning' } : undefined} actions={<div className="flex gap-2"><Btn variant="ghost" onClick={() => navigate('/dashboard/demandes-stage')}>Stages →</Btn><Btn icon={Plus} onClick={() => setShowForm(true)}>Nouvelle</Btn></div>} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            {showForm && (
                <Card className="border-2 border-primary/30">
                    <h3 className="text-[15px] font-semibold text-foreground mb-4">Nouvelle demande</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <FormField label="Type de document" required>
                                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input value={selectedModel || modelSearch} onChange={e => { setModelSearch(e.target.value); setSelectedModel(''); setShowModelList(true); }} onFocus={() => setShowModelList(true)} placeholder="Rechercher un modèle…" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border/60 bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                            </FormField>
                            {showModelList && (
                                <div className="absolute z-10 w-full mt-1 bg-card border border-border/60 rounded-lg shadow-md max-h-[200px] overflow-y-auto">
                                    {filteredModels.map(m => <button key={m} onClick={() => { setSelectedModel(m); setModelSearch(''); setShowModelList(false); }} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted">{m}</button>)}
                                    {filteredModels.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Aucun modèle trouvé</div>}
                                </div>
                            )}
                        </div>
                        {selectedModel && <div className="p-2 bg-primary/5 rounded-lg text-sm text-primary">📄 {selectedModel}</div>}
                        <FormField label="Détails"><Input value={details} onChange={e => setDetails(e.target.value)} placeholder="Informations complémentaires…" /></FormField>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="accent-primary" /><span className="text-sm text-foreground">Urgent</span></label>
                        <div className="flex gap-3"><Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn><Btn onClick={handleCreate} disabled={!selectedModel}>Créer</Btn></div>
                    </div>
                </Card>
            )}

            <Card padding={false}>
                {demandes.length === 0 ? <EmptyState icon={FileText} title="Aucune demande" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Type</Th><Th>Statut</Th><Th>Urgent</Th><Th>Description</Th></tr></Thead>
                        <Tbody>{demandes.map(d => (
                            <Tr key={d.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{d.id}</Td>
                                <Td className="font-medium">{d.type}</Td>
                                <Td><StatusBadge status={d.statut || 'EN_ATTENTE'} /></Td>
                                <Td>{d.urgent ? <span className="text-red-500 font-bold">⚡</span> : '—'}</Td>
                                <Td className="text-muted-foreground max-w-[300px] truncate">{d.description || '—'}</Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
