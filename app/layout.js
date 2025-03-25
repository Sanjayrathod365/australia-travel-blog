import './globals.css';

export const metadata = {
  title: 'Australia Travel Blog',
  description: 'Explore the beautiful destinations and experiences in Australia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-gray-800">
                Australia Travel Blog
              </a>
              <div className="space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
                <a href="/destinations" className="text-gray-600 hover:text-gray-900">
                  Destinations
                </a>
                <a href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </div>
            </div>
          </nav>
        </header>
        {children}
        <footer className="bg-white mt-12 py-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Australia Travel Blog. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 