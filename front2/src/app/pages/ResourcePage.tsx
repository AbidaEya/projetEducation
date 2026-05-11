/* ═══════════════════════════════════════════════════════════════════════════
   ResourcePage — Generic CRUD page used by 16+ admin/enseignant routes.
   Fully theme-aware using shared UI components.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Database, Plus, Pencil, Trash2, Upload, Eye } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, apiPostForm } from '../services/api';
import {
    PageHeader, Card, Toolbar, Btn, Modal, ConfirmDialog,
    Alert, LoadingState, EmptyState, Pagination,
    FormField, Input, Textarea, Select,
    Table, Thead, Th, Tbody, Tr, Td,
} from '../components/ui-components';

/* ─── Types ───────────────────────────────────────────────────────────────── */
export interface FieldDef {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'textarea' | 'checkbox' | 'select' | 'file';
    required?: boolean;
    options?: { value: string; label: string }[];
    optionsEndpoint?: string;
    optionsValuePath?: string;
    optionsLabelPath?: string;
    optionsLabelPaths?: string[];
}

interface Props {
    title: string;
    endpoint: string;
    createEndpoint?: string;
    fields?: FieldDef[];
    readOnly?: boolean;
    hideCreate?: boolean;
    hideDelete?: boolean;
}

const PAGE_SIZE = 10;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

function setNestedValue(obj: any, path: string, value: any): any {
    const clone = { ...obj };
    const keys = path.split('.');
    if (keys.length === 1) { clone[keys[0]] = value; return clone; }
    // Always update the flat dot-key so form[f.name] reads work correctly
    clone[path] = value;
    clone[keys[0]] = { ...clone[keys[0]], [keys[1]]: value };
    return clone;
}

