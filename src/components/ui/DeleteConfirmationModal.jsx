import React from 'react';

export const DeleteConfirmationModal = ({ routineName, onConfirm, onCancel, title, message }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-white mb-2">{title || "Delete Routine?"}</h3>
                <p className="text-zinc-400 mb-6">{message || `Are you sure you want to delete "${routineName}"? This action cannot be undone.`}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
};
