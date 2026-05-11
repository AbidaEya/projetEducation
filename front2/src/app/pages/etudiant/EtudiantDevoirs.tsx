import { useState, useEffect, useMemo } from 'react';
import { ClipboardList, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { apiGet } from '../../services/api';
import { PageHeader, Card, Btn, LoadingState, EmptyState } from '../../components/ui-components';

interface Devoir { id: number; title: string; description?: string | null; coursId?: number | null; coursNom?: string | null; coursRessourcePath?: string | null; enseignantNom?: string | null; dateDebut?: string | null; dateEchéance?: string | null; }

export default function EtudiantDevoirs() {
    const navigate = useNavigate();
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const fetchData = async () => { setLoading(true); try { const d = await apiGet<Devoir[]>('/devoirs'); setDevoirs(Array.isArray(d) ? d : []); } catch { } finally { setLoading(false); } };
    useEffect(() => { fetchData(); }, []);

    const isExpired = (d: Devoir) => d.dateEchéance ? new Date(d.dateEchéance) < new Date() : false;
    const timeRemaining = (d: Devoir) => {
        if (!d.dateEchéance) return '';
        const diff = new Date(d.dateEchéance).getTime() - Date.now();
        if (diff <= 0) return 'Expiré';
        const days = Math.floor(diff / 86400000), hours = Math.floor((diff % 86400000) / 3600000);
        if (days > 0) return `${days}j ${hours}h restants`;
        return hours > 0 ? `${hours}h restantes` : 'Moins d\'une heure';
    };

    const grouped = useMemo(() => {
        const map: Record<string, Devoir[]> = {};
        devoirs.forEach(d => { const key = d.coursNom || `Cours #${d.coursId || '?'}`; if (!map[key]) map[key] = []; map[key].push(d); });
        Object.values(map).forEach(arr => arr.sort((a, b) => (a.dateEchéance || '').localeCompare(b.dateEchéance || '')));
        return map;
    }, [devoirs]);

    if (loading) return <LoadingState message="Chargement des devoirs…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Devoirs" icon={ClipboardList} actions={<Btn onClick={() => navigate('/dashboard/soumissions')}>📤 Soumettre</Btn>} />
            {Object.keys(grouped).length === 0 ? <EmptyState icon={ClipboardList} title="Aucun devoir" /> :
                Object.entries(grouped).map(([coursName, devoirList]) => {
                    const sample = devoirList[0];
                    return (
                        <Card key={coursName} padding={false}>
                            <div className="px-5 py-3 bg-muted/50 flex items-center justify-between">
                                <div><h3 className="font-semibold text-foreground">{coursName}</h3>{sample?.enseignantNom && <p className="text-xs text-muted-foreground mt-0.5">👨‍🏫 {sample.enseignantNom}</p>}</div>
                                {sample?.coursRessourcePath && <a href={`/api/files/download?path=${encodeURIComponent(sample.coursRessourcePath)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline"><Download className="w-3 h-3" />Ressources</a>}
                            </div>
                            <div className="divide-y divide-border">
                                {devoirList.map(d => {
                                    const expired = isExpired(d), remaining = timeRemaining(d), isOpen = expanded.has(d.id);
                                    return (
                                        <div key={d.id} className="px-5 py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground text-sm">📝 {d.title}</span>
                                                    {expired && <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive rounded text-[10px] font-medium ring-1 ring-destructive/20">Expiré</span>}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {d.dateEchéance && <span className={`text-xs ${expired ? 'text-destructive' : 'text-muted-foreground'}`}>📅 {new Date(d.dateEchéance).toLocaleDateString('fr-FR')} — {remaining}</span>}
                                                    <Btn size="sm" onClick={() => navigate(`/dashboard/soumissions?devoirId=${d.id}`)} disabled={expired}>📤 Soumettre</Btn>
                                                    {d.description && <button onClick={() => setExpanded(prev => { const n = new Set(prev); isOpen ? n.delete(d.id) : n.add(d.id); return n; })} className="p-1 text-muted-foreground">{isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>}
                                                </div>
                                            </div>
                                            {isOpen && d.description && <p className="text-sm text-muted-foreground mt-2 pl-6">{d.description}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
        </div>
    );
}
