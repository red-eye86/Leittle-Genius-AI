import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Little Genius AI — Learn, Play, Explore, Grow',
  description: 'Personalized AI Learning Application for Kids (Class 3 & UKG) grounded in actual school textbooks and curriculum.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-sky-200 selection:text-sky-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}

