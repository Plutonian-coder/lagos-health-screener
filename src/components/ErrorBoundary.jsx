import React from 'react';
import { RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

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
        this.setState({ errorInfo });
    }

    handleReset = () => {
        window.location.href = '/';
    };

    handleClearData = () => {
        localStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000',
                    color: '#fff',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'rgba(255, 51, 51, 0.1)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px',
                        border: '2px solid #ff3333'
                    }}>
                        <AlertTriangle size={40} color="#ff3333" />
                    </div>
                    <h1 style={{ marginBottom: '16px' }}>System Encountered an Error</h1>
                    <p style={{ color: '#888', maxWidth: '500px', marginBottom: '32px' }}>
                        Something went wrong in the application interface.
                    </p>

                    <div style={{ background: '#111', padding: '16px', borderRadius: '8px', marginBottom: '32px', textAlign: 'left', maxWidth: '600px', width: '100%', overflow: 'auto', border: '1px solid #333' }}>
                        <code style={{ color: '#ff6666', fontSize: '0.9rem' }}>
                            {this.state.error && this.state.error.toString()}
                        </code>
                        <br />
                        <code style={{ color: '#666', fontSize: '0.8rem' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack && this.state.errorInfo.componentStack.slice(0, 300)}...
                        </code>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '12px 24px',
                                background: '#var(--accent-color)',
                                backgroundColor: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold'
                            }}
                        >
                            <RefreshCw size={18} /> Reload App
                        </button>

                        <button
                            onClick={this.handleClearData}
                            style={{
                                padding: '12px 24px',
                                background: '#222',
                                color: '#ff3333',
                                border: '1px solid #ff3333',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Trash2 size={18} /> Hard Reset (Clear Data)
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
