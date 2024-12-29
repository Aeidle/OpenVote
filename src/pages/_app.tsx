import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className=""> {/* Add padding top for AppBar and horizontal padding */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}