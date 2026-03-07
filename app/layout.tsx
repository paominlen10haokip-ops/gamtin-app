import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNavBar from '../components/BottomNavBar';
import { AuthProvider } from '../components/AuthProvider';
import LayoutWrapper from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Gamtin – Community Hub for Churachandpur",
  description: "Stay connected with your local community in Churachandpur, Manipur. Get public notices, local news, job alerts, marketplace listings and taxi booking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} `}>
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
            <BottomNavBar />
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
