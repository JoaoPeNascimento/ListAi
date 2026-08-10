import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ListAí',
  description: 'Gerenciador de listas de presentes compartilháveis por link com reservas em tempo real.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
