import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console with full details
    console.error("🚨 Error caught by ErrorBoundary:", {
      error: error,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    });

    // Store error info in state
    this.setState({ errorInfo });

    // In production, you could send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl border border-red-500/30 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">Something went wrong</h2>
            
            <p className="text-slate-400 mb-2">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>
            
            {this.state.error?.message && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mt-4">
                <p className="text-sm text-red-300 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <details className="text-left bg-slate-950/50 rounded-lg p-4 mb-6">
                <summary className="text-sm text-slate-400 cursor-pointer mb-2">
                  Stack Trace (Development Only)
                </summary>
                <pre className="text-xs text-red-300 overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white transition-all flex items-center gap-2 font-semibold"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-white transition-all flex items-center gap-2 font-semibold"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              If this problem persists, please contact support at support@clickblock.co
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}