import React, { useState } from 'react';
import {
    X, HelpCircle, Dumbbell, Activity, Zap, Calendar, Timer,
    TrendingUp, ChevronDown, ChevronRight, PlayCircle, Pause,
    CheckCircle, Plus, Trash2, Lock, Unlock, Link, Brain,
    BarChart3, Target, ArrowLeftRight, Sparkles, Save
} from 'lucide-react';

const GUIDE_SECTIONS = [
    {
        id: 'start',
        title: 'Getting Started',
        icon: PlayCircle,
        color: 'emerald',
        items: [
            {
                icon: Dumbbell,
                title: 'Select a Routine',
                description: 'Choose from Default routines (pre-built workouts) or your Custom routines. Tap the routine card to expand the list and pick one.'
            },
            {
                icon: PlayCircle,
                title: 'Start Session',
                description: 'Tap the green "START SESSION" button to begin your workout. The timer starts automatically and tracks your workout duration.'
            },
            {
                icon: Calendar,
                title: 'Date Navigation',
                description: 'Use the arrows to view past workouts. Tap the date pill to open the calendar and jump to any day.'
            }
        ]
    },
    {
        id: 'routines',
        title: 'Routines',
        icon: Activity,
        color: 'cyan',
        items: [
            {
                icon: Activity,
                title: 'Default Routines',
                description: 'Pre-built workout templates targeting specific muscle groups (Chest, Back, Legs, etc.). Perfect for beginners or when you want a quick start.',
                badge: 'Green accent'
            },
            {
                icon: Zap,
                title: 'Custom Routines',
                description: 'Create your own routines using the AI wizard or manual builder. You can add, remove, and reorder exercises however you like.',
                badge: 'Amber accent'
            },
            {
                icon: Brain,
                title: 'AI Routine Creator',
                description: 'Tell the AI what you want to train and it generates a complete workout plan with proper progression and rest periods.'
            }
        ]
    },
    {
        id: 'exercises',
        title: 'Exercise Cards',
        icon: Dumbbell,
        color: 'violet',
        items: [
            {
                icon: Target,
                title: 'Target: Sets × Reps',
                description: 'Shows your goal for this exercise. The "GOAL" column shows target reps, "KG" is weight, and "REPS" is what you actually did.'
            },
            {
                icon: CheckCircle,
                title: 'Complete a Set',
                description: 'Fill in your weight and reps, then tap the checkmark to complete the set. Rest timer starts automatically!'
            },
            {
                icon: ArrowLeftRight,
                title: 'L/R Toggle (1× | L/R)',
                description: 'For unilateral exercises (lunges, single-arm rows). Tap "L/R" to track left and right reps separately.',
                badge: 'Violet toggle'
            },
            {
                icon: Plus,
                title: 'Add Set',
                description: 'Need more sets? Tap "+ Add Set" below the exercise to add another row.'
            },
            {
                icon: Lock,
                title: 'Lock Exercise',
                description: 'Tap the lock icon to prevent accidental changes. Useful when you\'ve finished an exercise but still working out.'
            },
            {
                icon: Link,
                title: 'Superset Link',
                description: 'Link two exercises together. They\'ll share a rest timer and be grouped visually.'
            }
        ]
    },
    {
        id: 'timers',
        title: 'Timers & Rest',
        icon: Timer,
        color: 'pink',
        items: [
            {
                icon: Timer,
                title: 'Rest Timer',
                description: 'The big timer in the header shows your rest period. It auto-starts when you complete a set (90s for strength, 60s for abs, 30s for cardio).'
            },
            {
                icon: Plus,
                title: '+15 / -15 Buttons',
                description: 'Adjust rest time on the fly. Need more rest? Tap +15. Ready early? Tap -15 or SKIP.'
            },
            {
                icon: PlayCircle,
                title: 'Manual Rest Start',
                description: 'Tap the "Start Rest" button in the header to manually start a rest timer with a custom duration.'
            },
            {
                icon: Timer,
                title: 'Workout Duration',
                description: 'The timer next to the date shows total workout time. It pauses when you finish the session.'
            }
        ]
    },
    {
        id: 'stats',
        title: 'Stats & Progress',
        icon: BarChart3,
        color: 'amber',
        items: [
            {
                icon: TrendingUp,
                title: 'Personal Bests',
                description: 'Green "PB" badges appear when you lift heavier than before. Your best weight is shown above the input field.'
            },
            {
                icon: BarChart3,
                title: 'Progress Bar',
                description: 'The bar under each set shows progress: Yellow = under target, Green = hit target, Purple = exceeded target (with glow!).'
            },
            {
                icon: Target,
                title: 'Session Adherence',
                description: 'The bar at the top of your workout shows overall volume completion. Stay on track!'
            },
            {
                icon: TrendingUp,
                title: 'Stats Tab',
                description: 'Tap "Stats" in the bottom navigation to see workout trends, muscle focus distribution, and consistency charts.'
            }
        ]
    },
    {
        id: 'tips',
        title: 'Pro Tips',
        icon: Sparkles,
        color: 'rose',
        items: [
            {
                icon: Zap,
                title: 'Focus Mode',
                description: 'Tap the lightning bolt in the header to blur completed exercises and highlight your current set.'
            },
            {
                icon: Save,
                title: 'Save as Custom',
                description: 'Modified a default routine? Save it as a custom routine to keep your changes for future sessions.'
            },
            {
                icon: Trash2,
                title: 'Discard Workout',
                description: 'Made a mistake? Tap "Discard" to remove all progress for the current day and start fresh.'
            },
            {
                icon: CheckCircle,
                title: 'Finish Session',
                description: 'When done, tap "Finish" to lock in your workout and see your completion stats with score!'
            }
        ]
    }
];

