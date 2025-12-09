import React from 'react';
import { X, Mail, Phone, Code, Heart, Terminal } from 'lucide-react';

export const AboutModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="relative w-full max-w-md bg-white dark:bg-zinc-950 border-2 border-emerald-500/20 dark:border-emerald-500/50 rounded-[2.5rem] shadow-[0_0_30px_rgba(16,185,129,0.1)] dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500 animate-gradient-x" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                            <Terminal size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase transform -skew-x-6 pr-4">
                                Behind The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 pr-2">Code</span>
                            </h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase">Version 1.0.0 // Beta</p>
                        </div>
                    </div>

                    {/* The Story */}
                    <div className="mb-8 space-y-4">
                        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <Heart size={14} className="text-pink-500 fill-pink-500/20" /> The Origin Story
                        </h3>
                        <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                            <p>
                                We built <strong>DUO FIT</strong> because we were tired of "gym amnesia."
                                Forgetting weights, losing track of sets, and guessing our progress became a bottleneck for me and my training partner, <span className="text-pink-400 font-bold">Sexie</span>.
                            </p>
                            <p>
                                This isn't just an app—it's a custom-built tool designed to solve <em>our</em> specific problems: tracking discipline, visualizing gains, and staying consistent together.
                            </p>
                        </div>
                    </div>

                    {/* Developer Card */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 hover:border-emerald-500/30 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm dark:shadow-inner">
                                <Code size={20} className="text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-zinc-900 dark:text-white font-bold text-lg leading-none">Subhadeep Mistri</h4>
                                <span className="text-xs text-emerald-600 dark:text-emerald-500 font-mono">Lead Developer & Designer</span>
                            </div>
                        </div>

                        {/* Contact Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="mailto:subhadeepmistri1990@gmail.com"
                                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group/btn"
                            >
                                <Mail size={16} className="text-zinc-400 group-hover/btn:text-emerald-500 dark:group-hover/btn:text-emerald-400 transition-colors" />
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Email Me</span>
                            </a>
                            <a
                                href="tel:8250518317"
                                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group/btn"
                            >
                                <Phone size={16} className="text-zinc-400 group-hover/btn:text-cyan-500 dark:group-hover/btn:text-cyan-400 transition-colors" />
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Call Me</span>
                            </a>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 text-center pb-2">
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest drop-shadow-sm">
                            CRAFTED BY <span className="text-pink-500">SEXIE</span> & <span className="text-red-500">SPIDEY</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
