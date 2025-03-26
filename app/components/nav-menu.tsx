"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, MapPin, Camera, BookOpen, Info, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function NavMenu() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="Australia Travel Blog" className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline-block">Australia Travel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              href="/destinations" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span>Destinations</span>
            </Link>
            <Link 
              href="/gallery" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>Blog</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-accent"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              href="/destinations" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin className="h-5 w-5" />
              <span>Destinations</span>
            </Link>
            <Link 
              href="/gallery" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Camera className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>Blog</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 