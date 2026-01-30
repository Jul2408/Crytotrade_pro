'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import HeroChart from '@/components/charts/HeroChart';
import {
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  BarChart2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prices, setPrices] = useState([
    { s: 'BTC', p: 48512.4, c: 2.45, v: '1.2B' },
    { s: 'ETH', p: 2614.9, c: -1.2, v: '850M' },
    { s: 'SOL', p: 104.2, c: 5.7, v: '320M' },
    { s: 'XRP', p: 0.54, c: 0.8, v: '150M' },
  ]);

  const [trades, setTrades] = useState([
    { id: 1, type: 'buy', price: '48,512', amount: '0.24', time: '12:04:32' },
    { id: 2, type: 'sell', price: '48,510', amount: '1.50', time: '12:04:31' },
    { id: 3, type: 'buy', price: '48,514', amount: '0.05', time: '12:04:29' },
  ]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPrices(prev => prev.map(x => ({
        ...x,
        p: x.p + (Math.random() - 0.5) * 5,
        c: x.c + (Math.random() - 0.5) * 0.1
      })));

      setTrades(prev => [
        {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          price: (48000 + Math.random() * 1000).toFixed(0),
          amount: (Math.random() * 2).toFixed(2),
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        },
        ...prev.slice(0, 4)
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen selection:bg-brand-primary/30 bg-[#020308]">
      {/* Navigation Responsive */}
      <nav className="fixed top-0 w-full z-[100] nav-blur border-b border-brand-border h-16 sm:h-20">
        <div className="container mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="font-display text-base sm:text-lg font-bold tracking-tighter flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-brand-primary rounded-sm rotate-12 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] text-white -rotate-12">₿</span>
              </div>
              CTP <span className="opacity-40 font-normal">PRO</span>
            </Link>
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-widest text-brand-text-dim uppercase">
              <button onClick={() => scrollToSection('markets')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Marchés</button>
              <button onClick={() => scrollToSection('liquidity')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Liquidité</button>
              <button onClick={() => scrollToSection('security')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Sécurité</button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/login" className="hidden sm:block text-[10px] font-black hover:text-brand-primary transition-colors tracking-widest uppercase italic">Espace Admin</Link>
            <Link href="/login" className="btn-premium py-1.5 sm:py-2.5 px-6 sm:px-10 text-[9px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap italic">Connexion</Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-[101]"
            >
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center gap-10"
          >
            <button onClick={() => scrollToSection('markets')} className="text-xl font-black uppercase tracking-[4px] italic">Marchés</button>
            <button onClick={() => scrollToSection('liquidity')} className="text-xl font-black uppercase tracking-[4px] italic">Liquidité</button>
            <button onClick={() => scrollToSection('security')} className="text-xl font-black uppercase tracking-[4px] italic">Sécurité</button>
            <div className="h-px w-20 bg-brand-border my-4"></div>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[4px] text-brand-primary italic">Se Connecter</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 px-4">
          <HeroChart />

          <div className="container mx-auto text-center max-w-5xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[9px] sm:text-[10px] font-black tracking-[4px] uppercase mb-8 sm:mb-12 text-brand-primary italic"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(0,112,243,1)]"></span>
              Mainnet LIVE 2.0 (HFT Optimized)
            </motion.div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter leading-[1.0] sm:leading-[0.95] mb-6 sm:mb-10 animate-fade-in uppercase">
              Tradez sans <br />
              <span className="text-glow italic underline decoration-brand-primary/30 decoration-4 sm:decoration-8 underline-offset-[-2px]">limites.</span>
            </h1>

            <p className="text-brand-text-dim text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 sm:mb-20 font-medium leading-relaxed px-4 opacity-80">
              L&apos;infrastructure de trading pour les actifs numériques. <br className="hidden md:block" />
              Algorithmes de liquidité profonde & vitesse <span className="text-white font-bold italic underline decoration-brand-primary underline-offset-4">milli-seconde</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-20 w-full sm:w-auto px-6">
              <Link href="/login" className="btn-premium w-full sm:w-auto text-[11px] px-10 sm:px-14 py-4 sm:py-5 shadow-2xl font-black italic">
                DÉMARRER MAINTENANT <ArrowRight className="inline-block ml-3 w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollToSection('markets')}
                className="group w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full border border-white/10 hover:border-brand-primary/40 transition-all text-[11px] font-black uppercase tracking-[3px] bg-white/[0.02] flex items-center justify-center gap-3 italic"
              >
                TERMINAL LIVE
              </button>
            </div>
          </div>

          {/* Scrolling Tickers */}
          <div className="absolute bottom-0 w-full border-t border-brand-border py-4 sm:py-6 overflow-hidden bg-brand-bg/50 backdrop-blur-sm z-30">
            <div className="flex gap-12 sm:gap-20 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
              {prices.concat(prices).map((crypto, i) => (
                <div key={i} className="flex items-center gap-5 sm:gap-6 px-4">
                  <span className="text-[10px] sm:text-[11px] font-black text-brand-text-dim uppercase tracking-[4px]">{crypto.s}/USDT</span>
                  <span className="text-[12px] sm:text-[14px] font-display font-bold text-white tracking-tight">${crypto.p.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", crypto.c >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {crypto.c >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                    {crypto.c >= 0 ? '+' : ''}{crypto.c.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: RAW MARKETS */}
        <section id="markets" className="py-24 sm:py-40 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[8px] text-brand-primary mb-6 italic">/// MARKET ACCESS</h2>
              <h3 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-8">Marchés en Temps Réel</h3>
              <p className="text-brand-text-dim max-w-2xl mx-auto font-medium leading-relaxed italic opacity-60">Accédez aux carnets d&apos;ordres institutionnels et profitez d&apos;un spread minimal sur plus de 100 paires de trading.</p>
            </div>

            <div className="glass-card rounded-[40px] border-white/5 overflow-hidden shadow-2xl bg-[#03040b]/60">
              <div className="grid grid-cols-5 bg-white/[0.03] border-b border-white/5 py-6 px-10 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim italic">
                <div className="col-span-2">Actif</div>
                <div className="text-center">Prix</div>
                <div className="text-center">24h Change</div>
                <div className="text-right">Volume</div>
              </div>
              <div className="divide-y divide-white/5">
                {prices.map((crypto, i) => (
                  <div key={i} className="grid grid-cols-5 py-8 px-10 hover:bg-white/[0.02] transition-colors items-center">
                    <div className="col-span-2 flex items-center gap-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs">{crypto.s[0]}</div>
                      <div>
                        <div className="font-bold text-lg tracking-tight uppercase">{crypto.s}</div>
                        <div className="text-[9px] font-bold text-brand-text-dim tracking-widest uppercase">Digital Asset</div>
                      </div>
                    </div>
                    <div className="text-center font-display font-bold text-base tracking-tight">${crypto.p.toLocaleString()}</div>
                    <div className={cn("text-center font-black text-xs tracking-widest uppercase italic", crypto.c >= 0 ? 'text-green-500' : 'text-red-500')}>
                      {crypto.c >= 0 ? '+' : ''}{crypto.c.toFixed(2)}%
                    </div>
                    <div className="text-right font-bold text-xs opacity-60 tracking-[2px]">{crypto.v}</div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-white/[0.01] text-center">
                <button className="text-[10px] font-black uppercase tracking-[6px] text-brand-primary hover:underline italic underline-offset-8">VOIR TOU LES MARCHÉS [+150]</button>
              </div>
            </div>
          </div>
        </section>

        {/* Section: LIQUIDITY ENGINE */}
        <section id="liquidity" className="py-24 sm:py-40 bg-gradient-to-b from-[#020308] to-brand-primary/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-primary opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-12">
                <h2 className="text-[10px] font-black uppercase tracking-[8px] text-brand-primary italic">/// LIQUIDITY ENGINE</h2>
                <h3 className="text-4xl sm:text-6xl font-display font-bold tracking-tight leading-[1.1]">Liquidité Profonde. Exécution Instantanée.</h3>
                <p className="text-brand-text-dim text-lg leading-relaxed font-medium opacity-70 italic">Notre moteur d&apos;agrégation connecte les plus grands pools de liquidité mondiaux pour garantir que vos ordres, même les plus volumineux, soient exécutés sans glissement significatif.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary"><Zap className="w-6 h-6" /></div>
                    <h4 className="font-bold uppercase tracking-widest text-sm">Ultra-Low Latency</h4>
                    <p className="text-xs text-brand-text-dim italic leading-loose">Moteur optimisé pour la microseconde, synchronisé avec les bourses mondiales.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary"><Layers className="w-6 h-6" /></div>
                    <h4 className="font-bold uppercase tracking-widest text-sm">Smart Routing</h4>
                    <p className="text-xs text-brand-text-dim italic leading-loose">Algorithme propriétaire de routage des ordres pour une efficience maximale.</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-2xl">
                <div className="glass-card rounded-[40px] p-10 border-white/5 shadow-3xl bg-black relative">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-primary rounded-full blur-[80px]" />
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary">Statut du Pool</span>
                      <span className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase"><span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Optimal</span>
                    </div>
                    <div className="space-y-4 pt-4">
                      {[
                        { l: 'Aggregation Nodes', v: '99/99', p: '100%' },
                        { l: 'Depth Index', v: '$2B Tier 1', p: '94%' },
                        { l: 'Gateway RTT', v: '0.12ms', p: '98%' },
                      ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                            <span>{stat.l}</span>
                            <span>{stat.v}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: stat.p }}
                              className="h-full bg-brand-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: SECURITY ZERO */}
        <section id="security" className="py-24 sm:py-40 relative">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-[60px] p-16 sm:p-24 border-brand-primary/10 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/5" />
              <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-12 shadow-inner border border-brand-primary/20"><ShieldCheck className="w-12 h-12" /></div>

              <h2 className="text-[10px] font-black uppercase tracking-[10px] text-brand-primary mb-8 italic">/// PROTOCOLE SÉCURITÉ ZERO</h2>
              <h3 className="text-4xl sm:text-7xl font-display font-bold tracking-tight mb-12 max-w-4xl">Vos actifs, sous protection maximale.</h3>

              <p className="text-brand-text-dim text-xl max-w-3xl mb-20 font-medium leading-relaxed italic opacity-80">98% des actifs sont stockés hors ligne dans des coffres froids géographiquement distribués. Chaque transaction est protégée par un protocole multi-signature propriétaire.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
                {[
                  { icon: Lock, t: 'Cold Storage', d: 'Retrait différé sécurisé.' },
                  { icon: Cpu, t: 'MPC Architecture', d: 'Souveraineté des clés.' },
                  { icon: Globe, t: 'Regulatory Compliance', d: 'Standard SOC2 Type II.' },
                ].map((sec, i) => (
                  <div key={i} className="flex flex-col items-center gap-6 p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 transition-all hover:-translate-y-2">
                    <sec.icon className="w-10 h-10 text-brand-primary" />
                    <div className="space-y-2">
                      <div className="font-bold uppercase tracking-widest text-sm italic">{sec.t}</div>
                      <p className="text-[11px] text-brand-text-dim italic">{sec.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: CTA Dashboard Preview */}
        <section className="py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] opacity-40" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl sm:text-7xl font-display font-bold mb-12 tracking-tighter uppercase italic">L&apos;Avant-Garde vous attend.</h2>
            <Link href="/login" className="btn-premium px-16 sm:px-24 py-5 sm:py-8 text-sm sm:text-lg inline-block italic shadow-[0_30px_60px_-15px_rgba(0,112,243,0.5)]">DÉMARRER SUR CRYPTOTRADE PRO</Link>
            <div className="mt-12 text-brand-text-dim text-xs font-black uppercase tracking-[5px] opacity-40 italic">Système audité par des tiers indépendants.</div>
          </div>
        </section>
      </main>

      {/* Responsive Footer */}
      <footer className="border-t border-brand-border py-20 px-6 bg-[#020308] relative z-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2 space-y-8">
            <div className="font-display text-3xl font-bold tracking-tighter italic">CTP PRO <span className="text-brand-primary">.</span></div>
            <p className="text-brand-text-dim text-sm max-w-sm leading-relaxed italic">L&apos;infrastructure de trading institutionnelle distribuée. Maximisation de la liquidité et sécurité sans compromis.</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
              <Link href="#" className="hover:text-brand-primary transition-all">Twitter / X</Link>
              <Link href="#" className="hover:text-brand-primary transition-all">LinkedIn</Link>
              <Link href="#" className="hover:text-brand-primary transition-all">Telegram</Link>
            </div>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] uppercase font-black tracking-[4px] text-white italic">Plateforme</h4>
            <ul className="space-y-5 text-brand-text-dim text-[12px] font-bold italic">
              <li><button onClick={() => scrollToSection('markets')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Marchés</button></li>
              <li><button onClick={() => scrollToSection('liquidity')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Liquidité</button></li>
              <li><button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Sécurité</button></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] uppercase font-black tracking-[4px] text-white italic">Documents</h4>
            <ul className="space-y-5 text-brand-text-dim text-[12px] font-bold italic">
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">API Docs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Legal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-8 opacity-30 text-[10px] font-black tracking-[5px] uppercase border-t border-white/5 pt-12 text-center pointer-events-none italic">
          <div>© 2026 CTP PRO | BUILT FOR HIGH FREQUENCY TRADING</div>
          <div>EST. 14:23:01 UTC</div>
        </div>
      </footer>
    </div>
  );
}
