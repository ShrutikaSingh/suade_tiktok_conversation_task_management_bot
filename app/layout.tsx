import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suade Task Manager",
  description: "AI-powered task management system for social media conversations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen relative">
          <div className="absolute top-4 left-4 z-50">
            <img src="/logo.png" alt="Logo" width={60} height={60} className="object-contain" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
