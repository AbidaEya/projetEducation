import { useState, useEffect } from 'react';
import { Bell, Send, Check, X, Trash2, Download } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, apiPostForm, type ApiError } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
    PageHeader, Card, Tabs, Toolbar, Btn, Alert, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td, FormField, Input, Textarea, Select, ConfirmDialog,
} from '../../components/ui-components';

interface Notification { id: number; titre: string; contenu?: string; message?: string; type?: string; statut?: string; createdAt?: string; attachmentPath?: string; sender?: { firstName: string; lastName: string }; }
interface UserOption { id: number; firstName: string; lastName: string; email: string; role?: string }

export default function AdminNotifications() {
    const { user } = useAuth();
    const [tab, setTab] = useState('send');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pending, setPending] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendType, setSendType] = useState<'single' | 'all' | 'etudiants' | 'enseignants'>('single');
    const [form, setForm] = useState({ titre: '', message: '', recipientId: '' });
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [delConfirm, setDelConfirm] = useState<number | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const [a, p, u] = await Promise.all([apiGet<Notification[]>('/notifications').catch(() => []), apiGet<Notification[]>('/notifications/admin/pending').catch(() => []), apiGet<any[]>('/users').catch(() => [])]);
            setNotifications(Array.isArray(a) ? a : []);
            setPending(Array.isArray(p) ? p : []);
            setUsers(Array.isArray(u) ? u : []);
        } catch { } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const mapRole = (raw?: string) => {
        const value = (raw || '').toUpperCase();
        if (value.includes('ADMIN')) return 'ADMIN';
        if (value.includes('ENSEIGNANT')) return 'ENSEIGNANT';
        return 'ETUDIANT';
    };

    const usersByRole = users.reduce<Record<'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT', UserOption[]>>((acc, u) => {
        const role = mapRole(u.role);
        acc[role].push(u);
        return acc;
    }, { ADMIN: [], ENSEIGNANT: [], ETUDIANT: [] });

    const handleSend = async () => {
        try {
            if (!user) {
                setMsg({ type: 'error', text: 'Session admin invalide' });
                return;
            }

            let attachmentPath: string | undefined;
            if (attachmentFile) {
                const fd = new FormData();
                fd.append('file', attachmentFile);
                const upload = await apiPostForm<{ path: string }>('/notifications/upload', fd);
                attachmentPath = upload?.path;
            }

            if (sendType === 'single') {
                await apiPost('/notifications/admin/send', {
                    adminId: user.id,
                    userId: Number(form.recipientId),
                    titre: form.titre,
                    message: form.message,
                    attachmentPath,
                });
            } else {
                const targetRole = sendType === 'all' ? 'ALL' : sendType === 'enseignants' ? 'ENSEIGNANT' : 'ETUDIANT';
                await apiPost('/notifications/admin/broadcast', {
                    adminId: user.id,
                    targetRole,
                    titre: form.titre,
                    message: form.message,
                    attachmentPath,
                });
            }

            setMsg({ type: 'success', text: 'Notification envoyée' });
            setForm({ titre: '', message: '', recipientId: '' });
            setAttachmentFile(null);
            load();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const handleApprove = async (id: number) => { try { await apiPut(`/notifications/admin/${id}/approve`, {}); setMsg({ type: 'success', text: 'Approuvée' }); load(); } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); } setTimeout(() => setMsg(null), 3000); };
    const handleReject = async (id: number) => { try { await apiPut(`/notifications/admin/${id}/reject`, {}); setMsg({ type: 'success', text: 'Rejetée' }); load(); } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); } setTimeout(() => setMsg(null), 3000); };
    const handleDelete = async () => { if (!delConfirm) return; try { await apiDelete(`/notifications/${delConfirm}`); setDelConfirm(null); load(); } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); } };

    return (
        <div className="space-y-4">
            <PageHeader title="Gestion des Notifications" icon={Bell} actions={<Btn variant="ghost" onClick={load} icon={Bell} size="sm">Actualiser</Btn>} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Tabs tabs={[{ id: 'send', label: 'Envoyer' }, { id: 'pending', label: 'En attente', count: pending.length }, { id: 'all', label: 'Toutes', count: notifications.length }]} active={tab} onChange={setTab} />

            {tab === 'send' && (
                <Card>
                    <div className="flex gap-2 mb-4">
                        <Btn variant={sendType === 'single' ? 'primary' : 'secondary'} size="sm" onClick={() => setSendType('single')}>Une personne</Btn>
                        <Btn variant={sendType === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setSendType('all')}>Tout le monde</Btn>
                        <Btn variant={sendType === 'etudiants' ? 'primary' : 'secondary'} size="sm" onClick={() => setSendType('etudiants')}>Étudiants</Btn>
                        <Btn variant={sendType === 'enseignants' ? 'primary' : 'secondary'} size="sm" onClick={() => setSendType('enseignants')}>Enseignants</Btn>
                    </div>
                    <div className="space-y-4">
                        <FormField label="Titre" required><Input value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))} /></FormField>
                        <FormField label="Message" required><Textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} /></FormField>
                        {sendType === 'single' && (
                            <FormField label="Destinataire">
                                <Select value={form.recipientId} onChange={e => setForm(p => ({ ...p, recipientId: e.target.value }))}>
                                    <option value="">Sélectionner…</option>
                                    {usersByRole.ADMIN.length > 0 && <optgroup label="Admins">{usersByRole.ADMIN.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}</optgroup>}
                                    {usersByRole.ENSEIGNANT.length > 0 && <optgroup label="Enseignants">{usersByRole.ENSEIGNANT.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}</optgroup>}
                                    {usersByRole.ETUDIANT.length > 0 && <optgroup label="Étudiants">{usersByRole.ETUDIANT.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}</optgroup>}
                                </Select>
                            </FormField>
                        )}
                        <FormField label="Pièce jointe (optionnel)">
                            <Input type="file" onChange={e => setAttachmentFile(e.target.files?.[0] || null)} />
                        </FormField>
                        <Btn icon={Send} onClick={handleSend} disabled={!form.titre || !form.message || (sendType === 'single' && !form.recipientId)}>Envoyer</Btn>
                    </div>
                </Card>
            )}

            {tab === 'pending' && (
                <div className="space-y-3">
                    {loading ? <LoadingState /> : pending.length === 0 ? <EmptyState icon={Bell} title="Aucune notification en attente" /> : pending.map(n => (
                        <Card key={n.id}>
                            <div className="flex items-start justify-between">
                                <div><h4 className="font-medium text-foreground">{n.titre}</h4><p className="text-sm text-muted-foreground mt-1">{n.contenu || n.message}</p>{n.attachmentPath && <a href={`/api/files/download?path=${encodeURIComponent(n.attachmentPath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"><Download className="w-3 h-3" />Pièce jointe</a>}{n.sender && <p className="text-xs text-muted-foreground mt-2">De: {n.sender.firstName} {n.sender.lastName}</p>}</div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleApprove(n.id)} className="p-1.5 rounded-lg hover:bg-muted text-emerald-600"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => handleReject(n.id)} className="p-1.5 rounded-lg hover:bg-muted text-red-600"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {tab === 'all' && (
                <Card padding={false}>
                    {notifications.length === 0 ? <EmptyState icon={Bell} title="Aucune notification" /> : (
                        <Table><Thead><tr><Th>Titre</Th><Th>Message</Th><Th>Fichier</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></Thead>
                            <Tbody>{notifications.map(n => (
                                <Tr key={n.id}>
                                    <Td className="font-medium">{n.titre}</Td>
                                    <Td className="text-muted-foreground max-w-[300px] truncate">{n.contenu || n.message}</Td>
                                    <Td>{n.attachmentPath ? <a href={`/api/files/download?path=${encodeURIComponent(n.attachmentPath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs"><Download className="w-3 h-3" />Ouvrir</a> : '—'}</Td>
                                    <Td className="text-muted-foreground">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : '—'}</Td>
                                    <Td className="text-right"><button onClick={() => setDelConfirm(n.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600"><Trash2 className="w-4 h-4" /></button></Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    )}
                </Card>
            )}
            <ConfirmDialog open={!!delConfirm} title="Supprimer ?" message="Supprimer cette notification ?" variant="danger" confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDelConfirm(null)} />
        </div>
    );
}
