import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, FileText, Send, ClipboardCheck, Clock, Bell, Users } from 'lucide-react';
import { apiGet } from '../../services/api';
import { StatCard, PageHeader, Card, LoadingState } from '../../components/ui-components';
import { useAuth } from '../../contexts/AuthContext';

export default function EnseignantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ cours: 0, devoirs: 0, soumissions: 0, pending: 0 });
  const [recentSoumissions, setRecentSoumissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGet(`/cours/enseignant/${user.id}`).catch(() => []),
      apiGet('/devoirs').catch(() => []),
      apiGet('/soumissions/all').catch(() => []),
    ]).then(([cours, devoirs, soumissions]) => {
      const c = Array.isArray(cours) ? cours : [];
      const d = Array.isArray(devoirs) ? devoirs : [];
      const s = Array.isArray(soumissions) ? soumissions : [];
      const pending = s.filter((x: any) => !x.evaluated);
      setStats({ cours: c.length, devoirs: d.length, soumissions: s.length, pending: pending.length });
      setRecentSoumissions(s.slice(-5).reverse());
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader title={`Bonjour, ${user?.firstName} 👋`} subtitle="Votre espace enseignant" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Mes Cours" value={stats.cours} icon={BookOpen} color="blue" onClick={() => navigate('/dashboard/enseignant/cours')} />
        <StatCard label="Devoirs" value={stats.devoirs} icon={FileText} color="violet" onClick={() => navigate('/dashboard/enseignant/devoirs')} />
        <StatCard label="Soumissions" value={stats.soumissions} icon={Send} color="emerald" subtitle={`${stats.pending} en attente`} onClick={() => navigate('/dashboard/enseignant/evaluations')} />
        <StatCard label="À évaluer" value={stats.pending} icon={ClipboardCheck} color="amber" onClick={() => navigate('/dashboard/enseignant/evaluations')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Évaluations', icon: ClipboardCheck, to: '/dashboard/enseignant/evaluations', color: 'text-amber-500' },
              { label: 'Emploi du temps', icon: Clock, to: '/dashboard/enseignant/emploi-du-temps', color: 'text-blue-500' },
              { label: 'Récl. Notes', icon: FileText, to: '/dashboard/enseignant/reclamations-notes', color: 'text-red-500' },
              { label: 'Notifications', icon: Bell, to: '/dashboard/enseignant/notifications', color: 'text-violet-500' },
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.to)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all text-left group">
                <a.icon className={`w-4 h-4 ${a.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[13px] font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Dernières soumissions</h3>
          <div className="space-y-2">
            {recentSoumissions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune soumission</p>
            ) : recentSoumissions.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{s.etudiant?.firstName} {s.etudiant?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{s.devoir?.titre || 'Devoir'}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ring-1 ${s.evaluated ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20'
                  }`}>{s.evaluated ? `${s.note}/20` : 'À évaluer'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
