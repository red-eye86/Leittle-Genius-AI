import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Little Genius AI — Learn, Play, Explore, Grow',
  description: 'Personalized AI Learning Application for Kids (Class 4 & UKG) grounded in actual school textbooks and curriculum.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external font providers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Preload Hero LCP Image via Netlify Image CDN */}
        <link
          rel="preload"
          as="image"
          href="/.netlify/images?url=/characters/chikoo.jpg&w=800&fm=avif&q=80"
          imageSrcSet="/.netlify/images?url=/characters/chikoo.jpg&w=400&fm=avif&q=80 400w, /.netlify/images?url=/characters/chikoo.jpg&w=800&fm=avif&q=80 800w, /.netlify/images?url=/characters/chikoo.jpg&w=1200&fm=avif&q=80 1200w"
          imageSizes="(max-width: 768px) 100px, 150px"
          type="image/avif"
          fetchPriority="high"
        />

        {/* External fonts stylesheet with display=swap */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Gayathri:wght@400;700&family=Manjari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&display=swap"
        />
      </head>
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
