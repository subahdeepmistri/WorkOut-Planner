import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Zap, Award, Target, X, Star, Sparkles, Dumbbell, Footprints, Activity } from 'lucide-react';

export const CompletionModal = ({ isOpen, onClose, score, stats }) => {
    if (!isOpen) return null;

    const [animationState, setAnimationState] = useState('enter');

    useEffect(() => {
        setAnimationState('enter');
        const timer = setTimeout(() => setAnimationState('idle'), 500);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Tier Logic
    let tier = {
        title: "GOOD SESSION",
        subtitle: "Every workout counts.",
        message: "You showed up and put in the work. Consistency is the key to victory.",
        color: "text-zinc-100",
        shadow: "shadow-zinc-500/50",
        gradient: "from-zinc-400 to-zinc-600",
        icon: <Target size={48} className="text-white drop-shadow-md" />,
        bgGlow: "bg-zinc-500/20"
    };

    if (score >= 100) {
        tier = {
            title: "LEGENDARY",
            subtitle: "Absolute Perfection",
            message: "You destroyed this workout! A god-tier performance that defies limits.",
            color: "text-cyan-300",
            shadow: "shadow-cyan-500/60",
            gradient: "from-cyan-400 to-blue-500",
            icon: <Zap size={56} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />,
            bgGlow: "bg-cyan-500/30"
        };
    } else if (score >= 90) {
        tier = {
            title: "BEAST MODE",
            subtitle: "Unstoppable Force",
            message: "Elite focus and intensity. You are building something truly powerful.",
            color: "text-emerald-300",
            shadow: "shadow-emerald-500/60",
            gradient: "from-emerald-400 to-green-500",
            icon: <Trophy size={56} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />,
            bgGlow: "bg-emerald-500/30"
        };
    } else if (score >= 80) {
        tier = {
            title: "CRUSHED IT",
            subtitle: "Strong Effort",
            message: "You pushed hard today. Keep this momentum going for the next one!",
            color: "text-amber-300",
            shadow: "shadow-amber-500/60",
            gradient: "from-amber-400 to-orange-500",
            icon: <Flame size={56} className="text-white drop-shadow-md" />,
            bgGlow: "bg-amber-500/30"
        };
    } else if (score < 50) {
        tier = {
            title: "COMPLETED",
            subtitle: "Room to Grow",
            message: "A tough day, but you finished. Reset, recover, and come back stronger.",
            color: "text-rose-300",
            shadow: "shadow-rose-500/60",
            gradient: "from-rose-400 to-red-500",
            icon: <Award size={48} className="text-white drop-shadow-md" />,
            bgGlow: "bg-rose-500/30"
        };
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            ></div>

            {/* Confetti Particles (CSS Only Simple Version) */}
            {score >= 90 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1.5 h-1.5 rounded-full animate-pulse`}
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#F472B6', '#34D399', '#60A5FA', '#FBBF24'][Math.floor(Math.random() * 4)],
                                animationDuration: `${1 + Math.random()}s`,
                                opacity: 0.6
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main Card */}
            <div className={`relative w-full max-w-[360px] transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                ${animationState === 'enter' ? 'scale-75 opacity-0 translate-y-12' : 'scale-100 opacity-100 translate-y-0'}
            `}>

                {/* Glow Behind Card */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] ${tier.bgGlow} blur-[60px] rounded-full opacity-60`}></div>

                <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-visible flex flex-col items-center pt-16 pb-8 px-8 text-center">

                    {/* Floating Icon Badge */}
                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-br ${tier.gradient} p-5 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${tier.shadow} flex items-center justify-center ring-4 ring-black transform transition-transform duration-700 hover:scale-110 hover:rotate-3`}>
                        {tier.icon}
                        {score >= 90 && <Sparkles size={20} className="absolute -top-2 -right-2 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center gap-1 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            {[...Array(3)].map((_, i) => (
                                <Star key={i} size={14} className={`${score >= 80 ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} ${i === 1 ? '-mt-2' : ''}`} />
                            ))}
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-wider text-white">Congratulations!</h2>
                        <p className={`text-sm font-bold uppercase tracking-widest ${tier.color} opacity-90`}>{tier.title}</p>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-[260px] mx-auto">
                        {tier.message}
                    </p>

                    {/* Stats Pill - Main Overview */}
                    <div className="bg-zinc-950/50 rounded-2xl p-4 w-full border border-zinc-800/50 mb-4 grid grid-cols-3 gap-px relative overflow-hidden">
                        <div className="flex flex-col items-center relative z-10 border-r border-zinc-800 px-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Adherence</span>
                            <span className={`text-xl font-mono font-bold ${tier.color}`}>{Math.round(score)}%</span>
                        </div>
                        <div className="flex flex-col items-center relative z-10 border-r border-zinc-800 px-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Volume</span>
                            <span className="text-xl font-mono font-bold text-white">{stats?.strengthVol ? (stats.strengthVol / 1000).toFixed(1) + 'k' : '0'}</span>
                        </div>
                        <div className="flex flex-col items-center relative z-10 px-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Time</span>
                            <span className="text-xl font-mono font-bold text-white">{stats?.duration || '0m'}</span>
                        </div>
                    </div>

                    {/* Breakdown Stats - Iconic Row */}
                    {(stats?.strengthVol > 0 || stats?.cardioVol > 0 || stats?.absVol > 0) && (
                        <div className="grid grid-cols-3 gap-3 w-full mb-8">
                            {/* Strength */}
                            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border bg-zinc-900/40 relative overflow-hidden group ${stats?.strengthVol > 0 ? 'border-emerald-500/20' : 'border-zinc-800 opacity-30'}`}>
                                {stats?.strengthVol > 0 && <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                                <Dumbbell size={18} className={`mb-2 ${stats?.strengthVol > 0 ? 'text-emerald-400' : 'text-zinc-600'}`} />
                                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight mb-0.5">Strength</span>
                                <span className={`text-xs font-mono font-bold ${stats?.strengthVol > 0 ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                    {stats?.strengthVol ? (stats.strengthVol / 1000).toFixed(1) + 'k' : '-'}
                                </span>
                            </div>

                            {/* Cardio */}
                            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border bg-zinc-900/40 relative overflow-hidden group ${stats?.cardioVol > 0 ? 'border-amber-500/20' : 'border-zinc-800 opacity-30'}`}>
                                {stats?.cardioVol > 0 && <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                                <Footprints size={18} className={`mb-2 ${stats?.cardioVol > 0 ? 'text-amber-400' : 'text-zinc-600'}`} />
                                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight mb-0.5">Cardio</span>
                                <span className={`text-xs font-mono font-bold ${stats?.cardioVol > 0 ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                    {stats?.cardioVol || '-'}
                                </span>
                            </div>

                            {/* Core */}
                            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border bg-zinc-900/40 relative overflow-hidden group ${stats?.absVol > 0 ? 'border-cyan-500/20' : 'border-zinc-800 opacity-30'}`}>
                                {stats?.absVol > 0 && <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                                <Activity size={18} className={`mb-2 ${stats?.absVol > 0 ? 'text-cyan-400' : 'text-zinc-600'}`} />
                                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight mb-0.5">Core</span>
                                <span className={`text-xs font-mono font-bold ${stats?.absVol > 0 ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                    {stats?.absVol || '-'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className={`group relative w-full py-4 rounded-xl font-bold text-sm tracking-[0.1em] uppercase text-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                            bg-gradient-to-r ${tier.gradient}
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Continue Journey <div className="group-hover:translate-x-1 transition-transform">→</div>
                        </span>
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                </div>
            </div>
        </div>
    );
};
