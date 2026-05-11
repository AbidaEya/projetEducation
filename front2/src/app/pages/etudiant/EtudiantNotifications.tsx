import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPut } from '../../services/api';
import {
    PageHeader, Card, Btn, LoadingState, EmptyState,
    Table, Thead, Th, Tbody, Tr, Td,
} from '../../components/ui-components';

interface Notif { id: number; titre?: string; message?: string; dateEnvoi?: string | null; lu?: boolean | null; read?: boolean | null; attachmentPath?: string; }

export default function EtudiantNotifications() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true);
        try { const d = await apiGet<Notif[]>(`/notifications/user/${user.id}`); setNotifs(Array.isArray(d) ? d : []); }
        catch { setNotifs([]); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const isRead = (n: Notif) => n.lu === true || n.read === true;
    const markRead = async (id: number) => { try { await apiPut(`/notifications/${id}/read`, {}); fetchData(); } catch { } };
    const markAllRead = async () => { if (!user) return; try { await apiPut(`/notifications/user/${user.id}/read-all`, {}); fetchData(); } catch { } };

    const unreadCount = notifs.filter(n => !isRead(n)).length;

    return (
        <div className="space-y-4">
            <PageHeader title="Notifications" icon={Bell} badge={unreadCount > 0 ? { label: `${unreadCount} non lues`, variant: 'warning' } : { label: `${notifs.length}`, variant: 'info' }} actions={unreadCount > 0 ? <Btn variant="secondary" icon={CheckCheck} onClick={markAllRead}>Tout marquer lu</Btn> : undefined} />

            <Card padding={false}>
                {loading ? <LoadingState /> : notifs.length === 0 ? <EmptyState icon={Bell} title="Aucune notification" /> : (
                    <Table><Thead><tr><Th>Date</Th><Th>Message</Th><Th>Fichier</Th><Th>Statut</Th><Th className="text-right">Action</Th></tr></Thead>
                        <Tbody>{notifs.map(n => (
                            <Tr key={n.id} className={isRead(n) ? '' : 'bg-primary/5'}>
                                <Td className="text-muted-foreground whitespace-nowrap">{n.dateEnvoi ? new Date(n.dateEnvoi).toLocaleDateString('fr-FR') : '—'}</Td>
                                <Td><div>{n.titre && <p className="font-medium text-foreground text-sm">{n.titre}</p>}<p className="text-sm text-muted-foreground">{n.message || '—'}</p></div></Td>
                                <Td>{n.attachmentPath ? <a href={`/api/files/download?path=${encodeURIComponent(n.attachmentPath)}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1"><Download className="w-3 h-3" />Ouvrir</a> : '—'}</Td>
                                <Td>{isRead(n) ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground ring-1 ring-border/60">Lu</span> : <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">Non lu</span>}</Td>
                                <Td className="text-right">{!isRead(n) && <Btn size="sm" variant="ghost" onClick={() => markRead(n.id)}>Marquer lu</Btn>}</Td>
                            </Tr>
                        ))}</Tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
