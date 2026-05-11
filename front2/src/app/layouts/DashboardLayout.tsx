import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, FileText, Calendar,
  Bell, User, LogOut, ChevronLeft, Moon, Sun, Menu, X,
  Building2, FolderOpen, ClipboardCheck, MessageSquare, AlertTriangle,
  Send, Briefcase, Award, Shield, Clock,
  BellRing, NotebookPen, Search, Sparkles, ChevronDown,
  Command,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getNavItemsForRole } from '../routes';
import { apiGet, apiPut } from '../services/api';

interface TopbarNotification {
  id: number;
  titre?: string;
  message?: string;
  dateEnvoi?: string | null;
  createdAt?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Icon mapping — one central source of truth for sidebar icons
   ═══════════════════════════════════════════════════════════════════════════ */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard, Profil: User, Notifications: BellRing,
  Utilisateurs: Users, Admins: Shield, Enseignants: GraduationCap, Étudiants: Users,
  Départements: Building2, Groupes: Users, Classes: BookOpen, Cours: BookOpen,
  Matières: NotebookPen, Projets: FolderOpen,
  Devoirs: FileText, Soumissions: Send, Notes: Award,
  Absences: Calendar, Justifications: ClipboardCheck, 'Emploi du temps': Clock,
  Demandes: FileText, 'Demandes stage': Briefcase, Réclamations: AlertTriangle,
  'Récl. Notes': AlertTriangle, Commentaires: MessageSquare,
  'Mes Cours': BookOpen, 'Mes Classes': BookOpen, Évaluations: ClipboardCheck,
  'Mes Soumissions': Send, 'Mes Notes': Award, 'Mes Absences': Calendar,
  'Mes Demandes': FileText, Stages: Briefcase,
};

/* ═══════════════════════════════════════════════════════════════════════════
   Dark mode hook
   ═══════════════════════════════════════════════════════════════════════════ */
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('edu_dark_mode');
      if (stored !== null) return stored === 'true';
    } catch { /* SSR / restricted storage */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('edu_dark_mode', String(isDark)); } catch { /* noop */ }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((v) => !v), []);
  return { isDark, toggle };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tooltip — minimal hover tooltip for collapsed icons
   ═══════════════════════════════════════════════════════════════════════════ */
