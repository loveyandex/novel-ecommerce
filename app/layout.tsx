import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/vazir';

export const metadata: Metadata = {
  title: 'تجارت الکترونیک نوین',
  description: 'یک پلتفرم تجارت الکترونیک مدرن ساخته شده با Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir min-h-screen">{children}</body>
    </html>
  );
}