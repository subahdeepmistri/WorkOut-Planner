/**
 * WizardHeader
 * Modern glassmorphic progress indicator with smooth animations
 * Unified design system for the routine builder wizard
 */

import React from 'react';

export function WizardHeader({ currentStep, totalSteps, title, onClose, onStepClick, steps = [] }) {
    return (
        <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-900/98 to-zinc-900/95 backdrop-blur-xl border-b border-zinc-800/50">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

            <div className="relative px-4 py-4">
                {/* Top row: Close button and title */}
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center
                       bg-zinc-800/60 text-zinc-400 
                       hover:bg-zinc-700 hover:text-white 
                       active:scale-95 transition-all duration-200"
                        aria-label="Close wizard"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-base font-bold text-white tracking-wide uppercase">
                        {title}
                    </h2>

                    <div className="w-10" />
                </div>

                {/* Progress bar with dots */}
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalSteps }, (_, i) => {
                            const stepNum = i + 1;
                            const isCompleted = stepNum < currentStep;
                            const isCurrent = stepNum === currentStep;
                            const isClickable = stepNum < currentStep;
                            const stepData = steps[i];

                            return (
                                <React.Fragment key={stepNum}>
                                    <button
                                        onClick={() => isClickable && onStepClick?.(stepNum)}
                                        disabled={!isClickable}
                                        className={`
                      relative flex flex-col items-center gap-1
                      transition-all duration-300 ease-out
                      ${isClickable ? 'cursor-pointer' : ''}
                    `}
                                        aria-label={`Step ${stepNum}: ${stepData?.name}`}
                                    >
                                        {/* Step circle */}
                                        <div className={`
                      w-9 h-9 rounded-full flex items-center justify-center
                      font-semibold text-sm transition-all duration-300
                      ${isCurrent
                                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                                : isCompleted
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-zinc-800/80 text-zinc-600'
                                            }
                    `}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                stepNum
                                            )}
                                        </div>

                                        {/* Icon below dot */}
                                        <span className={`
                      text-sm transition-all duration-200
                      ${isCurrent ? 'opacity-100' : 'opacity-60'}
                    `}>
                                            {stepData?.icon}
                                        </span>
                                    </button>

                                    {/* Connector line */}
                                    {stepNum < totalSteps && (
                                        <div className={`
                      w-2 h-0.5 rounded-full transition-colors duration-300 -mt-5
                      ${isCompleted ? 'bg-emerald-500/50' : 'bg-zinc-800'}
                    `} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WizardHeader;
