import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Upload, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, apiPostForm, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, Pagination, FormField, Input, Textarea, Select,
} from '../../components/ui-components';

interface Cours { id: number; nomCours: string; description?: string; coefficient?: number; volumeHoraire?: number; departement?: { id: number; nom: string }; enseignant?: { id: number }; resourcePath?: string; }
interface Departement { id: number; nom: string; }

export default function EnseignantCours() {
    const { user } = useAuth();
    const [cours, setCours] = useState<Cours[]>([]);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [uploadTarget, setUploadTarget] = useState<Cours | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [form, setForm] = useState({ nomCours: '', description: '', departementId: '', coefficient: '1', volumeHoraire: '20' });
    const PS = 10;

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [c, d] = await Promise.all([apiGet<Cours[]>(`/cours/enseignant/${user.id}`).catch(() => []), apiGet<Departement[]>('/departements').catch(() => [])]);
            setCours(Array.isArray(c) ? c : []); setDepartements(Array.isArray(d) ? d : []);
        } catch { } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async () => {
        if (!user) return;
        try {
            await apiPost('/cours', { nomCours: form.nomCours, description: form.description, coefficient: Number(form.coefficient), volumeHoraire: Number(form.volumeHoraire), departement: form.departementId ? { id: Number(form.departementId) } : undefined, enseignant: { id: user.id } });
            setMsg({ type: 'success', text: 'Cours créé' }); setShowCreate(false); setForm({ nomCours: '', description: '', departementId: '', coefficient: '1', volumeHoraire: '20' }); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const handleUpload = async () => {
        if (!uploadTarget || !file) return;
        try {
            const fd = new FormData(); fd.append('file', file);
            await apiPostForm(`/cours/${uploadTarget.id}/upload-resource`, fd);
            setMsg({ type: 'success', text: 'Fichier uploadé' }); setUploadTarget(null); setFile(null); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur upload' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const filtered = cours.filter(c => !search || c.nomCours?.toLowerCase().includes(search.toLowerCase()) || c.departement?.nom?.toLowerCase().includes(search.toLowerCase()));
    const tp = Math.ceil(filtered.length / PS), pd = filtered.slice(page * PS, (page + 1) * PS);

    if (loading) return <LoadingState message="Chargement des cours…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Cours" icon={BookOpen} badge={cours.length > 0 ? { label: `${cours.length}`, variant: 'info' } : undefined} actions={<Btn icon={Plus} onClick={() => setShowCreate(true)}>Nouveau cours</Btn>} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Card padding={false}>
                <div className="p-4 pb-0"><Toolbar searchValue={search} onSearch={v => { setSearch(v); setPage(0); }} onRefresh={fetchData} loading={loading} /></div>
                {pd.length === 0 ? <EmptyState icon={BookOpen} title="Aucun cours" /> : (
                    <Table><Thead><tr><Th>Nom</Th><Th>Département</Th><Th>Coeff.</Th><Th>Volume</Th><Th>Ressource</Th><Th className="text-right">Actions</Th></tr></Thead>
                        <Tbody>{pd.map(c => (
                            <Tr key={c.id}>
                                <Td className="font-medium">{c.nomCours}</Td>
                                <Td className="text-muted-foreground">{c.departement?.nom || '—'}</Td>
                                <Td className="text-muted-foreground">{c.coefficient ?? '—'}</Td>
                                <Td className="text-muted-foreground">{c.volumeHoraire ? `${c.volumeHoraire}h` : '—'}</Td>
                                <Td>{c.resourcePath ? <a href={`/api/files/download?path=${encodeURIComponent(c.resourcePath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs"><Download className="w-3 h-3" />Ouvrir</a> : <span className="text-muted-foreground text-xs">Aucun</span>}</Td>
                                <Td className="text-right"><Btn size="sm" variant="secondary" icon={Upload} onClick={() => setUploadTarget(c)}>Upload</Btn></Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
                <div className="px-4 pb-3"><Pagination page={page} totalPages={tp} onPageChange={setPage} totalItems={filtered.length} pageSize={PS} /></div>
            </Card>

            {showCreate && (
                <Modal open onClose={() => setShowCreate(false)} title="Nouveau Cours" footer={<><Btn variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Btn><Btn onClick={handleCreate} disabled={!form.nomCours || !form.departementId}>Créer</Btn></>}>
                    <div className="space-y-4">
                        <FormField label="Nom du cours" required><Input value={form.nomCours} onChange={e => setForm(p => ({ ...p, nomCours: e.target.value }))} placeholder="Ex: Programmation Java" /></FormField>
                        <FormField label="Description"><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></FormField>
                        <FormField label="Département" required><Select value={form.departementId} onChange={e => setForm(p => ({ ...p, departementId: e.target.value }))}><option value="">Sélectionner…</option>{departements.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}</Select></FormField>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Coefficient"><Input type="number" min={1} max={10} value={form.coefficient} onChange={e => setForm(p => ({ ...p, coefficient: e.target.value }))} /></FormField>
                            <FormField label="Volume horaire"><Input type="number" min={1} value={form.volumeHoraire} onChange={e => setForm(p => ({ ...p, volumeHoraire: e.target.value }))} /></FormField>
                        </div>
                    </div>
                </Modal>
            )}

            {uploadTarget && (
                <Modal open onClose={() => { setUploadTarget(null); setFile(null); }} title="Upload Ressource" footer={<><Btn variant="ghost" onClick={() => { setUploadTarget(null); setFile(null); }}>Annuler</Btn><Btn icon={Upload} onClick={handleUpload} disabled={!file}>Uploader</Btn></>}>
                    <p className="text-sm text-muted-foreground mb-4">Cours : <span className="font-medium text-foreground">{uploadTarget.nomCours}</span></p>
                    <div className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center">
                        <input type="file" accept=".pdf,.doc,.docx,.txt,.zip" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-xs text-muted-foreground mt-2">Max 20 MB</p>
                    </div>
                    {file && <p className="text-sm text-primary mt-2">📄 {file.name}</p>}
                </Modal>
            )}
        </div>
    );
}
