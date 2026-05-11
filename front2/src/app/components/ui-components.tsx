/* ═══════════════════════════════════════════════════════════════════════════
   Shared UI Components — Premium Design System
   Inspired by Stripe, Linear, Vercel, Notion
   Theme-aware building blocks with modern animations & glassmorphism
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    RefreshCw, Search, Plus, ChevronLeft, ChevronRight,
    AlertTriangle, CheckCircle2, XCircle, Info, X, Loader2,
    ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';

/* ─── Page Header ─────────────────────────────────────────────────────────── */
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string }>;
    actions?: ReactNode;
    badge?: { label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' };
}

export function PageHeader({ title, subtitle, icon: Icon, actions, badge }: PageHeaderProps) {
    const badgeColors = {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
        danger: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3.5 min-w-0">
                {Icon && (
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl sm:text-[1.75rem] font-bold text-foreground tracking-tight">{title}</h1>
                        {badge && (
                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeColors[badge.variant || 'default']}`}>
                                {badge.label}
                            </span>
                        )}
                    </div>
                    {subtitle && <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </motion.div>
    );
}

/* ─── Card ────────────────────────────────────────────────────────────────── */
interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${padding ? 'p-5' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'indigo';
    subtitle?: string;
    onClick?: () => void;
}

const statColors = {
    blue: { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
    violet: { bg: 'bg-violet-500/10 dark:bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500/20' },
    amber: { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/20' },
    rose: { bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/20' },
    cyan: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/20' },
    indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-500/20' },
};

export function StatCard({ label, value, icon: Icon, color, subtitle, onClick }: StatCardProps) {
    const colorSet = statColors[color];
    return (
        <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`relative overflow-hidden rounded-xl bg-card border border-border/60 p-5 ${onClick ? 'cursor-pointer' : ''} shadow-sm hover:shadow-md transition-all duration-300 group`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight tabular-nums">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                <div className={`p-2.5 rounded-lg ${colorSet.bg} ring-1 ${colorSet.ring} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${colorSet.text}`} />
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Status Badge ────────────────────────────────────────────────────────── */
interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
    EN_ATTENTE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
    PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
    ACCEPTEE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    APPROUVEE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    APPROUVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    APPROVED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    REJETEE: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
    REJETE: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
    REJECTED: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
    REFUSEE: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
    JUSTIFIEE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    NON_JUSTIFIEE: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
    EN_COURS: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20',
    TERMINEE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    TERMINE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    RESOLUE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    ANNULE: 'bg-muted text-muted-foreground ring-1 ring-border',
    true: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    false: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
};

const statusLabels: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    PENDING: 'En attente',
    ACCEPTEE: 'Acceptée',
    APPROUVEE: 'Approuvée',
    APPROUVE: 'Approuvé',
    APPROVED: 'Approuvé',
    REJETEE: 'Rejetée',
    REJETE: 'Rejeté',
    REJECTED: 'Rejeté',
    REFUSEE: 'Refusée',
    JUSTIFIEE: 'Justifiée',
    NON_JUSTIFIEE: 'Non justifiée',
    EN_COURS: 'En cours',
    TERMINEE: 'Terminée',
    TERMINE: 'Terminé',
    RESOLUE: 'Résolue',
    ANNULE: 'Annulé',
    true: 'Évalué',
    false: 'En attente',
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const s = String(status);
    const style = statusStyles[s] || 'bg-muted text-muted-foreground ring-1 ring-border';
    const label = statusLabels[s] || s.replace(/_/g, ' ');
    const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
    return (
        <span className={`inline-flex items-center font-semibold rounded-md ${style} ${sizeClass}`}>
            {label}
        </span>
    );
}

/* ─── Search + Toolbar ────────────────────────────────────────────────────── */
interface ToolbarProps {
    searchValue?: string;
    onSearch?: (v: string) => void;
    searchPlaceholder?: string;
    onRefresh?: () => void;
    loading?: boolean;
    children?: ReactNode;
}

export function Toolbar({ searchValue, onSearch, searchPlaceholder = 'Rechercher…', onRefresh, loading, children }: ToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
            {onSearch && (
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-3 py-2 text-[13px] rounded-lg bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
                {onRefresh && (
                    <button onClick={onRefresh} disabled={loading} className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground disabled:opacity-50" title="Rafraîchir">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}

/* ─── Btn (Themed button) ─────────────────────────────────────────────────── */
interface BtnProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ComponentType<{ className?: string }>;
    loading?: boolean;
}

const btnVariants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60',
    danger: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm shadow-destructive/20',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20',
};

const btnSizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-[13px] rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-lg gap-2',
};

export function Btn({ variant = 'primary', size = 'md', icon: Icon, loading, children, disabled, ...rest }: BtnProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${btnVariants[variant]} ${btnSizes[size]}`}
            {...rest}
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : Icon && <Icon className="w-3.5 h-3.5" />}
            {children}
        </motion.button>
    );
}

/* ─── Confirm Dialog ──────────────────────────────────────────────────────── */
interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', variant = 'danger', loading, onConfirm, onCancel }: ConfirmDialogProps) {
    const icons = { danger: XCircle, warning: AlertTriangle, info: Info };
    const colors = {
        danger: 'text-red-500 bg-red-500/10 ring-1 ring-red-500/20',
        warning: 'text-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20',
        info: 'text-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20',
    };
    const btnVariant = variant === 'danger' ? 'danger' : variant === 'warning' ? 'primary' : 'primary';
    const IconComp = icons[variant];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card border border-border/60 rounded-xl shadow-xl w-full max-w-md p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2.5 rounded-lg ${colors[variant]}`}>
                                <IconComp className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                                <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 mt-6">
                            <Btn variant="ghost" size="sm" onClick={onCancel}>{cancelLabel}</Btn>
                            <Btn variant={btnVariant as any} size="sm" onClick={onConfirm} loading={loading}>{confirmLabel}</Btn>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: ReactNode;
    footer?: ReactNode;
}

const modalSizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-card border border-border/60 rounded-xl shadow-xl w-full ${modalSizes[size]} max-h-[85vh] flex flex-col`}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                            <h3 className="text-base font-semibold text-foreground">{title}</h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
                        {footer && <div className="border-t border-border/60 px-5 py-3.5 flex justify-end gap-2.5">{footer}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Form Input ──────────────────────────────────────────────────────────── */
interface FormFieldProps {
    label: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, required, children, className = '' }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-[13px] font-medium text-foreground mb-1.5">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            {children}
        </div>
    );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full px-3 py-2 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${className}`}
            {...props}
        />
    );
}

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`w-full px-3 py-2 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none ${className}`}
            {...props}
        />
    );
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={`w-full px-3 py-2 text-[13px] rounded-lg border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

