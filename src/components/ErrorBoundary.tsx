"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border border-surface-container-highest text-center space-y-8">
            <div className="w-24 h-24 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-error/10">
              <AlertCircle size={48} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase">Oops! Terjadi Kesalahan</h1>
              <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
                Maaf, sistem mengalami gangguan teknis mendadak. Tim kami telah diberitahu.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="p-6 bg-error/5 rounded-2xl text-left border border-error/10">
                  <p className="font-mono text-xs text-error overflow-auto max-h-40">
                    {this.state.error?.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                <RefreshCcw size={20} />
                Refresh Page
              </button>
              <Link
                href="/"
                className="px-10 py-5 bg-on-surface text-surface rounded-2xl font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Home size={20} />
                Back Home
              </Link>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">Mitralabs.id System Recovery</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
