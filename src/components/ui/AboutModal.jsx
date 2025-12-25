import React from 'react';
import { X, Mail, Phone, Github, Dumbbell, TrendingUp, Target, Sparkles, Heart, Zap, Code2 } from 'lucide-react';

export const AboutModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div
                className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-2xl scrollbar-hide animate-scale-in"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                {/* Animated Top Gradient Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 via-pink-500 to-emerald-500 bg-[length:200%_100%] animate-gradient-x" />

                {/* Gradient Glow Effects - Animated */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-all duration-300 z-20 border border-zinc-800 hover:border-zinc-700 hover:rotate-90 hover:scale-110"
                >
                    <X size={18} />
                </button>

                <div className="relative z-10 p-6 sm:p-8">
                    {/* Hero Section */}
                    <div className="text-center mb-8 opacity-0 animate-fade-slide-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        {/* Animated Logo */}
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                            <div className="relative p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-500/30 animate-float">
                                <Dumbbell size={40} className="text-emerald-400" />
                            </div>
                        </div>

                        {/* App Name with Shimmer */}
                        <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white mb-2 relative overflow-hidden">
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">SPIDEY</span>
                            <span className="text-white">LIFT</span>
                        </h1>

                        {/* Version Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                            <Sparkles size={12} className="text-amber-400 animate-pulse" />
                            <span className="text-xs font-mono text-zinc-400">v1.0.0</span>
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Beta</span>
                        </div>
                    </div>

                    {/* Feature Highlights - Staggered Animation */}
                    <div className="mb-8 opacity-0 animate-fade-slide-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                            {[
                                { icon: Dumbbell, label: 'Smart Tracking', color: 'emerald' },
                                { icon: TrendingUp, label: 'Visual Progress', color: 'cyan' },
                                { icon: Target, label: 'Goal Focused', color: 'pink' }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border bg-zinc-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-default ${feature.color === 'emerald' ? 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10' :
                                            feature.color === 'cyan' ? 'border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10' :
                                                'border-pink-500/30 text-pink-400 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-500/10'
                                        }`}
                                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                                >
                                    <feature.icon size={18} className="animate-bounce-subtle" style={{ animationDelay: `${i * 0.2}s` }} />
                                    <span className="text-sm font-semibold text-zinc-300 whitespace-nowrap">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Origin Story - With entrance animation */}
                    <div className="mb-8 p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl opacity-0 animate-fade-slide-in hover:border-pink-500/30 transition-all duration-300" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Heart size={18} className="text-pink-500 fill-pink-500/30 animate-pulse" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Story</h3>
                        </div>
                        <div className="text-zinc-400 text-sm leading-relaxed space-y-3">
                            <p>
                                Built to solve <strong className="text-white">"gym amnesia"</strong> — forgetting weights,
                                losing track of sets, and guessing progress.
                            </p>
                            <p>
                                This app is a custom tool for tracking discipline, visualizing gains,
                                and staying consistent with <span className="text-pink-400 font-semibold hover:text-pink-300 transition-colors cursor-default">Sexie</span> 💕
                            </p>
                        </div>
                    </div>

                    {/* Developer Card - Enhanced animations */}
                    <div className="mb-8 p-5 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-500 group opacity-0 animate-fade-slide-in hover:shadow-lg hover:shadow-emerald-500/5" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                        <div className="flex items-center gap-4 mb-5">
                            {/* Avatar with glow */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-xl font-black text-white">SM</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white leading-none mb-1 group-hover:text-emerald-100 transition-colors">Subhadeep Mistri</h4>
                                <div className="flex items-center gap-1.5">
                                    <Code2 size={12} className="text-emerald-500 group-hover:animate-pulse" />
                                    <span className="text-xs text-emerald-400 font-medium">Lead Developer & Designer</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Buttons - Animated hover */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <a
                                href="https://github.com/subahdeepmistri"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                            >
                                <Github size={16} className="text-zinc-400 group-hover:animate-bounce-subtle" />
                                <span className="text-xs font-bold text-zinc-300">GitHub</span>
                            </a>
                            <a
                                href="mailto:subhadeepmistri1990@gmail.com"
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                            >
                                <Mail size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold text-zinc-300">Email</span>
                            </a>
                            <a
                                href="tel:8250518317"
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                            >
                                <Phone size={16} className="text-cyan-400" />
                                <span className="text-xs font-bold text-zinc-300">Call</span>
                            </a>
                        </div>
                    </div>

                    {/* Footer - With animations */}
                    <div className="text-center pt-4 border-t border-zinc-800/50 opacity-0 animate-fade-slide-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                        <p className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-2">
                            Crafted with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by
                        </p>
                        <p className="text-lg font-black uppercase tracking-wide">
                            <span className="text-pink-400 hover:text-pink-300 transition-colors cursor-default">SEXIE</span>
                            <span className="text-zinc-600 mx-2">&</span>
                            <span className="text-red-500 hover:text-red-400 transition-colors cursor-default">SPIDEY</span>
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-3">
                            <Zap size={12} className="text-amber-500 animate-pulse" />
                            <span className="text-[10px] text-zinc-600 font-mono">Powered by passion & late nights</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline keyframe for scale-in animation */}
            <style>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 3s linear infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
