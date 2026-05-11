import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, GraduationCap, BookOpen, FileText, Calendar, Bell, Award, Building2, Briefcase, Send, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { apiGet } from '../../services/api';
import { StatCard, PageHeader, Card, LoadingState } from '../../components/ui-components';
import { useAuth } from '../../contexts/AuthContext';

type SoumissionsBreakdown = { corrigees?: number; enAttente?: number };
type AbsencesByClasse = { classe?: string; absences?: number };

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [recentDemandes, setRecentDemandes] = useState<any[]>([]);
  const [soumissionsBreakdown, setSoumissionsBreakdown] = useState<SoumissionsBreakdown>({ corrigees: 0, enAttente: 0 });
  const [absencesByClasse, setAbsencesByClasse] = useState<AbsencesByClasse[]>([]);

  useEffect(() => {
    const endpoints = ['etudiants', 'enseignants', 'cours', 'departements', 'absences', 'demandes', 'soumissions', 'notes', 'projets', 'devoirs', 'demandes-stage', 'reclamations'];
    Promise.all(endpoints.map(e => apiGet(`/${e}`).then(d => [e, Array.isArray(d) ? d.length : 0]).catch(() => [e, 0])))
      .then(results => {
        const s: Record<string, number> = {};
        results.forEach(([k, v]) => { s[k as string] = v as number; });
        setStats(s);
      });
    apiGet('/demandes').then(d => setRecentDemandes(Array.isArray(d) ? d.slice(-5).reverse() : [])).catch(() => { });
    apiGet('/dashboard/soumissions-repartition').then(d => setSoumissionsBreakdown((d || {}) as SoumissionsBreakdown)).catch(() => setSoumissionsBreakdown({ corrigees: 0, enAttente: 0 }));
    apiGet('/dashboard/absences-par-classe').then(d => setAbsencesByClasse(Array.isArray(d) ? d.slice(0, 5) : [])).catch(() => setAbsencesByClasse([]));
    setTimeout(() => setLoading(false), 600);
  }, []);

  const corrigees = Number(soumissionsBreakdown.corrigees || 0);
  const enAttente = Number(soumissionsBreakdown.enAttente || 0);
  const soumissionsTotal = corrigees + enAttente;
  const pctCorrigees = soumissionsTotal > 0 ? Math.round((corrigees / soumissionsTotal) * 100) : 0;
  const topAbsences = absencesByClasse.length > 0
    ? [...absencesByClasse].sort((a, b) => Number(b.absences || 0) - Number(a.absences || 0))[0]
    : null;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bonjour, ${user?.firstName} 👋`}
        subtitle="Voici un aperçu de votre plateforme éducative"
        icon={undefined}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Étudiants" value={stats.etudiants || 0} icon={Users} color="blue" onClick={() => navigate('/dashboard/admin/etudiants')} />
        <StatCard label="Enseignants" value={stats.enseignants || 0} icon={GraduationCap} color="violet" onClick={() => navigate('/dashboard/admin/enseignants')} />
        <StatCard label="Cours" value={stats.cours || 0} icon={BookOpen} color="emerald" onClick={() => navigate('/dashboard/admin/cours')} />
        <StatCard label="Départements" value={stats.departements || 0} icon={Building2} color="amber" onClick={() => navigate('/dashboard/admin/departements')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Absences" value={stats.absences || 0} icon={Calendar} color="rose" onClick={() => navigate('/dashboard/admin/absences')} />
        <StatCard label="Demandes" value={stats.demandes || 0} icon={FileText} color="cyan" onClick={() => navigate('/dashboard/admin/demandes')} />
        <StatCard label="Soumissions" value={stats.soumissions || 0} icon={Send} color="indigo" onClick={() => navigate('/dashboard/admin/soumissions')} />
        <StatCard label="Notes" value={stats.notes || 0} icon={Award} color="emerald" onClick={() => navigate('/dashboard/admin/notes')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Qualité de correction</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">Soumissions corrigées</span>
              <span className="font-semibold text-foreground tabular-nums">{corrigees} / {soumissionsTotal}</span>
            </div>
            <div className="h-1.5 rounded-md bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pctCorrigees}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Corrigées: {corrigees}</span>
              <span>En attente: {enAttente}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Absences par classe</h3>
          {absencesByClasse.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-4 text-center">Aucune donnée disponible</p>
          ) : (
            <div className="space-y-3">
              {absencesByClasse.map((item, idx) => {
                const value = Number(item.absences || 0);
                const max = Math.max(...absencesByClasse.map(x => Number(x.absences || 0)), 1);
                const width = Math.max(8, Math.round((value / max) * 100));
                return (
                  <div key={`${item.classe || 'classe'}-${idx}`}>
                    <div className="flex items-center justify-between text-[13px] mb-1">
                      <span className="text-foreground">{item.classe || `Classe ${idx + 1}`}</span>
                      <span className="text-muted-foreground tabular-nums">{value}</span>
                    </div>
                    <div className="h-1.5 rounded-md bg-muted overflow-hidden">
                      <div className="h-full bg-rose-500/70 rounded-full transition-all duration-500" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
              {topAbsences && (
                <p className="text-xs text-muted-foreground pt-1">
                  Classe la plus impactée: <span className="font-medium text-foreground">{topAbsences.classe || 'N/A'}</span>
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Demandes stage', icon: Briefcase, to: '/dashboard/admin/demandes-stage', color: 'text-violet-500' },
              { label: 'Réclamations', icon: AlertTriangle, to: '/dashboard/admin/reclamations', color: 'text-amber-500' },
              { label: 'Justifications', icon: ClipboardCheck, to: '/dashboard/admin/justifications', color: 'text-emerald-500' },
              { label: 'Notifications', icon: Bell, to: '/dashboard/admin/notifications-mgmt', color: 'text-blue-500' },
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.to)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all text-left group">
                <a.icon className={`w-4 h-4 ${a.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[13px] font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Demandes */}
        <Card>
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Dernières demandes</h3>
          <div className="space-y-1.5">
            {recentDemandes.length === 0 ? (
              <p className="text-[13px] text-muted-foreground py-4 text-center">Aucune demande récente</p>
            ) : recentDemandes.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{d.type || 'Demande'}</p>
                  <p className="text-xs text-muted-foreground">{d.etudiant?.firstName} {d.etudiant?.lastName}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ring-1 ${d.statut === 'APPROUVEE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' :
                  d.statut === 'REJETEE' ? 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20' :
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20'
                  }`}>{d.statut?.replace(/_/g, ' ') || 'EN ATTENTE'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
