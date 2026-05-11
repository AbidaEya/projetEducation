import { useState, useEffect, useCallback } from 'react';
import { Bell, Send, CheckCircle, XCircle, Clock, Download, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost, apiPut, apiPostForm, type ApiError } from '../../services/api';
import {
    PageHeader, Card, Tabs, Btn, Alert, LoadingState, EmptyState,
    FormField, Input, Textarea, Select,
} from '../../components/ui-components';

interface Etudiant { id: number; firstName: string; lastName: string; email: string; user?: { id: number }; }
interface Notification { id: number; titre?: string; message?: string; statut?: string; createdAt?: string; recipientName?: string; approved?: boolean; attachmentPath?: string; dateEnvoi?: string | null; lu?: boolean | null; read?: boolean | null; }

export default function EnseignantNotifications() {
    const { user } = useAuth();
    const [tab, setTab] = useState('create');
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [history, setHistory] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [targetType, setTargetType] = useState<'single' | 'multiple'>('single');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
    const [titre, setTitre] = useState('');
    const [message, setMessage] = useState('');
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [received, setReceived] = useState<Notification[]>([]);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [e, h, r] = await Promise.all([apiGet<Etudiant[]>('/etudiants').catch(() => []), apiGet<Notification[]>(`/notifications/enseignant/${user.id}/created`).catch(() => []), apiGet<Notification[]>(`/notifications/user/${user.id}`).catch(() => [])]);
            setEtudiants(Array.isArray(e) ? e : []); setHistory(Array.isArray(h) ? h : []);
            setReceived(Array.isArray(r) ? r : []);
        } catch { } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleStudent = (id: number) => { setSelectedStudentIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

    const handleSend = async () => {
        if (!user || !message) return;
        try {
            let attachmentPath: string | undefined;
            if (attachmentFile) {
                const fd = new FormData();
                fd.append('file', attachmentFile);
                const upload = await apiPostForm<{ path: string }>('/notifications/upload', fd);
                attachmentPath = upload?.path;
            }

            if (targetType === 'single') await apiPost('/notifications/enseignant/request', { enseignantId: user.id, userId: Number(selectedStudentId), titre, message, attachmentPath });
            else await apiPost('/notifications/enseignant/broadcast', { enseignantId: user.id, userIds: Array.from(selectedStudentIds), titre, message, attachmentPath });
            setMsg({ type: 'success', text: 'Notification envoyée aux étudiants' }); setTitre(''); setMessage(''); setAttachmentFile(null); setSelectedStudentId(''); setSelectedStudentIds(new Set()); fetchData();
        } catch (e) { setMsg({ type: 'error', text: (e as ApiError).message || 'Erreur' }); }
        setTimeout(() => setMsg(null), 3000);
    };

    const isRead = (n: Notification) => n.lu === true || n.read === true;
    const markRead = async (id: number) => { try { await apiPut(`/notifications/${id}/read`, {}); fetchData(); } catch { } };
    const markAllRead = async () => { if (!user) return; try { await apiPut(`/notifications/user/${user.id}/read-all`, {}); fetchData(); } catch { } };

    const getStatusBadge = (n: Notification) => {
        const s = n.statut?.toUpperCase() || '';
        if (s.includes('APPROU') || s.includes('APPROVED') || n.approved === true) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"><CheckCircle className="w-3 h-3" />Approuvé</span>;
        if (s.includes('REJET') || s.includes('REJECTED') || n.approved === false) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20"><XCircle className="w-3 h-3" />Rejeté</span>;
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"><Clock className="w-3 h-3" />En attente</span>;
    };

    return (
        <div className="space-y-4">
            <PageHeader title="Notifications" icon={Bell} />
            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
            <Tabs tabs={[{ id: 'create', label: '✏️ Créer' }, { id: 'history', label: '📜 Mes demandes', count: history.length }, { id: 'received', label: '📩 Reçues', count: received.length }]} active={tab} onChange={setTab} />

            {tab === 'create' && (
                <Card>
                    <div className="flex gap-2 mb-4">
                        <Btn variant={targetType === 'single' ? 'primary' : 'secondary'} size="sm" onClick={() => setTargetType('single')}>Un étudiant</Btn>
                        <Btn variant={targetType === 'multiple' ? 'primary' : 'secondary'} size="sm" onClick={() => setTargetType('multiple')}>Plusieurs</Btn>
                    </div>
                    <div className="space-y-4">
                        {targetType === 'single' ? (
                            <FormField label="Destinataire"><Select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}><option value="">Sélectionner…</option>{etudiants.map(e => <option key={e.id} value={e.user?.id || e.id}>{e.firstName} {e.lastName}</option>)}</Select></FormField>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-foreground">Destinataires ({selectedStudentIds.size})</span><div className="flex gap-2"><button onClick={() => setSelectedStudentIds(new Set(etudiants.map(e => e.user?.id || e.id)))} className="text-xs text-primary hover:underline">Tout</button><button onClick={() => setSelectedStudentIds(new Set())} className="text-xs text-muted-foreground hover:underline">Aucun</button></div></div>
                                <div className="border border-border/60 rounded-lg max-h-[200px] overflow-y-auto divide-y divide-border">
                                    {etudiants.map(e => {
                                        const uid = e.user?.id || e.id; return (
                                            <label key={e.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer"><input type="checkbox" checked={selectedStudentIds.has(uid)} onChange={() => toggleStudent(uid)} className="accent-primary" /><span className="text-sm text-foreground">{e.firstName} {e.lastName}</span></label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <FormField label="Titre (optionnel)"><Input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Titre de la notification" /></FormField>
                        <FormField label="Message" required><Textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} /></FormField>
                        <FormField label="Pièce jointe (optionnel)"><Input type="file" onChange={e => setAttachmentFile(e.target.files?.[0] || null)} /></FormField>
                        <Alert type="info" message="La notification est envoyée directement aux étudiants sélectionnés." />
                        <Btn icon={Send} onClick={handleSend} disabled={!message || (targetType === 'single' ? !selectedStudentId : selectedStudentIds.size === 0)}>Envoyer</Btn>
                    </div>
                </Card>
            )}

            {tab === 'history' && (
                <div className="space-y-3">
                    {loading ? <LoadingState /> : history.length === 0 ? <EmptyState icon={Bell} title="Aucune notification envoyée" /> :
                        history.map(n => (
                            <Card key={n.id}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">{getStatusBadge(n)}<span className="text-xs text-muted-foreground">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : ''}</span></div>
                                </div>
                                {n.titre && <h4 className="font-medium text-foreground text-sm">{n.titre}</h4>}
                                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                                {n.attachmentPath && <a href={`/api/files/download?path=${encodeURIComponent(n.attachmentPath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"><Download className="w-3 h-3" />Pièce jointe</a>}
                                {n.recipientName && <p className="text-xs text-muted-foreground mt-2">Destinataire: {n.recipientName}</p>}
                            </Card>
                        ))}
                </div>
            )}

            {tab === 'received' && (
                <Card>
                    <div className="flex justify-end mb-3">
                        <Btn size="sm" variant="secondary" icon={CheckCheck} onClick={markAllRead}>Tout marquer lu</Btn>
                    </div>
                    <div className="space-y-3">
                        {loading ? <LoadingState /> : received.length === 0 ? <EmptyState icon={Bell} title="Aucune notification reçue" /> : received.map(n => (
                            <Card key={n.id} className={isRead(n) ? '' : 'border-primary/40'}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        {n.titre && <h4 className="font-medium text-foreground text-sm">{n.titre}</h4>}
                                        <p className="text-sm text-muted-foreground mt-1">{n.message || '—'}</p>
                                        {n.attachmentPath && <a href={`/api/files/download?path=${encodeURIComponent(n.attachmentPath)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"><Download className="w-3 h-3" />Pièce jointe</a>}
                                        <p className="text-xs text-muted-foreground mt-2">{n.dateEnvoi ? new Date(n.dateEnvoi).toLocaleDateString('fr-FR') : n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : ''}</p>
                                    </div>
                                    {!isRead(n) && <Btn size="sm" variant="ghost" onClick={() => markRead(n.id)}>Marquer lu</Btn>}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
