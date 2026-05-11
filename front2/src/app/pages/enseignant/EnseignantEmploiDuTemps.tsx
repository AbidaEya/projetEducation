import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet } from '../../services/api';
import { PageHeader, Card, LoadingState, Alert } from '../../components/ui-components';

interface EmploiEntry { id?: number; jour: string; heureDebut: string; heureFin: string; salle?: string; coursId?: number; coursNom?: string; }
interface Cours { id: number; nomCours: string; }

const DEFAULT_TIME_SLOTS = ['08:00-09:30', '09:45-11:15', '11:30-13:00', '14:00-15:30', '15:45-17:15', '17:30-19:00'];
const DAY_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAY_COLORS = ['bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300', 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300', 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300', 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300', 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'];

function normalizeDay(d: string): string {
    const low = d.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (low.startsWith('lun')) return 'Lundi'; if (low.startsWith('mar')) return 'Mardi';
    if (low.startsWith('mer')) return 'Mercredi'; if (low.startsWith('jeu')) return 'Jeudi';
    if (low.startsWith('ven')) return 'Vendredi'; if (low.startsWith('sam')) return 'Samedi';
    if (low.startsWith('dim')) return 'Dimanche';
    return d;
}

function toHHmm(value?: string): string {
    if (!value) return '';
    const asString = String(value);
    return asString.length >= 5 ? asString.substring(0, 5) : asString;
}

export default function EnseignantEmploiDuTemps() {
    const { user } = useAuth();
    const [entries, setEntries] = useState<EmploiEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const cours = await apiGet<Cours[]>(`/cours/enseignant/${user.id}`).catch(() => []);
            const coursList = Array.isArray(cours) ? cours : [];
            const coursMap = new Map(coursList.map(c => [c.id, c.nomCours]));
            const allEntries: EmploiEntry[] = [];
            for (const c of coursList) {
                try {
                    const edts = await apiGet<EmploiEntry[]>(`/emploi-du-temps/cours/${c.id}`);
                    if (Array.isArray(edts)) {
                        edts.forEach(e => {
                            const heureDebut = toHHmm(e.heureDebut);
                            const heureFin = toHHmm(e.heureFin);
                            allEntries.push({
                                ...e,
                                heureDebut,
                                heureFin,
                                coursNom: coursMap.get(e.coursId ?? c.id) || c.nomCours,
                            });
                        });
                    }
                } catch { }
            }
            setEntries(allEntries);
        } catch { setError('Erreur chargement'); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const days = useMemo(() => {
        const unique = Array.from(new Set(entries.map(e => normalizeDay(e.jour)).filter(Boolean)));
        if (unique.length === 0) return DAY_ORDER.slice(0, 5);
        const ordered = DAY_ORDER.filter(d => unique.includes(d));
        const extras = unique.filter(d => !DAY_ORDER.includes(d));
        return [...ordered, ...extras];
    }, [entries]);

    const timeSlots = useMemo(() => {
        const unique = Array.from(new Set(
            entries
                .map(e => {
                    const start = toHHmm(e.heureDebut);
                    const end = toHHmm(e.heureFin);
                    return start && end ? `${start}-${end}` : '';
                })
                .filter(Boolean)
        ));
        if (unique.length === 0) return DEFAULT_TIME_SLOTS;
        return unique.sort((a, b) => a.localeCompare(b));
    }, [entries]);

    const grid = useMemo(() => {
        const map = new Map<string, EmploiEntry[]>();
        entries.forEach(e => {
            const start = toHHmm(e.heureDebut);
            const end = toHHmm(e.heureFin);
            const slot = start && end ? `${start}-${end}` : '';
            if (!slot) return;
            const key = `${normalizeDay(e.jour)}|${slot}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(e);
        });
        return map;
    }, [entries]);

    if (loading) return <LoadingState message="Chargement de l'emploi du temps…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Emploi du temps" icon={Calendar} subtitle={user ? `${user.firstName} ${user.lastName}` : undefined} />
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead><tr>
                            <th className="px-3 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/50 border-b border-r border-border/60 w-[120px]">Horaire</th>
                            {days.map(d => <th key={d} className="px-3 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/50 border-b border-r border-border/60 last:border-r-0">{d}</th>)}
                        </tr></thead>
                        <tbody>
                            {timeSlots.map(slot => (
                                <tr key={slot}>
                                    <td className="px-3 py-4 text-xs font-medium text-muted-foreground bg-muted/30 border-b border-r border-border/60 whitespace-nowrap">{slot}</td>
                                    {days.map((day, di) => {
                                        const items = grid.get(`${day}|${slot}`) || [];
                                        return (
                                            <td key={day} className="px-2 py-2 border-b border-r border-border/60 last:border-r-0 align-top h-[80px]">
                                                {items.map((item, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`rounded-lg border p-2 mb-1 ${DAY_COLORS[di % DAY_COLORS.length]}`}>
                                                        <p className="font-medium text-xs leading-tight">{item.coursNom || '—'}</p>
                                                        {item.salle && <p className="text-[10px] opacity-70 mt-0.5">📍 {item.salle}</p>}
                                                    </motion.div>
                                                ))}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {entries.length === 0 && <div className="text-center py-12 text-muted-foreground">Aucun emploi du temps trouvé</div>}
            </Card>
        </div>
    );
}
