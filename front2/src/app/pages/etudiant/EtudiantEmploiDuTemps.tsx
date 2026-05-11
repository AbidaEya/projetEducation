import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet } from '../../services/api';
import { PageHeader, Card, LoadingState, Alert } from '../../components/ui-components';

interface Cours { id: number; nomCours: string; departement?: { id: number } | null; }
interface Slot {
    id: number;
    coursId?: number;
    jourSemaine?: string;
    jour?: string;
    heureDebut?: string;
    heureFin?: string;
    salle?: string;
    coursNom?: string;
    enseignantNom?: string;
    cours?: { id?: number; nomCours?: string; enseignant?: { firstName?: string; lastName?: string } | null } | null;
}
interface Student { id: number; departement?: { id: number } | null; }

const DEFAULT_TIME_SLOTS = ['08:00-09:30', '09:45-11:15', '11:30-13:00', '14:00-15:30', '15:45-17:15', '17:30-19:00'];
const DAY_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAY_COLORS: Record<string, string> = { Lundi: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300', Mardi: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300', Mercredi: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300', Jeudi: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300', Vendredi: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300', Samedi: 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300' };
const normalizeDay = (d: string) => { const l = d.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return DAY_ORDER.find(day => day.toLowerCase() === l) || d; };
const toHHmm = (v?: string) => (v ? String(v).substring(0, 5) : '');

export default function EtudiantEmploiDuTemps() {
    const { user } = useAuth();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!user) return; setLoading(true); setError('');
        try {
            let courses: Cours[] = [];
            try {
                const student = await apiGet<Student>(`/etudiants/${user.id}`);
                if (student?.departement?.id) { courses = await apiGet<Cours[]>(`/cours/departement/${student.departement.id}`).catch(() => []); }
            } catch { }
            if (courses.length === 0) { courses = await apiGet<Cours[]>('/cours').catch(() => []); }
            if (!Array.isArray(courses)) courses = [];

            const allowedCourseIds = new Set(courses.map(c => c.id));
            const all = await apiGet<Slot[]>('/emploi-du-temps').catch(() => []);
            const allSlots = (Array.isArray(all) ? all : [])
                .filter(s => {
                    const id = s.coursId ?? s.cours?.id;
                    return typeof id === 'number' ? allowedCourseIds.has(id) : false;
                })
                .map(s => {
                    const enseignantFirst = s.cours?.enseignant?.firstName;
                    const enseignantLast = s.cours?.enseignant?.lastName;
                    return {
                        ...s,
                        coursId: s.coursId ?? s.cours?.id,
                        coursNom: s.coursNom ?? s.cours?.nomCours,
                        enseignantNom: s.enseignantNom ?? [enseignantFirst, enseignantLast].filter(Boolean).join(' '),
                        jourSemaine: s.jourSemaine ?? s.jour,
                        heureDebut: toHHmm(s.heureDebut),
                        heureFin: toHHmm(s.heureFin),
                    };
                });

            setSlots(allSlots);
        } catch { setError('Erreur de chargement'); } finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const days = useMemo(() => {
        const unique = Array.from(new Set(slots.map(s => normalizeDay(s.jourSemaine || s.jour || '')).filter(Boolean)));
        if (unique.length === 0) return DAY_ORDER.slice(0, 6);
        const ordered = DAY_ORDER.filter(d => unique.includes(d));
        const extras = unique.filter(d => !DAY_ORDER.includes(d));
        return [...ordered, ...extras];
    }, [slots]);

    const timeSlots = useMemo(() => {
        const unique = Array.from(new Set(
            slots
                .map(s => {
                    const start = toHHmm(s.heureDebut);
                    const end = toHHmm(s.heureFin);
                    return start && end ? `${start}-${end}` : '';
                })
                .filter(Boolean)
        ));
        if (unique.length === 0) return DEFAULT_TIME_SLOTS;
        return unique.sort((a, b) => a.localeCompare(b));
    }, [slots]);

    const grid = useMemo(() => {
        const map: Record<string, Record<string, Slot[]>> = {};
        days.forEach(d => { map[d] = {}; timeSlots.forEach(t => { map[d][t] = []; }); });
        slots.forEach(s => {
            const dayRaw = s.jourSemaine || s.jour;
            if (!dayRaw || !s.heureDebut || !s.heureFin) return;
            const day = normalizeDay(dayRaw);
            const time = `${toHHmm(s.heureDebut)}-${toHHmm(s.heureFin)}`;
            if (map[day]?.[time]) map[day][time].push(s);
        });
        return map;
    }, [slots, days, timeSlots]);

    if (loading) return <LoadingState message="Chargement de l'emploi du temps…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mon Emploi du Temps" icon={Calendar} badge={{ label: `${slots.length} séances`, variant: 'info' }} />
            {error && <Alert type="error" message={error} />}

            <Card padding={false} className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead><tr><th className="p-2 bg-muted/50 border-b border-r border-border/60 text-muted-foreground font-medium text-left w-[120px]">Heure</th>{days.map(d => <th key={d} className="p-2 bg-muted/50 border-b border-r border-border/60 text-foreground font-semibold text-center">{d}</th>)}</tr></thead>
                    <tbody>{timeSlots.map(time => (
                        <tr key={time}>
                            <td className="p-2 border-b border-r border-border/60 text-muted-foreground font-mono text-xs whitespace-nowrap">{time}</td>
                            {days.map(day => {
                                const items = grid[day]?.[time] || [];
                                return (
                                    <td key={day} className="p-1 border-b border-r border-border/60 align-top min-w-[120px]">
                                        {items.map((s, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`p-1.5 rounded-lg text-xs border mb-1 ${DAY_COLORS[day] || 'bg-muted border-border/60 text-foreground'}`}>
                                                <p className="font-semibold truncate">{s.coursNom || '—'}</p>
                                                {s.salle && <p className="opacity-80">📍 {s.salle}</p>}
                                                {s.enseignantNom && <p className="opacity-80">👨‍🏫 {s.enseignantNom}</p>}
                                            </motion.div>
                                        ))}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}</tbody>
                </table>
            </Card>
        </div>
    );
}
