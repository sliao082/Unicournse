import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <section>
                    <h1>Something went wrong.</h1>
                    <small>{this.state.error?.message}</small>
                </section>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;