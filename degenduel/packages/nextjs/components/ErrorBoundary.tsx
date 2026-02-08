"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050506]">
          <div className="text-center max-w-md px-6">
            <h2 className="text-3xl font-black text-[#E62058] mb-4">SOMETHING WENT WRONG</h2>
            <p className="text-slate-400 mb-6">
              An unexpected error occurred. This might be due to network issues or a contract read failure.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-8 py-3 rounded-xl font-bold"
            >
              RELOAD APP
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-400">
                  Technical Details
                </summary>
                <pre className="mt-2 text-[10px] text-slate-600 overflow-x-auto p-3 rounded bg-[rgba(5,5,6,0.5)]">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
