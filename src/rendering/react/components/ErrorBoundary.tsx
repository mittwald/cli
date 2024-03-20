import { Component, PropsWithChildren } from "react";
import { ErrorBox } from "./ErrorBox.js";

interface ErrorBoundaryProps {
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  error?: Error;
}

/**
 * ErrorBoundary is a component that catches rendering errors in its children
 * and displays an appropriately-styled error message.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    if (error instanceof Error) {
      return { error };
    }

    return {};
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorBox err={this.state.error} />;
    }

    return this.props.children;
  }
}
