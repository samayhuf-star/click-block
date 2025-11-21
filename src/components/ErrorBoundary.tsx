import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In production, you might want to log this to an error reporting service
    // e.g., Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Log to error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md w-full bg-slate-800 border-red-500/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
              <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            
              <p className="text-slate-400">
                We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg w-full text-left">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {this.state.error.toString()}
                </p>
              </div>
            )}

              <div className="flex gap-3 mt-6">
                <Button
                onClick={this.handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                  Reload Page
                </Button>
                <Button
                onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white"
              >
                Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
