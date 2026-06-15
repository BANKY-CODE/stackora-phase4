import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Stackora — Digital Ecosystem',
  description: 'Cybersecurity, Fintech, Creator Tools & Community',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16163d',
                color: '#e2e4f0',
                border: '1px solid rgba(108,92,231,0.25)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00b894', secondary: '#05050f' } },
              error:   { iconTheme: { primary: '#e17055', secondary: '#05050f' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
