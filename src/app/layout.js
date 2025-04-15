import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Newlytic – Customer pipeline on autopilot",
  description: "Automatically log new signups, get AI-powered intel, and track every interaction — simple, actionable, and always up to date.",
  metadataBase: new URL('https://newlytic.co'),
  keywords: ["customer tracking", "customer tracking tool", "customer analytics", "CRM", "customer insights", "AI analytics", "customer data platform", "startup analytics"],
  authors: [{ name: "Newlytic" }],
  openGraph: {
    title: "Newlytic | Smart Customer Tracking Platform",
    description: "Transform sign-ups into valuable customer relationships with Newlytic, the smart tool for tracking and understanding your customers effortlessly.",
    url: "https://newlytic.co",
    siteName: "Newlytic",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Newlytic Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newlytic | Smart Customer Tracking Platform",
    description: "Transform sign-ups into valuable customer relationships with Newlytic, the smart tool for tracking and understanding your customers effortlessly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: "https://newlytic.co",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white">
  <head>
    <link rel="alternate" href="https://newlytic.co/" hrefLang="en" />
    <link rel="alternate" href="https://newlytic.co/" hrefLang="x-default" />
  </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
        <Script
          src="https://cdn.seline.com/seline.js"
          strategy="afterInteractive"
          data-token="281cd7f23d86c18"
        />
      </body>
    </html>
  );
}
