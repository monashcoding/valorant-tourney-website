import React, { Component, ReactNode } from "react";
import Error from "./Error";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Error error={this.state.error?.message} type="error" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
