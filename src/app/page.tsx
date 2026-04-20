import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { RootLocaleRedirect } from './root-locale-redirect';
import { i18n } from '@/lib/i18n';
import {
  getHomePageMetadata,
  getLocaleLayoutMetadata,
} from '@/lib/site-metadata';

const defaultLocale = i18n.defaultLanguage;

const containerStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  gap: '1rem',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '1.5rem',
  textAlign: 'center',
};

const copyStyle: CSSProperties = {
  color: '#475569',
  lineHeight: 1.6,
  margin: 0,
  maxWidth: '32rem',
};

const linksStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  justifyContent: 'center',
};

const linkStyle: CSSProperties = {
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: '999px',
  color: '#0f172a',
  fontWeight: 600,
  padding: '0.7rem 1rem',
  textDecoration: 'none',
};

export const metadata: Metadata = {
  ...getLocaleLayoutMetadata(defaultLocale),
  ...getHomePageMetadata(defaultLocale),
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: false,
    },
    index: false,
  },
};

export default function RootPage() {
  return (
    <main style={containerStyle}>
      <RootLocaleRedirect />
      <h1 style={{ margin: 0 }}>Ghost Downloader</h1>
      <p style={copyStyle}>
        Redirecting to your preferred language. If that does not happen
        automatically, choose a version below.
      </p>
      <div style={linksStyle}>
        <a href="/zh/" style={linkStyle}>
          中文
        </a>
        <a href="/en/" style={linkStyle}>
          English
        </a>
      </div>
    </main>
  );
}
