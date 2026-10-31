import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by AAVRITTI ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F3E9] text-[#292526] flex items-center justify-center p-4">
          <div className="bg-white border border-[#E9E2DA] rounded-2xl p-8 max-w-lg w-full text-center shadow-md space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F7EBEF] text-[#701F35] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-2.5 py-1 rounded-full">
                Recovery Shield Active
              </span>
              <h1 className="text-xl font-bold text-[#292526] mt-3">Something interrupted the application</h1>
              <p className="text-xs text-[#777174] mt-2 leading-relaxed">
                AAVRITTI protected your session from crashing to a blank screen. You can safely refresh the application or reset cached data.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#F8F3E9] border border-[#E9E2DA] rounded-xl p-3 text-left font-mono text-[11px] text-[#701F35] max-h-32 overflow-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#701F35] text-white text-xs font-semibold rounded-xl hover:bg-[#591728] transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Application
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E9E2DA] text-[#292526] text-xs font-semibold rounded-xl hover:bg-[#F8F3E9] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#777174]" />
                Clear Cache & Restart
              </button>
            </div>

            <p className="text-[10px] text-[#777174]">
              AAVRITTI Subscription Management — Zero white screen guarantee.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
