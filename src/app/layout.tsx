import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import '../../lib/fontawesome'; // Adjust the path based on where you placed fontawesome.js
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';

const oswald = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chat-app",
  description: "chat-app-2024-by-suraj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${oswald.className} dark:bg-black dark:text-white `} >
          <Toaster position="bottom-right" containerStyle={{ marginTop: '40px'}} />
          {children}
        </body>
      </Providers>
    </html>
  );
}