export const HelpGuideModal = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState('start');
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (sectionId, itemIndex) => {
        const key = `${sectionId}-${itemIndex}`;
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getColorClasses = (color) => {
        const colors = {
            emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
            cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
            violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
            pink: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
            amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
            rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400'
        };
        return colors[color] || colors.emerald;
    };

    const activeData = GUIDE_SECTIONS.find(s => s.id === activeSection);

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md max-h-[85vh] overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-2xl shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 via-violet-500 to-pink-500" />

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30">
                            <HelpCircle size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">How to Use SpideyLift</h2>
                            <p className="text-xs text-zinc-500">Complete app guide</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-all border border-zinc-800 hover:border-zinc-700 hover:rotate-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tab Navigation - Centered Icons */}
                <div className="flex-shrink-0 border-b border-zinc-800/50 px-2 py-2">
                    <div className="flex justify-around items-center">
                        {GUIDE_SECTIONS.map(section => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${isActive
                                        ? `${getColorClasses(section.color)} border`
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                        }`}
                                    title={section.title}
                                >
                                    <Icon size={18} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl border ${getColorClasses(activeData.color)}`}>
                            <activeData.icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{activeData.title}</h3>
                    </div>

                    {/* Items */}
                    {activeData.items.map((item, index) => {
                        const ItemIcon = item.icon;
                        const isExpanded = expandedItems[`${activeSection}-${index}`];

                        return (
                            <button
                                key={index}
                                onClick={() => toggleItem(activeSection, index)}
                                className="w-full text-left p-4 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg border flex-shrink-0 ${getColorClasses(activeData.color)}`}>
                                        <ItemIcon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-white group-hover:text-zinc-100 transition-colors">
                                                {item.title}
                                            </h4>
                                            {item.badge && (
                                                <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm text-zinc-400 leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-2'
                                            }`}>
                                            {item.description}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-zinc-600 transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-zinc-800 bg-zinc-950/50">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Sparkles size={12} className="text-amber-500" />
                            Swipe tabs to explore
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-full font-semibold transition-all"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};
