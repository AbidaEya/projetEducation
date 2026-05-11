import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiPut } from '../services/api';
import { PageHeader, Card, Btn, Alert, FormField, Input } from '../components/ui-components';

export default function ProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [address, setAddress] = useState(user?.address || '');
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [saving, setSaving] = useState(false);

    if (!user) return null;
    const endpoint = `/${user.role === 'admin' ? 'admins' : user.role === 'enseignant' ? 'enseignants' : 'etudiants'}/${user.id}`;

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiPut(endpoint, { ...user, phoneNumber: phone, address });
            const updated = { ...user, phoneNumber: phone, address };
            localStorage.setItem('edu_user', JSON.stringify(updated));
            setEditing(false);
            setMsg({ type: 'success', text: 'Profil mis à jour !' });
            setTimeout(() => setMsg(null), 3000);
        } catch { setMsg({ type: 'error', text: 'Erreur lors de la mise à jour' }); }
        finally { setSaving(false); }
    };

    const handlePasswordChange = async () => {
        if (!newPw || newPw.length < 4) { setMsg({ type: 'error', text: 'Mot de passe trop court (min 4 caractères)' }); return; }
        setSaving(true);
        try {
            await apiPut(endpoint, { ...user, password: newPw });
            setMsg({ type: 'success', text: 'Mot de passe changé !' });
            setOldPw(''); setNewPw('');
            setTimeout(() => setMsg(null), 3000);
        } catch { setMsg({ type: 'error', text: 'Erreur lors du changement' }); }
        finally { setSaving(false); }
    };

    const fields = [
        { icon: Mail, label: 'Email', value: user.email },
        { icon: User, label: 'Rôle', value: user.role },
        ...(user.role === 'enseignant' ? [{ icon: User, label: 'Spécialité', value: (user as any).specialite || '—' }] : []),
        ...(user.role === 'etudiant' ? [{ icon: User, label: 'Niveau', value: (user as any).niveau || '—' }] : []),
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader title="Mon Profil" subtitle="Gérez vos informations personnelles" icon={User} />

            {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

            {/* Profile Card */}
            <Card>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/15">
                        <span className="text-primary font-bold text-lg">{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-foreground">{user.firstName} {user.lastName}</h2>
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md ring-1 capitalize mt-1 ${user.role === 'admin' ? 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20' :
                            user.role === 'enseignant' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20'
                            }`}>{user.role}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                            <f.icon className="w-4 h-4 text-muted-foreground/60" />
                            <div>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{f.label}</p>
                                <p className="text-[13px] font-medium text-foreground">{f.value}</p>
                            </div>
                        </div>
                    ))}

                    {editing ? (
                        <>
                            <FormField label="Téléphone">
                                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" />
                            </FormField>
                            <FormField label="Adresse">
                                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Rue Example" />
                            </FormField>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                                <Phone className="w-4 h-4 text-muted-foreground/60" />
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Téléphone</p>
                                    <p className="text-[13px] font-medium text-foreground">{user.phoneNumber || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                                <MapPin className="w-4 h-4 text-muted-foreground/60" />
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Adresse</p>
                                    <p className="text-[13px] font-medium text-foreground">{user.address || '—'}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    {editing ? (
                        <>
                            <Btn variant="ghost" onClick={() => setEditing(false)}>Annuler</Btn>
                            <Btn icon={Save} onClick={handleSave} loading={saving}>Enregistrer</Btn>
                        </>
                    ) : (
                        <Btn variant="secondary" onClick={() => setEditing(true)}>Modifier</Btn>
                    )}
                </div>
            </Card>

            {/* Password */}
            <Card>
                <h3 className="text-[15px] font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" /> Changer le mot de passe
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Ancien mot de passe">
                        <Input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
                    </FormField>
                    <FormField label="Nouveau mot de passe">
                        <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 4 caractères" />
                    </FormField>
                </div>
                <div className="flex justify-end mt-4">
                    <Btn variant="secondary" onClick={handlePasswordChange} loading={saving} icon={Lock}>Changer</Btn>
                </div>
            </Card>
        </div>
    );
}
