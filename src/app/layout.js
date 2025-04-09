import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Newlytic | Smart Customer Tracking Platform",
  description: "Turn sign-ups into insights with AI magic. Track, analyze, and understand your customers with our sleek, affordable tool. Get smarter customer data without the bloat.",
  keywords: ["customer tracking", "customer analytics", "CRM", "customer insights", "AI analytics", "customer data platform", "startup analytics"],
  authors: [{ name: "Newlytic" }],
  openGraph: {
    title: "Newlytic | Smart Customer Tracking Platform",
    description: "Turn sign-ups into insights with AI magic. Track, analyze, and understand your customers with our sleek, affordable tool.",
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
    description: "Turn sign-ups into insights with AI magic. Track, analyze, and understand your customers with our sleek, affordable tool.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
