import { useEffect, useState, useMemo } from 'react';
import { Bell, Check, RefreshCw, Inbox } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPut } from '../services/api';
import { PageHeader, Card, Tabs, Btn, LoadingState, EmptyState, Alert } from '../components/ui-components';

interface Notif { id: number; message: string; type: string; lu: boolean; dateCreation: string; }

export default function NotificationsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const load = async () => {
        if (!user) return;
        setLoading(true);
        try { setData(await apiGet(`/notifications/user/${user.id}`)); }
        catch { setData([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [user]);

    const markRead = async (id: number) => {
        try {
            await apiPut(`/notifications/${id}/read`, {});
            setData(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
            setMsg({ type: 'success', text: 'Notification marquée comme lue' });
            setTimeout(() => setMsg(null), 2000);
        } catch { setMsg({ type: 'error', text: 'Erreur' }); }
    };

    const markAllRead = async () => {
        if (!user) return;
        const unread = data.filter(n => !n.lu);
        try {
            await apiPut(`/notifications/user/${user.id}/read-all`, {});
            setData(prev => prev.map(n => ({ ...n, lu: true })));
            setMsg({ type: 'success', text: `${unread.length} notifications marquées comme lues` });
        } catch {
            setMsg({ type: 'error', text: 'Erreur lors de la mise à jour' });
        }
        setTimeout(() => setMsg(null), 2000);
    };

    const filtered = useMemo(() =>
        tab === 'unread' ? data.filter(n => !n.lu) : tab === 'read' ? data.filter(n => n.lu) : data
        , [data, tab]);

    const unreadCount = data.filter(n => !n.lu).length;

    const tabs = [
        { id: 'all', label: 'Toutes', count: data.length },
        { id: 'unread', label: 'Non lues', count: unreadCount },
        { id: 'read', label: 'Lues', count: data.filter(n => n.lu).length },
    ];

    const typeColor: Record<string, string> = {
        INFO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20',
        ALERT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
        SUCCESS: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
        ERROR: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
        ADMIN: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20',
        BROADCAST: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20',
    };

    if (loading) return <LoadingState message="Chargement des notifications..." />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader title="Notifications" subtitle={`${unreadCount} non lue${unreadCount !== 1 ? 's' : ''}`} icon={Bell}
                badge={unreadCount > 0 ? { label: `${unreadCount}`, variant: 'warning' as const } : undefined}
                actions={
                    <div className="flex gap-2">
                        {unreadCount > 0 && <Btn variant="secondary" icon={Check} size="sm" onClick={markAllRead}>Tout marquer lu</Btn>}
                        <Btn variant="ghost" icon={RefreshCw} size="sm" onClick={load}>Actualiser</Btn>
                    </div>
                }
            />

            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            {filtered.length === 0 ? (
                <EmptyState icon={Inbox} title="Aucune notification" description={tab === 'unread' ? 'Toutes les notifications sont lues !' : 'Aucune notification pour le moment'} />
            ) : (
                <div className="space-y-2">
                    {filtered.map(n => (
                        <Card key={n.id} className={`transition-all duration-200 ${!n.lu ? 'ring-1 ring-primary/20 bg-primary/[0.03]' : 'opacity-75'}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.lu ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase ${typeColor[n.type] || typeColor.INFO}`}>
                                            {n.type}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {new Date(n.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-foreground leading-relaxed">{n.message}</p>
                                </div>
                                {!n.lu && (
                                    <Btn variant="ghost" size="sm" onClick={() => markRead(n.id)} className="flex-shrink-0">
                                        <Check className="w-4 h-4" />
                                    </Btn>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
