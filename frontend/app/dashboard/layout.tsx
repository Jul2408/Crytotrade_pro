'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Files,
    Link2,
    Settings as SettingsIcon,
    Bell,
    Menu,
    LogOut,
    User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

const adminMenuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: Files, label: 'Soumissions', href: '/dashboard/submissions' },
    { icon: Link2, label: 'Liens', href: '/dashboard/links' },
    { icon: SettingsIcon, label: 'Paramètres', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Admin');
    const [appName, setAppName] = useState('CryptoTrade Pro');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const prevUnreadCount = useRef(0);
    const isFirstLoad = useRef(true);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Error playing sound:", e));
    };

    const fetchNotifications = async () => {
        try {
            const data = await api.get('/notifications/');
            setNotifications(data);

            const currentUnread = data.filter((n: any) => !n.is_read).length;

            // Play sound if we have NEW unread notifications
            if (currentUnread > prevUnreadCount.current && !isFirstLoad.current) {
                playNotificationSound();
            }

            prevUnreadCount.current = currentUnread;
            isFirstLoad.current = false;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const [profile, settings] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/settings/singleton/')
                ]);
                setAdminName(profile.username);
                setAppName(settings.app_name);
            } catch (error) {
                console.error('Failed to fetch dashboard info:', error);
            }
        };
        fetchDashboardInfo();
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await api.post('/notifications/mark_all_read/', {});
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all read');
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-[#03040b] text-white">
            <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-brand-bg/50 backdrop-blur-xl z-[100] px-6 lg:px-10">
                <div className="h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-brand-text-dim hover:text-white"><Menu className="w-6 h-6" /></button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center -rotate-6 shadow-lg shadow-brand-primary/20"><span className="text-sm font-black">₿</span></div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold tracking-tight text-sm uppercase italic">{appName}</span>
                                <span className="text-[9px] font-black uppercase text-brand-primary tracking-widest leading-none">PANEL {adminName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        {/* Admin Profile Display */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 transition-all">
                            <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest text-white/90 leading-none mb-1">{adminName}</span>
                                <span className="text-[9px] font-bold text-green-500 uppercase leading-none">En ligne</span>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Bell className={cn("w-5 h-5", unreadCount > 0 ? "text-brand-primary animate-bounce" : "text-brand-text-dim")} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,112,243,0.5)]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-80 max-h-[500px] overflow-hidden bg-brand-bg border border-white/10 rounded-2xl shadow-2xl z-[120] flex flex-col"
                                        >
                                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Notifications</span>
                                                <button onClick={markAllRead} className="text-[9px] font-black text-brand-primary uppercase hover:underline">Tout marquer</button>
                                            </div>
                                            <div className="overflow-y-auto no-scrollbar max-h-96">
                                                {notifications.length === 0 ? (
                                                    <div className="p-10 text-center opacity-30 italic text-xs">Aucune alerte</div>
                                                ) : (
                                                    notifications.map((n) => (
                                                        <div key={n.id} className={cn("px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.03] transition-all", !n.is_read && "bg-brand-primary/[0.05]")}>
                                                            <div className="flex justify-between gap-2 mb-1">
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-white/90">{n.title}</span>
                                                                <span className="text-[9px] font-black opacity-30">{new Date(n.created_at).toLocaleTimeString('fr-FR')}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-brand-text-dim leading-relaxed">{n.message}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                        <div className="fixed inset-0 z-[110]" onClick={() => setIsNotifOpen(false)} />
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/login" className="flex items-center gap-2 p-2.5 px-4 rounded-xl bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all font-black text-[10px] text-red-400 uppercase tracking-widest">
                            <LogOut className="w-4 h-4 shadow-sm" /> DÉCONNEXION
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="fixed top-20 left-0 right-0 h-14 bg-white/[0.02] border-b border-white/5 z-40 px-6 flex items-center justify-center lg:justify-start gap-4 overflow-x-auto no-scrollbar">
                {adminMenuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                            pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                                ? "bg-brand-primary/10 text-brand-primary"
                                : "text-brand-text-dim hover:text-white"
                        )}
                    >
                        <span>{item.label === 'Dashboard' ? '🏠' : item.label === 'Soumissions' ? '📋' : item.label === 'Liens' ? '🔗' : '⚙️'}</span>
                        [{item.label}]
                    </Link>
                ))}
            </div>

            <main className="pt-34 h-screen overflow-hidden">
                <div className="h-full overflow-y-auto px-6 lg:px-12 py-10 no-scrollbar">{children}</div>
            </main>
        </div>
    );
}
