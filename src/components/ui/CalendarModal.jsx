import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarModal = ({ selectedDate, onSelectDate, onClose, workoutData }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
        const key = d.toISOString().split('T')[0];
        const log = workoutData[key];
        const hasData = log && log.exercises && log.exercises.some(e => e.sets.some(s => s.completed));
        return { date: d, hasData, isTuesday: d.getDay() === 2 };
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="text-zinc-400 hover:text-white"><ChevronLeft /></button>
                    <span className="font-bold text-white">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="text-zinc-400 hover:text-white"><ChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-zinc-500 text-xs font-bold">{d}</div>)}
                    {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                    {days.map((day, i) => (
                        <button
                            key={i}
                            onClick={() => { onSelectDate(day.date); onClose(); }}
                            disabled={day.isTuesday}
                            className={`h-8 w-8 rounded-full flex items-center justify-center relative transition-colors ${day.date.toDateString() === selectedDate.toDateString() ? 'bg-zinc-100 text-black font-bold' :
                                    day.isTuesday ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-300 hover:bg-zinc-800'
                                }`}
                        >
                            <span className={day.isTuesday ? 'line-through opacity-50' : ''}>{day.date.getDate()}</span>
                            {day.hasData && !day.isTuesday && (
                                <div className="absolute bottom-0.5 w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
