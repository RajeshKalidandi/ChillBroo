import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <img 
            src="/images/logo.png" 
            alt="ChillBroo Logo" 
            className="w-24 h-24 object-contain mb-8"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-xl text-gray-600 mb-8">We're sorry for the inconvenience. Please try again later.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Go Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;