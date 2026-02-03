
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="bg-slate-800 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Oups ! Une erreur est survenue.</h1>
            <p className="text-slate-300 mb-6">
              Nous sommes désolés, mais l'application a rencontré un problème inattendu.
            </p>
            {this.state.error && (
              <div className="bg-black/30 p-4 rounded-lg mb-6 text-left overflow-auto max-h-32">
                <p className="text-red-400 font-mono text-xs break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <Button 
              onClick={this.handleReload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
