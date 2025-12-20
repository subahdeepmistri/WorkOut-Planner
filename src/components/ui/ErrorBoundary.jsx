
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary
 * Catches runtime errors in child components and displays a fallback UI
 * instead of crashing the entire application.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Optional: Clear potentially corrupt local state if we had access
        // For now, simpler is better.
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-6 bg-red-50/10 border border-red-500/20 rounded-2xl text-center">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                        <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                        We encountered an issue loading this section. Your data is safe.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <RefreshCw size={16} />
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
