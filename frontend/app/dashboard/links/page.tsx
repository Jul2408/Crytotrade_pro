'use client';

import { useState, useEffect } from 'react';
import {
    Link2,
    Plus,
    Copy,
    Trash2,
    ExternalLink,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import { api } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

interface FormLink {
    id: number;
    name: string;
    description: string;
    link_id: string;
    expiry_date: string | null;
    submissions_limit: number;
    created_at: string;
}

export default function AdminLinksPage() {
    const [links, setLinks] = useState<FormLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [newLink, setNewLink] = useState({
        name: '',
        description: '',
        submissions_limit: 0
    });

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const data = await api.get('/links/');
            setLinks(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleCreateLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink.name.trim()) return;
        try {
            const res = await api.post('/links/', {
                ...newLink,
                name: newLink.name.trim()
            });
            const linkId = res.link_id || res.id;
            const fullUrl = `${window.location.origin}/form/${linkId}`;

            try {
                await copyToClipboard(fullUrl);
            } catch (clipErr) {
                console.warn('Clipboard access denied');
            }

            setCopyStatus(linkId);
            setNewLink({ name: '', description: '', submissions_limit: 0 });
            fetchLinks();
            setTimeout(() => setCopyStatus(null), 3000);
        } catch (error: any) {
            console.error('Error creating link:', error);
            const msg = error.message || "Impossible de créer le lien";
            alert(`Erreur: ${msg}`);
        }
    };

    const deleteLink = async (id: number) => {
        if (!confirm('Supprimer ce lien ?')) return;
        try {
            await api.delete(`/links/${id}/`);
            fetchLinks();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCopy = async (id: string) => {
        const fullUrl = `${window.location.origin}/form/${id}`;
        await copyToClipboard(fullUrl);
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-10 h-10 text-brand-primary animate-spin" /></div>;

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="py-6 border-y border-white/5 bg-white/[0.01] flex items-center justify-center">
                <h2 className="text-[11px] font-black uppercase tracking-[5px] text-white italic">⚡ GESTION DES LIENS DE FORMULAIRE</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white">Liens Actifs</h1>
                    <p className="text-brand-text-dim text-[11px] font-bold uppercase tracking-[3px] mt-1 italic">Gérez vos campagnes de capture de données</p>
                </div>
            </div>

            <section className="glass-card rounded-[40px] p-10 border-brand-primary/10 bg-brand-primary/[0.01]">
                <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary mb-10 border-l-2 border-brand-primary pl-4">➕ CONFIGURATION DE NOUVELLE CAMPAGNE</h3>
                <form onSubmit={handleCreateLink}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[2px] opacity-40 ml-1">📝 Nom du lien</label>
                            <input
                                required
                                value={newLink.name}
                                onChange={e => setNewLink({ ...newLink, name: e.target.value })}
                                type="text" placeholder="Ex: Campagne Facebook Janvier"
                                className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-primary/40 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[2px] opacity-40 ml-1">📄 Description interne</label>
                            <input
                                value={newLink.description}
                                onChange={e => setNewLink({ ...newLink, description: e.target.value })}
                                type="text" placeholder="Usage réservé à l'admin"
                                className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-primary/40 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[2px] opacity-40 ml-1">🔢 Limite de soumissions</label>
                            <input
                                value={newLink.submissions_limit}
                                onChange={e => setNewLink({ ...newLink, submissions_limit: parseInt(e.target.value) || 0 })}
                                type="number" placeholder="0 = illimité"
                                className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-primary/40 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button type="submit" className="btn-premium px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[3px] flex items-center gap-3">
                            [ 🔗 GÉNÉRER ET COPIER ]
                        </button>
                        <AnimatePresence>
                            {copyStatus && (
                                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-green-500 text-[10px] font-black uppercase tracking-widest">
                                    Lien copié !
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
            </section>

            <div className="space-y-6">
                {links.map((link) => (
                    <article key={link.id} className="glass-card rounded-[32px] p-8 border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                                        <Link2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-[16px] font-bold text-white group-hover:text-brand-primary transition-colors uppercase">{link.name}</h4>
                                        <div className="flex items-center gap-2 text-brand-primary/60 text-[13px] font-medium mt-1">
                                            <span className="opacity-40 font-bold">🔗</span>
                                            <span className="underline underline-offset-4 decoration-current/20">/form/{link.link_id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-8 pt-4 text-[10px] font-black text-brand-text-dim uppercase tracking-[2px]">
                                    <span className="flex items-center gap-2">📅 ID: {link.link_id.slice(0, 8)}</span>
                                    <span className="flex items-center gap-2">⚠️ Limite: {link.submissions_limit === 0 ? '∝' : link.submissions_limit}</span>
                                    <span className="flex items-center gap-2 text-green-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Statut: Actif
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end lg:self-center">
                                <button
                                    onClick={() => handleCopy(link.link_id)}
                                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 text-white/60 hover:text-white"
                                >
                                    {copyStatus === link.link_id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-brand-primary" />}
                                    [ COPIER LE LIEN ]
                                </button>
                                <a
                                    href={`${window.location.origin}/form/${link.link_id}`}
                                    target="_blank"
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => deleteLink(link.id)}
                                    className="p-3 rounded-xl bg-red-400/5 border border-red-400/10 hover:bg-red-500 hover:text-white transition-all text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
