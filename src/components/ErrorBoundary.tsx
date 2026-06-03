import { Component, type ErrorInfo, type ReactNode } from "react";

import { getMessages } from "../locales";
import { loadLocale } from "../utils/locale";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

function errorBoundaryCopy() {
  const locale = loadLocale();
  const m = getMessages(locale);
  return m.errorBoundary;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const copy = errorBoundaryCopy();
      return (
        <div className="error-boundary">
          <h2>{copy.title}</h2>
          <p>{copy.message}</p>
          <button type="button" onClick={() => window.location.reload()}>
            {copy.refresh}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
