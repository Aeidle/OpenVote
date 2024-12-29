import { useRouter } from 'next/router';
import Link from 'next/link';
import WalletConnect from './WalletConnect';

const Header = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            E-Voting DApp
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/admin/dashboard"
              className={`hover:text-blue-200 transition-colors ${
                isActive('/admin/dashboard') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Admin
            </Link>
            <Link
              href="/voter/dashboard"
              className={`hover:text-blue-200 transition-colors ${
                isActive('/voter/dashboard') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Voter
            </Link>
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;