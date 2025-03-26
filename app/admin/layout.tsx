'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  FolderOpen, 
  Settings,
  Users
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Posts',
      href: '/admin/posts',
      icon: FileText,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
    },
    {
      title: 'Tags',
      href: '/admin/tags',
      icon: Tag,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="h-16 flex items-center px-4 border-b">
          <Link href="/admin" className="text-lg font-semibold">
            Admin Dashboard
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">
            {navItems.find((item) => isActive(item.href))?.title || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
