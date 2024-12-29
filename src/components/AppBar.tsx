import { useRouter } from 'next/router';
import Link from 'next/link';

const AppBar = () => {
  const router = useRouter();

  // Function to determine if a link is active
  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-start items-center space-x-4">
          {/* Navigation Links */}
          <Link 
            href="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Home
          </Link>
          
          <Link 
            href="/about"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/about') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
