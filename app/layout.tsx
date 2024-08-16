import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";

const inter = Open_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Platform",
  description: "An example event platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
