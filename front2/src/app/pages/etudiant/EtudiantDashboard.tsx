import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, FileText, Award, Calendar, Send, Clock, Briefcase, AlertTriangle } from 'lucide-react';
import { apiGet } from '../../services/api';
import { StatCard, PageHeader, Card, LoadingState } from '../../components/ui-components';
import { useAuth } from '../../contexts/AuthContext';

export default function EtudiantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ cours: 0, devoirs: 0, notes: 0, absences: 0, moyenne: '—' });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGet('/cours').catch(() => []),
      apiGet('/devoirs').catch(() => []),
      apiGet('/notes/all').catch(() => []),
      apiGet(`/absences/etudiant/${user.id}`).catch(() => []),
    ]).then(([cours, devoirs, notes, absences]) => {
      const c = Array.isArray(cours) ? cours : [];
      const d = Array.isArray(devoirs) ? devoirs : [];
      const n = Array.isArray(notes) ? notes.filter((x: any) => x.etudiant?.id === user.id) : [];
      const a = Array.isArray(absences) ? absences : [];
      const avg = n.length > 0 ? (n.reduce((s: number, x: any) => s + (x.valeur || 0), 0) / n.length).toFixed(2) : '—';
      setStats({ cours: c.length, devoirs: d.length, notes: n.length, absences: a.length, moyenne: avg });
      setRecentNotes(n.slice(-5).reverse());
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader title={`Bonjour, ${user?.firstName} 👋`} subtitle="Votre espace étudiant" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cours" value={stats.cours} icon={BookOpen} color="blue" onClick={() => navigate('/dashboard/etudiant/cours')} />
        <StatCard label="Devoirs" value={stats.devoirs} icon={FileText} color="violet" onClick={() => navigate('/dashboard/etudiant/devoirs')} />
        <StatCard label="Moyenne" value={stats.moyenne} icon={Award} color="emerald" subtitle={`${stats.notes} notes`} onClick={() => navigate('/dashboard/etudiant/notes')} />
        <StatCard label="Absences" value={stats.absences} icon={Calendar} color="rose" onClick={() => navigate('/dashboard/etudiant/absences')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Accès rapide</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Soumissions', icon: Send, to: '/dashboard/etudiant/soumissions', color: 'text-blue-500' },
              { label: 'Emploi du temps', icon: Clock, to: '/dashboard/etudiant/emploi-du-temps', color: 'text-emerald-500' },
              { label: 'Demandes', icon: FileText, to: '/dashboard/etudiant/demandes', color: 'text-violet-500' },
              { label: 'Stages', icon: Briefcase, to: '/dashboard/etudiant/demandes-stage', color: 'text-amber-500' },
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.to)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all text-left group">
                <a.icon className={`w-4 h-4 ${a.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[13px] font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Dernières notes</h3>
          <div className="space-y-2">
            {recentNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune note</p>
            ) : recentNotes.map((n: any) => (
              <div key={n.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.matiere?.nomMatiere || 'Matière'}</p>
                  <p className="text-xs text-muted-foreground">{n.type || 'Note'}</p>
                </div>
                <span className={`text-sm font-bold ${(n.valeur || 0) >= 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {n.valeur}/20
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