function renderCellValue(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Oui' : 'Non';
    if (typeof val === 'object') {
        if (val.nomCours) return val.nomCours;
        if (val.nomDepartement) return val.nomDepartement;
        if (val.nomGroupe) return val.nomGroupe;
        if (val.nomMatiere) return val.nomMatiere;
        if (val.firstName) return `${val.firstName} ${val.lastName || ''}`.trim();
        if (val.name) return val.name;
        if (val.titre) return val.titre;
        return JSON.stringify(val);
    }
    return String(val);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ResourcePage({ title, endpoint, createEndpoint, fields, readOnly, hideCreate, hideDelete }: Props) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);
    const [viewItem, setViewItem] = useState<any>(null);

    // Delete confirm
    const [confirmDel, setConfirmDel] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    // Dynamic select options
    const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});

    /* ── Load data ────────────────────────────────────────────────────────── */
    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await apiGet(endpoint)); }
        catch { setData([]); }
        finally { setLoading(false); }
    }, [endpoint]);

    useEffect(() => { load(); }, [load]);

    /* ── Load select options ──────────────────────────────────────────────── */
    useEffect(() => {
        if (!fields) return;
        const selectFields = fields.filter(f => f.type === 'select' && f.optionsEndpoint);
        selectFields.forEach(async (f) => {
            try {
                const opts = await apiGet<any[]>(f.optionsEndpoint!);
                setSelectOptions(prev => ({ ...prev, [f.name]: opts }));
            } catch { }
        });
    }, [fields]);

    /* ── Derive columns ───────────────────────────────────────────────────── */
    const columns = useMemo(() => {
        if (fields) return fields.filter(f => f.type !== 'password' && f.type !== 'file');
        if (data.length === 0) return [];
        const keys = Object.keys(data[0]).filter(k => k !== 'password' && !k.startsWith('_'));
        return keys.slice(0, 8).map(k => ({ name: k, label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1') }));
    }, [fields, data]);

    /* ── Filter + Paginate ────────────────────────────────────────────────── */
    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(item =>
            Object.values(item).some(v => v && String(v).toLowerCase().includes(q)) ||
            (columns as any[]).some(c => {
                const val = getNestedValue(item, c.name);
                return val && renderCellValue(val).toLowerCase().includes(q);
            })
        );
    }, [data, search, columns]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    /* ── Form helpers ─────────────────────────────────────────────────────── */
    const openCreate = () => {
        setEditing(null);
        const initial: Record<string, any> = {};
        fields?.forEach(f => {
            if (f.type === 'checkbox') initial[f.name] = false;
            else initial[f.name] = '';
        });
        setForm(initial);
        setShowModal(true);
    };

    const openEdit = (item: any) => {
        setEditing(item);
        const values: Record<string, any> = {};
        (fields || columns).forEach((f: any) => {
            const v = getNestedValue(item, f.name);
            // Convert nested IDs to strings so <Select value="..."> matches <option value="...">  
            if (f.type === 'select' && f.name.includes('.') && v !== null && v !== undefined) {
                values[f.name] = String(v);
            } else {
                values[f.name] = v ?? '';
            }
        });
        setForm(values);
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);
        try {
            // Build payload
            const payload: any = {};
            (fields || columns).forEach((f: any) => {
                const val = form[f.name];
                if (f.name.includes('.')) {
                    const [parent, child] = f.name.split('.');
                    // Coerce to number for entity IDs (e.g. groupe.id, departement.id)
                    const coerced = (val !== '' && val !== null && val !== undefined) ? (isNaN(Number(val)) ? val : Number(val)) : null;
                    if (coerced === null) {
                        // If no value selected, send null for the entire relation
                        if (!(parent in payload)) payload[parent] = null;
                    } else {
                        if (!payload[parent] || payload[parent] === null) payload[parent] = {};
                        payload[parent][child] = coerced;
                    }
                } else if (f.type === 'password') {
                    // Password: only include if non-empty (on edit, empty = keep existing)
                    if (typeof val === 'string' && val.trim() !== '') {
                        payload[f.name] = val;
                    } else if (!editing) {
                        // On create, password is required by the backend
                        payload[f.name] = val || '';
                    }
                    // On edit with empty password → omit from payload → backend keeps existing
                } else if (f.type === 'checkbox') {
                    payload[f.name] = !!val;
                } else {
                    // Send null instead of empty string for optional fields
                    // to avoid unique-constraint violations on blank values (e.g. phoneNumber)
                    if (!f.required && typeof val === 'string' && val.trim() === '') {
                        payload[f.name] = null;
                    } else {
                        payload[f.name] = val;
                    }
                }
            });

            // Check for file upload
            const fileField = fields?.find(f => f.type === 'file');
            if (fileField && form[fileField.name] instanceof File) {
                const fd = new FormData();
                fd.append('file', form[fileField.name]);
                Object.entries(payload).forEach(([k, v]) => {
                    if (k !== fileField.name) fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
                });
                await apiPostForm(editing ? `${endpoint}/${editing.id}` : (createEndpoint || endpoint), fd);
            } else if (editing) {
                // On edit, only send changed fields + keep id
                await apiPut(`${endpoint}/${editing.id}`, payload);
            } else {
                await apiPost(createEndpoint || endpoint, payload);
            }

            setShowModal(false);
            setMsg({ type: 'success', text: editing ? 'Mis à jour avec succès !' : 'Créé avec succès !' });
            load();
        } catch (err: any) {
            const raw = err?.message || 'Erreur lors de la sauvegarde';
            // Make DB constraint errors user-friendly
            let friendly = raw;
            if (raw.includes('Unique') || raw.includes('unique') || raw.includes('Duplicate') || raw.includes('duplicate') || raw.includes('constraint')) {
                if (raw.toLowerCase().includes('email')) friendly = 'Cette adresse email existe déjà.';
                else if (raw.toLowerCase().includes('phone')) friendly = 'Ce numéro de téléphone existe déjà.';
                else friendly = 'Un enregistrement avec ces données existe déjà.';
            }
            setMsg({ type: 'error', text: friendly });
        } finally { setSaving(false); }
        setTimeout(() => setMsg(null), 5000);
    };

    const handleDelete = async () => {
        if (!confirmDel) return;
        setDeleting(true);
        try {
            await apiDelete(`${endpoint}/${confirmDel.id}`);
            setConfirmDel(null);
            setMsg({ type: 'success', text: 'Supprimé avec succès !' });
            load();
        } catch (err: any) {
            setMsg({ type: 'error', text: err?.message || 'Erreur lors de la suppression' });
        } finally { setDeleting(false); }
        setTimeout(() => setMsg(null), 3000);
    };

    /* ── Build select options for a field ─────────────────────────────────── */
    const getFieldOptions = (f: FieldDef) => {
        if (f.options) return f.options;
        if (f.optionsEndpoint) {
            const items = selectOptions[f.name] || [];
            return items.map(item => ({
                value: String(f.optionsValuePath ? getNestedValue(item, f.optionsValuePath) : item.id),
                label: f.optionsLabelPaths
                    ? f.optionsLabelPaths.map(p => getNestedValue(item, p)).filter(Boolean).join(' ')
                    : f.optionsLabelPath ? getNestedValue(item, f.optionsLabelPath) : String(item.id),
            }));
        }
        return [];
    };

    /* ── Render form field ────────────────────────────────────────────────── */
    const renderFormField = (f: FieldDef) => {
        const value = form[f.name] ?? '';

        if (f.type === 'textarea') {
            return (
                <FormField key={f.name} label={f.label} required={f.required}>
                    <Textarea rows={3} value={value} onChange={(e) => setForm(prev => setNestedValue(prev, f.name, e.target.value))} />
                </FormField>
            );
        }

        if (f.type === 'checkbox') {
            return (
                <FormField key={f.name} label={f.label}>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => setForm(prev => setNestedValue(prev, f.name, e.target.checked))}
                            className="w-4 h-4 rounded border-border/60 text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm text-foreground">{f.label}</span>
                    </label>
                </FormField>
            );
        }

        if (f.type === 'select') {
            const opts = getFieldOptions(f);
            return (
                <FormField key={f.name} label={f.label} required={f.required}>
                    <Select value={value} onChange={(e) => setForm(prev => setNestedValue(prev, f.name, e.target.value))}>
                        <option value="">— Choisir —</option>
                        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                </FormField>
            );
        }

        if (f.type === 'file') {
            return (
                <FormField key={f.name} label={f.label} required={f.required}>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/60 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors text-[13px] text-muted-foreground">
                            <Upload className="w-4 h-4" />
                            {form[f.name] instanceof File ? (form[f.name] as File).name : 'Choisir un fichier'}
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => { if (e.target.files?.[0]) setForm(prev => ({ ...prev, [f.name]: e.target.files![0] })); }}
                            />
                        </label>
                    </div>
                </FormField>
            );
        }

        return (
            <FormField key={f.name} label={f.label} required={f.required}>
                <Input
                    type={f.type || 'text'}
                    value={value}
                    onChange={(e) => setForm(prev => setNestedValue(prev, f.name, f.type === 'number' ? Number(e.target.value) : e.target.value))}
                />
            </FormField>
        );
    };

    /* ── View detail modal ────────────────────────────────────────────────── */
    const renderViewModal = () => {
        if (!viewItem) return null;
        return (
            <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Détails" size="lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(viewItem).filter(([k]) => k !== 'password' && !k.startsWith('_')).map(([key, val]) => (
                        <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{key}</p>
                            <p className="text-[13px] font-medium text-foreground break-all">{renderCellValue(val)}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        );
    };

    /* ═══ RENDER ════════════════════════════════════════════════════════════ */
    if (loading) return <LoadingState message={`Chargement des ${title.toLowerCase()}…`} />;

    return (
        <div className="space-y-4">
            <PageHeader
                title={title}
                icon={Database}
                badge={data.length > 0 ? { label: `${data.length}`, variant: 'info' } : undefined}
                actions={
                    !readOnly && !hideCreate && fields && (
                        <Btn icon={Plus} onClick={openCreate}>Ajouter</Btn>
                    )
                }
            />

            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            <Card padding={false}>
                <div className="p-4 pb-0">
                    <Toolbar searchValue={search} onSearch={(v) => { setSearch(v); setPage(0); }} onRefresh={load} loading={loading} />
                </div>

                {pageData.length === 0 ? (
                    <EmptyState icon={Database} title="Aucun élément" description={search ? 'Aucun résultat pour cette recherche' : `Pas de ${title.toLowerCase()} pour le moment`} />
                ) : (
                    <Table>
                        <Thead>
                            <tr>
                                <Th className="w-12">#</Th>
                                {columns.map((c: any) => (
                                    <Th key={c.name}>{c.label}</Th>
                                ))}
                                {!readOnly && <Th className="text-right">Actions</Th>}
                            </tr>
                        </Thead>
                        <Tbody>
                            {pageData.map((item, idx) => (
                                <Tr key={item.id || idx}>
                                    <Td className="text-muted-foreground font-mono text-xs">{page * PAGE_SIZE + idx + 1}</Td>
                                    {columns.map((c: any) => (
                                        <Td key={c.name}>
                                            {c.type === 'checkbox' ? (
                                                <span className={`inline-block w-2 h-2 rounded-full ${getNestedValue(item, c.name) ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                                            ) : (
                                                <span className="truncate max-w-[200px] inline-block text-[13px]">{renderCellValue(getNestedValue(item, c.name))}</span>
                                            )}
                                        </Td>
                                    ))}
                                    {!readOnly && (
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setViewItem(item)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Voir">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {fields && (
                                                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors" title="Modifier">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {!hideDelete && (
                                                    <button onClick={() => setConfirmDel(item)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors" title="Supprimer">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </Td>
                                    )}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}

                <div className="px-4 pb-3">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
                </div>
            </Card>

            {/* Create / Edit Modal */}
            {showModal && fields && (
                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    title={editing ? `Modifier ${title.slice(0, -1)}` : `Ajouter ${title.slice(0, -1)}`}
                    size="lg"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setShowModal(false)}>Annuler</Btn>
                            <Btn onClick={handleSave} loading={saving}>{editing ? 'Mettre à jour' : 'Créer'}</Btn>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(f => renderFormField(f))}
                    </div>
                </Modal>
            )}

            {/* View Detail Modal */}
            {renderViewModal()}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!confirmDel}
                title="Confirmer la suppression"
                message={`Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDel(null)}
            />
        </div>
    );
}
