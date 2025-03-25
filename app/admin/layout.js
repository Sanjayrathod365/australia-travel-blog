import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center text-xl font-bold text-gray-800">
                Travel Blog Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen p-4">
          <nav className="space-y-2">
            <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
            <Link href="/admin/posts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Posts
            </Link>
            <Link href="/admin/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Categories
            </Link>
            <Link href="/admin/tags" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Tags
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 