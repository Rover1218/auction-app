import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, message, type = 'success' }) {
    useEffect(() => {
        if (isOpen) {
            // Close modal after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 w-full max-w-sm transform transition-all">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${type === 'success' ? 'bg-teal-500/20' : 'bg-red-500/20'
                    }`}>
                    {type === 'success' ? (
                        <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
                <p className="text-slate-300 text-center mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
