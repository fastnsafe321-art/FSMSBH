import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Build-only homepage renderer. Not imported by the client bundle.
 */
export function renderHomepage(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
