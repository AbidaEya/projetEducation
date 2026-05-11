import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Loader2, Moon, Sun, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from '../components/ui-components';

type UserRole = 'admin' | 'enseignant' | 'etudiant';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@education.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('edu_dark_mode');
      if (stored !== null) return stored === 'true';
    } catch { }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    if (isAuthenticated && user) navigate(`/dashboard/${user.role}`, { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('edu_dark_mode', String(isDark)); } catch { }
  }, [isDark]);

  const roles: Array<{ id: UserRole; label: string; icon: string }> = [
    { id: 'admin', label: 'Admin', icon: '🛡️' },
    { id: 'enseignant', label: 'Enseignant', icon: '👨‍🏫' },
    { id: 'etudiant', label: 'Étudiant', icon: '🎓' },
  ];

  const credentials: Record<UserRole, { email: string; password: string }> = {
    admin: { email: 'admin@education.com', password: 'admin123' },
    enseignant: { email: 'jean.dupont@education.com', password: 'pass123' },
    etudiant: { email: 'pierre.bernard@education.com', password: 'pass123' },
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password, selectedRole);
      if (success) navigate(`/dashboard/${selectedRole}`);
      else setError('Email ou mot de passe incorrect');
    } catch { setError('Une erreur est survenue'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 h-16 z-20">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px]">
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </Link>
        <button
          type="button"
          onClick={() => setIsDark(v => !v)}
          className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground"
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[30%] w-[700px] h-[700px] rounded-md bg-primary/6 blur-[100px]" />
        <div className="absolute -bottom-[40%] -left-[30%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative w-full max-w-[420px]">
        <div className="bg-card border border-border/60 rounded-lg shadow-xl p-7">
          {/* Header */}
          <div className="text-center mb-7">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
              className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center ring-1 ring-primary/15"
            >
              <Sparkles className="w-7 h-7 text-primary" />
            </motion.div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Portail Éducatif</h1>
            <p className="text-[13px] text-muted-foreground mt-1">Connectez-vous pour accéder à votre espace</p>
          </div>

          {/* Role tabs */}
          <div className="flex gap-0.5 p-1 rounded-lg bg-muted/50 border border-border/50 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[13px] font-medium transition-all
                  ${selectedRole === role.id ? 'bg-card text-foreground shadow-sm border border-border/60' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="text-sm">{role.icon}</span>
                <span className="hidden sm:inline">{role.label}</span>
              </button>
            ))}
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-3 py-2.5 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-2.5 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-[13px] hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Connexion…' : 'Se connecter'}
            </motion.button>
          </form>

          {/* Demo info */}
          <div className="mt-5 p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-[11px] font-medium text-muted-foreground text-center">
              💡 Les identifiants de démo sont pré-remplis — cliquez sur un rôle pour changer
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
