import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { calculateWorkoutStats } from '../../utils/helpers';

export const CalendarModal = ({ selectedDate, onSelectDate, onClose, workoutData, getPreviousBest }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    // Get "Today" normalized to midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Escape Key Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);

        // FIX: Use 'en-CA' (YYYY-MM-DD) for local date key to match useWorkoutData storage format.
        // toISOString() uses UTC which causes key mismatches in different timezones.
        const key = d.toLocaleDateString('en-CA');
        const log = workoutData[key];

        const isFuture = d > today;
        const isToday = d.getTime() === today.getTime();
        const isTuesday = d.getDay() === 2; // Rest Day

        let status = 'empty';

        if (log && log.exercises && log.exercises.length > 0) {
            let total = 0;
            let completed = 0;
            log.exercises.forEach(e => {
                e.sets.forEach(s => {
                    total++;
                    if (s.completed) completed++;
                });
            });

            if (total > 0) {
                const percentage = (completed / total) * 100;

                if (percentage >= 80) status = 'green'; // Best/Good
                else if (percentage >= 50) status = 'yellow'; // Medium
                else if (percentage > 0) status = 'faded-yellow'; // Bad/Very Bad
                else status = 'red'; // Present but did nothing
            } else {
                status = 'red';
            }
        } else {
            // Logic for Absent
            // If it's in the past (not today), NOT a rest day, and NO log exists -> Absent (Red)
            if (!isFuture && !isToday && !isTuesday) {
                status = 'absent';
            }
        }

        return {
            date: d,
            status,
            isTuesday,
            isFuture
        };
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <X size={20} />
                </button>
                <div className="flex justify-between items-center mb-6 pr-8">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><ChevronLeft /></button>
                    <span className="font-bold text-zinc-900 dark:text-white">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><ChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-zinc-500 dark:text-zinc-500 text-xs font-bold">{d}</div>)}
                    {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                    {days.map((day, i) => {
                        const isSelected = day.date.toDateString() === selectedDate.toDateString();

                        // Dynamic styling
                        let baseClasses = "h-9 w-9 rounded-full flex items-center justify-center relative transition-all duration-300 transform";

                        // Status Colors
                        // Note: We prioritize status over isRestDay. If you work out on a rest day, it shows the score.
                        if (day.status === 'green') {
                            baseClasses += " bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400 font-black hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.8)]";
                        } else if (day.status === 'yellow') {
                            baseClasses += " bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-400 font-black hover:scale-110 hover:shadow-[0_0_20px_rgba(245,158,11,0.8)]";
                        } else if (day.status === 'faded-yellow') {
                            // Faded yellow for "bad" progress (<50%)
                            baseClasses += " bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 font-bold hover:scale-105";
                        } else if (day.status === 'red' || day.status === 'absent') {
                            baseClasses += " bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400 font-black hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)]";
                        } else if (day.isFuture) {
                            baseClasses += " text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-30";
                        } else if (day.isTuesday) {
                            // Rest Day (no workout logged)
                            baseClasses += " text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50";
                        } else {
                            // Empty (Today, or other scenarios)
                            baseClasses += " text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white";
                        }

                        // Selection Ring
                        if (isSelected) {
                            baseClasses += " ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-zinc-900 dark:ring-white z-10 scale-110";
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => { onSelectDate(day.date); onClose(); }}
                                disabled={day.isFuture}
                                className={baseClasses}
                            >
                                <span>{day.date.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
