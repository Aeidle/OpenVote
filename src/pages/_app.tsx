import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <main className=""> {/* Add padding top for AppBar and horizontal padding */}
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}