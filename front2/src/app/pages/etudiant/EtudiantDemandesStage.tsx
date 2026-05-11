import { useState, useEffect, useCallback } from 'react';
import { Building2, Printer, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Btn, Modal, Alert, LoadingState, EmptyState, StatusBadge, Tabs,
    FormField, Input, Textarea,
} from '../../components/ui-components';

interface DemandeStage { id: number; entreprise?: string; responsableStage?: string; description?: string; statut?: string; urgent?: boolean; dateCreation?: string; etudiant?: { id: number; firstName?: string; lastName?: string } | null; }

export default function EtudiantDemandesStage() {
    const { user } = useAuth();
    const [demandes, setDemandes] = useState<DemandeStage[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<DemandeStage | null>(null);
    const [detailTab, setDetailTab] = useState('infos');
    const [form, setForm] = useState({ entreprise: '', responsableStage: '', description: '', urgent: false });
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const data = await apiGet<DemandeStage[]>('/demandes-stage'); setDemandes((Array.isArray(data) ? data : []).filter(d => d.etudiant?.id === user.id)); }
        catch { setDemandes([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async () => {
        if (!user || !form.entreprise) return;
        try { await apiPost('/demandes-stage/create', { ...form, etudiant: { id: user.id } }); setMsg({ type: 'success', text: 'Demande de stage créée' }); setShowForm(false); setForm({ entreprise: '', responsableStage: '', description: '', urgent: false }); fetchData(); }
        catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const printLetter = (d: DemandeStage) => {
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`<html><head><title>Lettre d'affectation</title><style>body{font-family:serif;padding:40px;max-width:700px;margin:auto}h1{text-align:center;margin-bottom:40px}p{line-height:1.8}</style></head><body><h1>Lettre d'affectation de stage</h1><p>Nous attestons que <strong>${d.etudiant?.firstName || ''} ${d.etudiant?.lastName || ''}</strong> est affecté(e) en stage auprès de l'entreprise <strong>${d.entreprise || '—'}</strong>, sous la supervision de <strong>${d.responsableStage || '—'}</strong>.</p><p>${d.description || ''}</p><br/><p>Fait le ${new Date().toLocaleDateString('fr-FR')}</p></body></html>`);
        w.document.close(); w.print();
    };

    const mine = demandes;

    if (loading) return <LoadingState message="Chargement…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Demandes de Stage" icon={Building2} badge={{ label: `${mine.length}`, variant: 'info' }} actions={<Btn onClick={() => setShowForm(!showForm)}>{showForm ? 'Annuler' : '+ Nouvelle demande'}</Btn>} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            {showForm && (
                <Card className="border-2 border-primary/30">
                    <h3 className="text-[15px] font-semibold text-foreground mb-4">Nouvelle demande de stage</h3>
                    <div className="space-y-4">
                        <FormField label="Entreprise" required><Input value={form.entreprise} onChange={e => setForm(p => ({ ...p, entreprise: e.target.value }))} placeholder="Nom de l'entreprise" /></FormField>
                        <FormField label="Responsable de stage"><Input value={form.responsableStage} onChange={e => setForm(p => ({ ...p, responsableStage: e.target.value }))} placeholder="Nom du responsable" /></FormField>
                        <FormField label="Description"><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Décrivez le stage…" /></FormField>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={form.urgent} onChange={e => setForm(p => ({ ...p, urgent: e.target.checked }))} className="accent-primary" /><span className="text-sm text-foreground">Urgent</span></label>
                        <Btn onClick={handleCreate} disabled={!form.entreprise}>Créer</Btn>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* List */}
                <div className="lg:col-span-1 space-y-2">
                    {mine.length === 0 ? <EmptyState icon={Building2} title="Aucune demande" /> :
                        mine.map(d => (
                            <button key={d.id} onClick={() => { setSelected(d); setDetailTab('infos'); }} className={`w-full text-left p-3 rounded-lg border transition-colors ${selected?.id === d.id ? 'border-primary bg-primary/5' : 'border-border/60 bg-card hover:bg-muted'}`}>
                                <div className="flex items-center justify-between"><span className="font-medium text-foreground text-sm">{d.entreprise || '—'}</span><StatusBadge status={d.statut || 'EN_ATTENTE'} /></div>
                                <p className="text-xs text-muted-foreground mt-1">{d.responsableStage || 'Sans responsable'}</p>
                            </button>
                        ))
                    }
                </div>

                {/* Detail */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <Card>
                            <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-semibold text-foreground">{selected.entreprise}</h3><StatusBadge status={selected.statut || 'EN_ATTENTE'} /></div>
                            <Tabs tabs={[{ id: 'infos', label: 'Infos' }, { id: 'entreprise', label: 'Entreprise' }, { id: 'encadrement', label: 'Encadrement' }, { id: 'depot', label: 'Dépôt' }]} active={detailTab} onChange={setDetailTab} />
                            <div className="mt-4">
                                {detailTab === 'infos' && (
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Responsable:</span><span className="text-foreground font-medium">{selected.responsableStage || '—'}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Urgent:</span><span>{selected.urgent ? '⚡ Oui' : 'Non'}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="text-foreground">{selected.dateCreation ? new Date(selected.dateCreation).toLocaleDateString('fr-FR') : '—'}</span></div>
                                        {selected.description && <div><span className="text-muted-foreground">Description:</span><p className="text-foreground mt-1">{selected.description}</p></div>}
                                        {selected.statut === 'APPROUVEE' && <Btn variant="secondary" icon={Printer} onClick={() => printLetter(selected)}>Imprimer lettre</Btn>}
                                    </div>
                                )}
                                {detailTab === 'entreprise' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted/30 rounded-lg"><p className="font-semibold text-foreground">{selected.entreprise}</p><p className="text-sm text-muted-foreground mt-1">{selected.responsableStage || 'Responsable non précisé'}</p></div>
                                        <div><p className="text-sm text-muted-foreground mb-1">Évaluation de l'entreprise</p><div className="flex gap-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-amber-400" fill={i <= 3 ? 'currentColor' : 'none'} />)}</div></div>
                                    </div>
                                )}
                                {detailTab === 'encadrement' && <p className="text-muted-foreground text-sm">Informations d'encadrement à venir.</p>}
                                {detailTab === 'depot' && (
                                    <div className="space-y-3">
                                        <p className="text-muted-foreground text-sm">Dépôt de documents (prochainement)</p>
                                        <div className="opacity-50 pointer-events-none"><FormField label="Rapport de stage"><input type="file" disabled className="text-sm text-muted-foreground" /></FormField></div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : <Card className="text-center text-muted-foreground py-12">Sélectionnez une demande pour voir les détails</Card>}
                </div>
            </div>
        </div>
    );
}
