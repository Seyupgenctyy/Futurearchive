import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FutureArchive — Write it. Lock it. Prove it.",
  description: "Pay $1 to permanently archive your prediction about the future. No gambling. No rewards. Just proof. The internet's archive of future claims.",
  keywords: [
    "future predictions",
    "predict the future",
    "archive predictions",
    "digital time capsule",
    "prediction platform",
    "future archive",
    "prophecy",
    "prophet score",
    "gelecek tahmini",
    "tahmin arşivi"
  ],
  authors: [{ name: "FutureArchive" }],
  creator: "FutureArchive",
  publisher: "FutureArchive",
  metadataBase: new URL("https://futurearchive.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "tr-TR": "/tr",
    },
  },
  openGraph: {
    title: "FutureArchive — Write it. Lock it. Prove it.",
    description: "Pay $1 to permanently archive your prediction about the future. No gambling. No rewards. Just proof.",
    url: "https://futurearchive.vercel.app",
    siteName: "FutureArchive",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FutureArchive — The Archive of Future Claims",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureArchive — Write it. Lock it. Prove it.",
    description: "Pay $1 to permanently archive your prediction about the future.",
    images: ["/og-image.png"],
    creator: "@futurearchive",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}