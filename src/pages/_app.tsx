import type { AppProps } from 'next/app';
import AppBar from '../components/AppBar';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <main className="pt-16 px-4"> {/* Add padding top for AppBar and horizontal padding */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}