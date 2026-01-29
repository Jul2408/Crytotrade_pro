'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Clear any existing session on mount
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await api.post('/login/', {
                username: username.trim(),
                password: password.trim(),
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                setError('Échec de la connexion. Token non reçu.');
            }
        } catch (err: any) {
            setError('Email ou mot de passe incorrect.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#03040b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="orb orb-blue opacity-10" />
            <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 mb-6 group transition-all hover:scale-110">
                        <Lock className="w-8 h-8 text-brand-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[4px] text-brand-primary mb-2">🔐 ADMIN ACCESS ONLY (DJANGO)</h2>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-white uppercase italic">CryptoTrade Pro</h1>
                </div>

                <article className="glass-card rounded-[32px] p-10 border-white/5 bg-white/[0.01]">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs shadow-xl animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Username Admin</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full btn-premium py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 relative group"
                        >
                            <span className="relative z-10">{loading ? 'Vérification...' : '🚀 SE CONNECTER'}</span>
                            {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-[12px] text-brand-text-dim">
                            Pas encore de compte ?{' '}
                            <Link href="/register" className="text-brand-primary font-bold hover:underline">Créer un compte</Link>
                        </p>
                    </div>
                </article>

                <div className="mt-8 flex items-center justify-center gap-3 text-brand-text-dim opacity-40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[2px]">🛡️ Backend Python/Django Active</span>
                </div>
            </div>
        </div>
    );
}
