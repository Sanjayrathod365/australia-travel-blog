"use client";

import Link from 'next/link';
import { Home, MapPin, Camera, BookOpen, Info } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover the Beauty of Australia
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore breathtaking landscapes, vibrant cities, and authentic local experiences across the land down under.
            </p>
            <Link 
              href="/destinations" 
              className="btn bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-lg"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Link href="/" className="card p-6 hover:shadow-lg transition-shadow">
              <Home className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Home</h3>
              <p className="text-muted-foreground">Return to the main page</p>
            </Link>
            <Link href="/destinations" className="card p-6 hover:shadow-lg transition-shadow">
              <MapPin className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Destinations</h3>
              <p className="text-muted-foreground">Explore amazing places</p>
            </Link>
            <Link href="/gallery" className="card p-6 hover:shadow-lg transition-shadow">
              <Camera className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Gallery</h3>
              <p className="text-muted-foreground">View stunning photos</p>
            </Link>
            <Link href="/blog" className="card p-6 hover:shadow-lg transition-shadow">
              <BookOpen className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Blog</h3>
              <p className="text-muted-foreground">Read travel stories</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/destinations/sydney" className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Sydney</h3>
                <p className="text-muted-foreground">Iconic harbor city with stunning architecture</p>
              </div>
            </Link>
            <Link href="/destinations/melbourne" className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Melbourne</h3>
                <p className="text-muted-foreground">Cultural capital with hidden laneways</p>
              </div>
            </Link>
            <Link href="/destinations/gold-coast" className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Gold Coast</h3>
                <p className="text-muted-foreground">Sun-soaked beaches and surfing paradise</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/destinations" className="text-muted-foreground hover:text-foreground">Destinations</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Popular Destinations</h3>
              <ul className="space-y-2">
                <li><Link href="/destinations/sydney" className="text-muted-foreground hover:text-foreground">Sydney</Link></li>
                <li><Link href="/destinations/melbourne" className="text-muted-foreground hover:text-foreground">Melbourne</Link></li>
                <li><Link href="/destinations/gold-coast" className="text-muted-foreground hover:text-foreground">Gold Coast</Link></li>
                <li><Link href="/destinations/great-barrier-reef" className="text-muted-foreground hover:text-foreground">Great Barrier Reef</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">123 Travel Street</li>
                <li className="text-muted-foreground">Sydney, NSW 2000</li>
                <li className="text-muted-foreground">Australia</li>
                <li className="text-muted-foreground">+61 2 1234 5678</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 Australia Travel Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 