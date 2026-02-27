import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shadow",
  description: "AI assistants that prepare, assist, and follow up on every client meeting.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0D0D0D",
              color: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              padding: "12px 16px",
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
