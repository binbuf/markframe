import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="flex items-center justify-center h-full bg-[#2d2d2d] p-8">
          <div className="max-w-md w-full bg-[#1e1e1e] border border-[#333] rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-400 text-center mb-4">
              {this.state.error.message}
            </p>

            <details className="mb-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                Show technical details
              </summary>
              <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-gray-300 overflow-auto max-h-48">
                {this.state.error.stack}
              </pre>
            </details>

            <div className="flex gap-3">
              <button
                onClick={this.resetError}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                <Home size={16} />
                Reload App
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
              If this problem persists, try loading a different blueprint or clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
