import { useState, useEffect } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { apiGet } from '../../services/api';
import { PageHeader, Card, Toolbar, LoadingState, EmptyState } from '../../components/ui-components';

interface Cours { id: number; nomCours: string; description?: string | null; coefficient?: number | null; volumeHoraire?: number | null; ressourcePath?: string | null; resourcePath?: string | null; enseignant?: { id: number; firstName?: string; lastName?: string } | null; departement?: { id: number; nom?: string; nomDepartement?: string } | null; }

export default function EtudiantCours() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchData = async () => { setLoading(true); try { const d = await apiGet<Cours[]>('/cours'); setCours(Array.isArray(d) ? d : []); } catch { } finally { setLoading(false); } };
    useEffect(() => { fetchData(); }, []);

    const filtered = cours.filter(c => !search || c.nomCours?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()) || c.enseignant?.firstName?.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <LoadingState message="Chargement des cours…" />;
    return (
        <div className="space-y-4">
            <PageHeader title="Mes Cours" icon={BookOpen} badge={{ label: `${filtered.length}`, variant: 'info' }} />
            <Toolbar searchValue={search} onSearch={setSearch} onRefresh={fetchData} loading={loading} />
            {filtered.length === 0 ? <EmptyState icon={BookOpen} title="Aucun cours trouvé" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(c => {
                        const resPath = c.ressourcePath || c.resourcePath;
                        return (
                            <Card key={c.id} className="hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-foreground text-base">📚 {c.nomCours}</h3>
                                    {c.coefficient != null && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">Coef. {c.coefficient}</span>}
                                </div>
                                {c.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{c.description}</p>}
                                <div className="space-y-1 text-sm">
                                    {c.enseignant && <p className="text-muted-foreground">👨‍🏫 {c.enseignant.firstName} {c.enseignant.lastName}</p>}
                                    {c.volumeHoraire != null && <p className="text-muted-foreground">⏱️ {c.volumeHoraire}h</p>}
                                    {c.departement && <p className="text-muted-foreground">🏛️ {c.departement.nom || c.departement.nomDepartement}</p>}
                                </div>
                                {resPath && <a href={`/api/files/download?path=${encodeURIComponent(resPath)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20"><Download className="w-3.5 h-3.5" />Ressource</a>}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