function Tooltip({ children, label, show }: { children: React.ReactNode; label: string; show: boolean }) {
  const [hovered, setHovered] = useState(false);
  if (!show) return <>{children}</>;
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 rounded-md bg-foreground text-background text-[11px] font-medium whitespace-nowrap z-[100] shadow-lg pointer-events-none"
          >
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Command palette (Cmd+K) — quick nav search overlay
   ═══════════════════════════════════════════════════════════════════════════ */
function CommandPalette({
  open, onClose, navItems, navigate,
}: {
  open: boolean;
  onClose: () => void;
  navItems: { label: string; to: string; group?: string }[];
  navigate: (to: string) => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return navItems;
    const q = query.toLowerCase();
    return navItems.filter(i => i.label.toLowerCase().includes(q) || (i.group || '').toLowerCase().includes(q));
  }, [query, navItems]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une page…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Enter' && filtered.length > 0) {
                  navigate(`/dashboard/${filtered[0].to}`);
                  onClose();
                }
              }}
            />
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-muted-foreground bg-muted/80 border border-border/40">ESC</kbd>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Aucun résultat</p>
            ) : (
              filtered.map((item, i) => {
                const Icon = iconMap[item.label] || FileText;
                return (
                  <button
                    key={i}
                    onClick={() => { navigate(`/dashboard/${item.to}`); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/60 transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[13px] font-medium text-foreground">{item.label}</span>
                    {item.group && <span className="ml-auto text-[11px] text-muted-foreground/50">{item.group}</span>}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Layout Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [latestNotifications, setLatestNotifications] = useState<TopbarNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const notifPanelRef = useRef<HTMLDivElement | null>(null);
  const profilePanelRef = useRef<HTMLDivElement | null>(null);

  /* ── Sidebar scroll persistence ── */
  const saveSidebarScroll = useCallback(() => {
    try {
      const desktopTop = desktopNavRef.current?.scrollTop ?? 0;
      const mobileTop = mobileNavRef.current?.scrollTop ?? 0;
      const scrollTop = mobileMenuOpen ? mobileTop : desktopTop;
      sessionStorage.setItem('edu_sidebar_scroll', String(scrollTop));
    } catch { }
  }, [mobileMenuOpen]);

  const restoreSidebarScroll = useCallback(() => {
    try {
      const saved = Number(sessionStorage.getItem('edu_sidebar_scroll') || '0');
      if (desktopNavRef.current) desktopNavRef.current.scrollTop = saved;
      if (mobileNavRef.current) mobileNavRef.current.scrollTop = saved;
    } catch { }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(restoreSidebarScroll);
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, restoreSidebarScroll]);

  /* ── Cmd+K listener ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Notification fetch ── */
  const refreshNotificationPreview = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    setNotifLoading(true);
    try {
      const [latest, unread] = await Promise.all([
        apiGet<TopbarNotification[]>(`/notifications/user/${user.id}/latest?limit=5`).catch(() => []),
        apiGet<TopbarNotification[]>(`/notifications/user/${user.id}/unread`).catch(() => []),
      ]);
      setLatestNotifications(Array.isArray(latest) ? latest : []);
      setUnreadCount(Array.isArray(unread) ? unread.length : 0);
    } finally {
      setNotifLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    refreshNotificationPreview();
  }, [user, location.pathname, refreshNotificationPreview]);

  /* ── Click-outside handlers ── */
  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (notifOpen && !notifPanelRef.current?.contains(event.target as Node)) setNotifOpen(false);
      if (profileOpen && !profilePanelRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [notifOpen, profileOpen]);

  const openFullNotifications = useCallback(() => {
    setNotifOpen(false);
    navigate(user?.role === 'enseignant' ? '/dashboard/enseignant/notifications' : '/dashboard/etudiant/notifications');
  }, [navigate, user?.role]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    await apiPut(`/notifications/user/${user.id}/read-all`, {});
    await refreshNotificationPreview();
  }, [refreshNotificationPreview, user]);

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  const navItems = user ? getNavItemsForRole(user.role) : [];

  // Group items
  const groups: { group: string; items: typeof navItems }[] = [];
  navItems.forEach((item) => {
    const g = item.group || '';
    const existing = groups.find((x) => x.group === g);
    if (existing) existing.items.push(item);
    else groups.push({ group: g, items: [item] });
  });

  // Filtered for sidebar search
  const filteredGroups = searchQuery
    ? groups.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase())) })).filter((g) => g.items.length > 0)
    : groups;

  const isActive = (to: string) => location.pathname === `/dashboard/${to}`;

  const currentItem = navItems.find((i) => isActive(i.to));
  const pageTitle = currentItem?.label || 'Dashboard';

  /* ── Role theming ── */
  const roleConfig: Record<string, { badge: string; gradient: string; accent: string; label: string }> = {
    admin: {
      badge: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
      gradient: 'from-red-500 to-rose-600',
      accent: 'text-red-500',
      label: 'Administrateur',
    },
    enseignant: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
      gradient: 'from-amber-500 to-orange-600',
      accent: 'text-amber-500',
      label: 'Enseignant',
    },
    etudiant: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-600',
      accent: 'text-emerald-500',
      label: 'Étudiant',
    },
  };
  const rc = roleConfig[user?.role || 'etudiant'];

  /* ════════════════════════════════════════════════════════════════════════
     Sidebar nav button
     ════════════════════════════════════════════════════════════════════════ */
  const NavButton = ({ item, index, onNavigate }: { item: (typeof navItems)[0]; index: number; onNavigate?: () => void }) => {
    const Icon = iconMap[item.label] || FileText;
    const active = isActive(item.to);
    return (
      <Tooltip label={item.label} show={sidebarCollapsed}>
        <motion.button
          key={index}
          whileTap={{ scale: 0.97 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { saveSidebarScroll(); navigate(`/dashboard/${item.to}`); onNavigate?.(); }}
          className={`group w-full flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-200 relative
            ${sidebarCollapsed ? 'px-0 py-2 justify-center' : 'px-3 py-[7px]'}
            ${active
              ? 'bg-primary/[0.08] text-primary dark:bg-primary/[0.12]'
              : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
        >
          {/* Active indicator — animated left bar */}
          {active && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary"
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            />
          )}
          <div className={`relative flex items-center justify-center flex-shrink-0 ${sidebarCollapsed ? 'w-5 h-5' : ''}`}>
            <Icon className={`w-[17px] h-[17px] transition-colors duration-200 ${active ? 'text-primary' : 'group-hover:text-foreground'}`} />
            {active && (
              <motion.div
                layoutId="icon-glow"
                className="absolute inset-0 rounded-full bg-primary/20 blur-[6px] -z-10"
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              />
            )}
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </Tooltip>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════
     Sidebar content — shared between desktop & mobile
     ════════════════════════════════════════════════════════════════════════ */
  const SidebarContent = ({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) => {
    const expanded = mobile || !sidebarCollapsed;
    return (
      <>
        {/* ── Brand header ── */}
        <div className={`flex items-center gap-3 ${sidebarCollapsed && !mobile ? 'justify-center px-2 pt-5 pb-3' : 'px-4 pt-5 pb-3'}`}>
          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/25"
          >
            <Sparkles className="w-[18px] h-[18px] text-white" />
          </motion.div>
          {expanded && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="min-w-0">
              <p className="text-[14px] font-bold text-foreground tracking-tight leading-none">EduPlatform</p>
              <p className="text-[10px] text-muted-foreground/70 font-medium mt-0.5">Portail éducatif</p>
            </motion.div>
          )}
        </div>

        {/* ── User card ── */}
        <div className={`mx-2 mb-1 ${sidebarCollapsed && !mobile ? 'px-0' : ''}`}>
          <div className={`flex items-center gap-2.5 rounded-lg transition-colors
            ${sidebarCollapsed && !mobile ? 'justify-center p-2' : 'p-2.5 hover:bg-muted/40'}`}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rc.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-bold text-[11px]">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            {expanded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-foreground truncate leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground/70 capitalize truncate">{rc.label}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Search / Cmd+K trigger ── */}
        {expanded && (
          <div className="px-3 pb-1">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-[6px] text-xs rounded-lg bg-muted/40 border border-border/40 text-muted-foreground/60 hover:bg-muted/60 hover:text-muted-foreground hover:border-border/60 transition-all"
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-px rounded text-[9px] font-mono font-medium bg-background/80 border border-border/40">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          </div>
        )}
        {!expanded && (
          <div className="flex justify-center pb-1">
            <Tooltip label="Rechercher (⌘K)" show>
              <button
                onClick={() => setCmdOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
              >
                <Search className="w-[17px] h-[17px]" />
              </button>
            </Tooltip>
          </div>
        )}

        {/* ── Navigation groups ── */}
        <nav ref={mobile ? mobileNavRef : desktopNavRef} className="flex-1 overflow-y-auto px-2 py-1 space-y-px sidebar-scroll">
          {filteredGroups.map((g, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
              {expanded && g.group && (
                <div className="flex items-center gap-2 mt-4 mb-1 px-3">
                  <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em] leading-none">
                    {g.group}
                  </p>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
              )}
              {!expanded && g.group && gi > 0 && (
                <div className="border-t border-border/30 my-2 mx-3" />
              )}
              {g.items.map((item, idx) => {
                if (mobile) {
                  const Icon = iconMap[item.label] || FileText;
                  const active = isActive(item.to);
                  return (
                    <button
                      key={idx}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { saveSidebarScroll(); navigate(`/dashboard/${item.to}`); onNavigate?.(); }}
                      className={`w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all relative
                        ${active
                          ? 'bg-primary/[0.08] text-primary'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                      )}
                      <Icon className={`w-[17px] h-[17px] ${active ? 'text-primary' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                }
                return <NavButton key={gi * 100 + idx} item={item} index={gi * 100 + idx} onNavigate={onNavigate} />;
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom actions ── */}
        <div className={`border-t border-border/30 ${expanded ? 'px-2 py-2 space-y-0.5' : 'px-2 py-2 flex flex-col items-center gap-1'}`}>
          {expanded ? (
            <>
              <button
                onClick={toggleDark}
                className="w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all"
              >
                <div className="relative w-[17px] h-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Sun className="w-[17px] h-[17px] text-amber-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Moon className="w-[17px] h-[17px] text-indigo-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <LogOut className="w-[17px] h-[17px]" />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Tooltip label={isDark ? 'Mode clair' : 'Mode sombre'} show>
                <button onClick={toggleDark} className="p-2 rounded-lg text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all">
                  {isDark ? <Sun className="w-[17px] h-[17px] text-amber-500" /> : <Moon className="w-[17px] h-[17px] text-indigo-400" />}
                </button>
              </Tooltip>
              <Tooltip label="Déconnexion" show>
                <button onClick={handleLogout} className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-all">
                  <LogOut className="w-[17px] h-[17px]" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">

      {/* ═══ Cmd+K Palette ═══ */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} navItems={navItems} navigate={navigate} />

      {/* ═══ Desktop Sidebar ═══ */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="hidden lg:flex flex-col bg-card/80 backdrop-blur-xl border-r border-border/40 relative z-30 select-none"
      >
        <SidebarContent />

        {/* Collapse toggle — sleek pill button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border shadow-sm transition-all z-50 hover:scale-110 active:scale-95"
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className="w-3 h-3" />
          </motion.div>
        </button>
      </motion.aside>

      {/* ═══ Mobile Sidebar ═══ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border/40 z-50 flex flex-col lg:hidden shadow-2xl shadow-black/20"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent mobile onNavigate={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Main Content Area ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ═══ Top Navbar — Premium glassmorphism ═══ */}
        <header className="h-[52px] bg-card/60 backdrop-blur-2xl border-b border-border/40 flex items-center justify-between px-3 lg:px-5 sticky top-0 z-20">

          {/* Left — mobile menu + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-muted/60 rounded-lg transition-all"
            >
              <Menu className="w-[18px] h-[18px] text-muted-foreground" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 min-w-0">
              {currentItem?.group && (
                <>
                  <span className="hidden sm:inline text-[11px] text-muted-foreground/50 font-medium truncate">{currentItem.group}</span>
                  <ChevronLeft className="hidden sm:block w-3 h-3 text-muted-foreground/30 rotate-180" />
                </>
              )}
              <h1 className="text-[13px] font-semibold text-foreground truncate">{pageTitle}</h1>
            </div>
          </div>

          {/* Center — search bar (desktop only) */}
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-[5px] rounded-lg bg-muted/30 border border-border/30 text-muted-foreground/50 hover:bg-muted/50 hover:border-border/50 hover:text-muted-foreground transition-all max-w-[280px] w-full mx-4"
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs flex-1 text-left">Rechercher…</span>
            <kbd className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[9px] font-mono font-medium bg-background/60 border border-border/30">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Right — actions */}
          <div className="flex items-center gap-0.5">

            {/* Dark mode toggle — animated pill */}
            <button
              onClick={toggleDark}
              className="hidden sm:flex p-1.5 hover:bg-muted/60 rounded-lg transition-all relative overflow-hidden"
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun className="w-4 h-4 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notifications — bell with animated badge */}
            {user?.role === 'admin' ? (
              <button
                onClick={() => navigate('/dashboard/home')}
                className="p-1.5 hover:bg-muted/60 rounded-lg transition-all"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="relative" ref={notifPanelRef}>
                <button
                  onClick={() => { setNotifOpen(v => !v); if (!notifOpen) refreshNotificationPreview(); }}
                  className="p-1.5 hover:bg-muted/60 rounded-lg transition-all relative group"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] leading-4 text-center font-bold shadow-md shadow-primary/30"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </button>

                {/* Notification dropdown */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-1.5 w-80 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/8 dark:shadow-black/25 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-foreground">Notifications</p>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-px rounded-md text-[10px] font-bold bg-primary/10 text-primary">{unreadCount}</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllNotificationsRead} className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">Tout marquer lu</button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifLoading ? (
                          <div className="px-4 py-8 text-center">
                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                          </div>
                        ) : latestNotifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2">
                              <Bell className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                            <p className="text-xs text-muted-foreground">Aucune notification</p>
                          </div>
                        ) : (
                          latestNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={openFullNotifications}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted/40 border-b border-border/20 last:border-b-0 transition-colors group"
                            >
                              {notification.titre && <p className="text-[12px] font-medium text-foreground truncate group-hover:text-primary transition-colors">{notification.titre}</p>}
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{notification.message || '—'}</p>
                              <p className="text-[10px] text-muted-foreground/50 mt-1">
                                {notification.dateEnvoi
                                  ? new Date(notification.dateEnvoi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                                  : notification.createdAt
                                    ? new Date(notification.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                                    : ''}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                      <button
                        onClick={openFullNotifications}
                        className="w-full px-4 py-2 text-[12px] font-medium text-primary hover:bg-muted/40 border-t border-border/30 transition-colors"
                      >
                        Voir toutes les notifications →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-border/40 mx-1 hidden sm:block" />

            {/* Profile dropdown */}
            <div className="relative" ref={profilePanelRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 p-1 pr-2 hover:bg-muted/60 rounded-lg transition-all group"
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${rc.gradient} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-bold text-[10px]">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground/60 hidden sm:block group-hover:text-muted-foreground transition-colors" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1.5 w-56 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/8 dark:shadow-black/25 z-50 overflow-hidden"
                  >
                    {/* Profile header */}
                    <div className="px-3 py-3 border-b border-border/30">
                      <p className="text-[13px] font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user?.email || rc.label}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        Mon profil
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/dashboard/notifications'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Notifications
                      </button>
                    </div>
                    <div className="border-t border-border/30 py-1">
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ═══ Page Content ═══ */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
