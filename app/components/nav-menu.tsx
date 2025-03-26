import Link from 'next/link';
import { Home, MapPin, Camera, BookOpen, Info } from 'lucide-react';

export function NavMenu() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="Australia Travel Blog" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-800">Australia Travel</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              href="/destinations" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <MapPin className="h-5 w-5" />
              <span>Destinations</span>
            </Link>
            <Link 
              href="/gallery" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Camera className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <BookOpen className="h-5 w-5" />
              <span>Blog</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Home
          </Link>
          <Link 
            href="/destinations" 
            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Destinations
          </Link>
          <Link 
            href="/gallery" 
            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Gallery
          </Link>
          <Link 
            href="/blog" 
            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
} 