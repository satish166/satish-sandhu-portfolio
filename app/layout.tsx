import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

import BootstrapClient from "./bootstrap.client";
import AOSWrapper from "./components/AOSWrapper";
import CustomCursor from "./components/cursor/cursor";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Satish Kumar | Frontend Developer & UI/UX Designer Portfolio",
  description: "Portfolio of Satish Kumar, Frontend Developer with expertise in React, Next.js, Angular, Salesforce Commerce Cloud (SFCC), SCSS, and responsive web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BootstrapClient />
        <CustomCursor />
        <AOSWrapper>
          {children}
        </AOSWrapper>
      </body>
    </html>
  );
}
