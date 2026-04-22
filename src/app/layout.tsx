import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaAdvisor - Premium Spa Membership",
  description: "Experience India's most exclusive spa membership platform.",
  icons: {
    icon: 'https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png',
    apple: 'https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark">
        {children}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
