import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paiso Ka Jungal",
  description: "A investment traking app By VYStocks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  addposition: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4">
              <Navbar session={session} />
            </header>
            <main className="flex-grow p-4">{children}</main>
            <footer className="bg-gray-800 text-white p-4">
              <p>&copy; 2025 Paiso Ka Jungle</p>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
