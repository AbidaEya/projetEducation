import { useState, useEffect, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Btn, Alert, LoadingState, EmptyState, StatusBadge,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Input,
} from '../../components/ui-components';

interface Reclamation { id: number; motif: string; typeReclamation?: string | null; statut?: string; urgent?: boolean; dateCreation?: string | null; etudiant?: { id: number } | null; }

export default function EtudiantReclamations() {
    const { user } = useAuth();
    const [reclamations, setReclamations] = useState<Reclamation[]>([]);
    const [loading, setLoading] = useState(false);
    const [motif, setMotif] = useState('');
    const [typeR, setTypeR] = useState('');
    const [urgent, setUrgent] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const data = await apiGet<Reclamation[]>('/reclamations'); setReclamations((Array.isArray(data) ? data : []).filter(r => r.etudiant?.id === user.id)); }
        catch { setReclamations([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async () => {
        if (!user || !motif) return;
        try {
            await apiPost('/reclamations/create', { motif, typeReclamation: typeR || undefined, urgent, etudiant: { id: user.id } });
            setMsg({ type: 'success', text: 'Réclamation envoyée' }); setMotif(''); setTypeR(''); setUrgent(false); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    if (loading) return <LoadingState message="Chargement…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Réclamations" icon={MessageSquare} badge={{ label: `${reclamations.length}`, variant: 'info' }} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Card className="border-2 border-primary/30">
                <h3 className="text-[15px] font-semibold text-foreground mb-4">Nouvelle réclamation</h3>
                <div className="space-y-4">
                    <FormField label="Motif" required><Input value={motif} onChange={e => setMotif(e.target.value)} placeholder="Décrivez votre réclamation…" /></FormField>
                    <FormField label="Type (optionnel)"><Input value={typeR} onChange={e => setTypeR(e.target.value)} placeholder="Ex: Note, Absence, Administratif…" /></FormField>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="accent-primary" /><span className="text-sm text-foreground">Urgent</span></label>
                    <Btn onClick={handleCreate} disabled={!motif}>Envoyer</Btn>
                </div>
            </Card>

            <Card padding={false}>
                {reclamations.length === 0 ? <EmptyState icon={MessageSquare} title="Aucune réclamation" /> : (
                    <Table><Thead><tr><Th>ID</Th><Th>Motif</Th><Th>Type</Th><Th>Statut</Th><Th>Urgent</Th><Th>Date</Th></tr></Thead>
                        <Tbody>{reclamations.map(r => (
                            <Tr key={r.id}>
                                <Td className="text-muted-foreground font-mono text-xs">#{r.id}</Td>
                                <Td className="font-medium max-w-[250px] truncate">{r.motif}</Td>
                                <Td className="text-muted-foreground">{r.typeReclamation || '—'}</Td>
                                <Td><StatusBadge status={r.statut || 'EN_ATTENTE'} /></Td>
                                <Td>{r.urgent ? <span className="text-red-500 font-bold">⚡</span> : '—'}</Td>
                                <Td className="text-muted-foreground">{r.dateCreation ? new Date(r.dateCreation).toLocaleDateString('fr-FR') : '—'}</Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
