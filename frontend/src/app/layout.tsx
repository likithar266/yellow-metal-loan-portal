import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yellow Metal | Gold Loan Portal',
  description: 'Preliminary gold loan offer and data collection portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-[100dvh] flex flex-col">
        {children}
      </body>
    </html>
  );
}
