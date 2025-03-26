import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Posts | Admin Dashboard',
  description: 'Manage your blog posts in the admin dashboard.',
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 