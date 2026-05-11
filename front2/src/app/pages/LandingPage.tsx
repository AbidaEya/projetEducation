import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  GraduationCap, BookOpen, Users, Award, BarChart3, Shield,
  ArrowRight, Moon, Sun, Sparkles, Clock, CheckCircle2, Star,
  ChevronDown, Globe, Zap, Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/* ─── Hero gradient orbs ──────────────────────────────────────────────────── */
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-[30%] -right-[20%] w-[800px] h-[800px] rounded-md bg-primary/8 blur-[120px]" />
      <div className="absolute -bottom-[30%] -left-[20%] w-[700px] h-[700px] rounded-full bg-violet-500/6 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[100px]" />
    </div>
  );
}

/* ─── Floating nav bar ────────────────────────────────────────────────────── */
function NavBar({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">EduPlatform</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#stats" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Chiffres</a>
          <a href="#roles" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Rôles</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground">
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all"
          >
            Se connecter
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

/* ─── Feature card ────────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, delay }: {
  icon: React.ComponentType<{ className?: string }>; title: string; description: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      className="group relative p-6 rounded-xl bg-card border border-border/60 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ─── Stat block ──────────────────────────────────────────────────────────── */
function StatBlock({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="text-center"
    >
      <p className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-[13px] text-muted-foreground mt-1.5">{label}</p>
    </motion.div>
  );
}

/* ─── Role card ───────────────────────────────────────────────────────────── */
function RoleCard({ icon: Icon, title, features, color, delay }: {
  icon: React.ComponentType<{ className?: string }>; title: string; features: string[]; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="p-6 rounded-xl bg-card border border-border/60 hover:shadow-md transition-all"
    >
      <div className={`p-3 rounded-xl w-fit mb-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <ul className="space-y-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('edu_dark_mode');
      if (stored !== null) return stored === 'true';
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    if (isAuthenticated && user) navigate(`/dashboard/${user.role}`, { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('edu_dark_mode', String(isDark)); } catch {}
  }, [isDark]);

  const toggleDark = () => setIsDark((v) => !v);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar isDark={isDark} toggleDark={toggleDark} />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <GradientOrbs />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary/8 border border-primary/15 text-primary text-[12px] font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Plateforme éducative nouvelle génération
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Gérez votre établissement{' '}
              <span className="text-gradient">en toute simplicité</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Une plateforme complète pour administrer cours, notes, absences et emplois du temps.
              Conçue pour les administrateurs, enseignants et étudiants.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-[15px] hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-md hover:shadow-primary/30 transition-all"
              >
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-[15px] hover:bg-muted transition-all"
              >
                Découvrir
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="hidden lg:flex items-center justify-center gap-5 mt-16"
          >
            {[
              { icon: Shield, label: 'Sécurisé' },
              { icon: Zap, label: 'Rapide' },
              { icon: Globe, label: 'Accessible' },
            ].map(({ icon: I, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/60 text-[12px] text-muted-foreground">
                <I className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[12px] font-semibold text-primary uppercase tracking-widest mb-3">Fonctionnalités</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Des outils puissants et intuitifs pour gérer efficacement votre établissement éducatif.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={BookOpen} title="Gestion des cours" description="Créez et organisez vos cours, matières et devoirs avec un suivi complet des programmes." delay={0} />
            <FeatureCard icon={Users} title="Gestion des utilisateurs" description="Administrez les profils administrateurs, enseignants et étudiants en un seul endroit." delay={0.1} />
            <FeatureCard icon={Award} title="Notes & Évaluations" description="Système complet de notation avec réclamations, moyennes et bulletins automatisés." delay={0.2} />
            <FeatureCard icon={Clock} title="Emploi du temps" description="Planifiez les sessions de cours avec un calendrier intuitif et des créneaux personnalisables." delay={0.3} />
            <FeatureCard icon={BarChart3} title="Tableaux de bord" description="Visualisez les statistiques clés avec des graphiques interactifs et des rapports détaillés." delay={0.4} />
            <FeatureCard icon={Bell} title="Notifications" description="Restez informé en temps réel grâce aux notifications ciblées par rôle et par groupe." delay={0.5} />
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────── */}
      <section id="stats" className="py-24 px-6 border-y border-border/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          <StatBlock value="500+" label="Étudiants actifs" delay={0} />
          <StatBlock value="50+" label="Enseignants" delay={0.1} />
          <StatBlock value="120+" label="Cours disponibles" delay={0.2} />
          <StatBlock value="99.9%" label="Disponibilité" delay={0.3} />
        </div>
      </section>

      {/* ─── Roles ─────────────────────────────────────────────────────── */}
      <section id="roles" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[12px] font-semibold text-primary uppercase tracking-widest mb-3">Espaces dédiés</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Un portail pour chaque rôle</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Chaque utilisateur dispose d'un espace personnalisé adapté à ses besoins.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RoleCard
              icon={Shield}
              title="Administrateur"
              color="bg-violet-500/10 text-violet-600 dark:text-violet-400"
              features={[
                'Gestion complète des utilisateurs',
                'Configuration des départements et classes',
                'Suivi des demandes et réclamations',
                'Tableaux de bord analytiques',
              ]}
              delay={0}
            />
            <RoleCard
              icon={GraduationCap}
              title="Enseignant"
              color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
              features={[
                'Gestion des cours et devoirs',
                'Notation et évaluation',
                'Suivi des soumissions',
                'Emploi du temps personnalisé',
              ]}
              delay={0.15}
            />
            <RoleCard
              icon={Star}
              title="Étudiant"
              color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              features={[
                'Consultation des cours et notes',
                'Soumission des devoirs',
                'Demandes administratives',
                'Suivi des absences',
              ]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
              Prêt à transformer votre établissement ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez des centaines d'établissements qui font confiance à EduPlatform pour leur gestion quotidienne.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-[15px] hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
            >
              Accéder à la plateforme
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-semibold text-foreground">EduPlatform</span>
          </div>
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} EduPlatform. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