/* ─── Toast / Alert ───────────────────────────────────────────────────────── */
interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

const alertStyles = {
    success: 'bg-emerald-500/8 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    error: 'bg-red-500/8 border-red-500/20 text-red-700 dark:text-red-400',
    warning: 'bg-amber-500/8 border-amber-500/20 text-amber-700 dark:text-amber-400',
    info: 'bg-blue-500/8 border-blue-500/20 text-blue-700 dark:text-blue-400',
};
const alertIcons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

export function Alert({ type, message, onClose }: AlertProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-[13px] mb-4 ${alertStyles[type]}`}
        >
            {React.createElement(alertIcons[type], { className: 'w-4 h-4 flex-shrink-0' })}
            <span className="flex-1">{message}</span>
            {onClose && (
                <button onClick={onClose} className="p-0.5 hover:opacity-70 transition-opacity">
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}

/* ─── Empty State ─────────────────────────────────────────────────────────── */
interface EmptyStateProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center px-4">
            {Icon && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border/60 mb-4">
                    <Icon className="w-8 h-8 text-muted-foreground/40" />
                </div>
            )}
            <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
            {description && <p className="text-[13px] text-muted-foreground max-w-sm">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
}

/* ─── Loading Spinner ─────────────────────────────────────────────────────── */
export function LoadingState({ message = 'Chargement…' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-muted" />
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin absolute inset-0" />
            </div>
            <p className="text-[13px] text-muted-foreground mt-4">{message}</p>
        </div>
    );
}

/* ─── Table Primitives ────────────────────────────────────────────────────── */
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-[13px]">{children}</table>
        </div>
    );
}

export function Thead({ children }: { children: ReactNode }) {
    return <thead className="bg-muted/30 border-b border-border/60">{children}</thead>;
}

export function Th({ children, className = '', sortable, sorted, onSort }: {
    children: ReactNode; className?: string; sortable?: boolean; sorted?: 'asc' | 'desc' | null; onSort?: () => void;
}) {
    return (
        <th
            className={`px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ${sortable ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''} ${className}`}
            onClick={sortable ? onSort : undefined}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortable && (
                    sorted === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                        sorted === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                            <ArrowUpDown className="w-3 h-3 opacity-30" />
                )}
            </div>
        </th>
    );
}

export function Tbody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-border/40">{children}</tbody>;
}

export function Tr({ children, className = '', onClick, highlight }: {
    children: ReactNode; className?: string; onClick?: () => void; highlight?: boolean;
}) {
    return (
        <tr
            onClick={onClick}
            className={`transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''} ${highlight ? 'bg-primary/5' : 'hover:bg-muted/30'} ${className}`}
        >
            {children}
        </tr>
    );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <td className={`px-4 py-3 text-foreground ${className}`}>{children}</td>;
}

/* ─── Tabs ────────────────────────────────────────────────────────────────── */
interface TabsProps {
    tabs: { id: string; label: string; count?: number }[];
    active: string;
    onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
    return (
        <div className="flex gap-0.5 p-1 rounded-lg bg-muted/50 border border-border/50 mb-5 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all whitespace-nowrap
                        ${active === tab.id
                            ? 'bg-card text-foreground shadow-sm border border-border/60'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active === tab.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

/* ─── Pagination ──────────────────────────────────────────────────────────── */
interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
}

export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-xs text-muted-foreground tabular-nums">
                {totalItems !== undefined && pageSize ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalItems)} sur ${totalItems}` : `Page ${page + 1} / ${totalPages}`}
            </p>
            <div className="flex items-center gap-1">
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                    return (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 rounded-md text-xs font-medium transition-all
                ${page === p ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            {p + 1}
                        </button>
                    );
                })}
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
