import type { Metadata } from "next";
import "./globals.css";

import { CartDrawer } from "@/components/cart";
import { Footer, Header } from "@/components/layout";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Pear Store",
  description: "Shop the latest Pear products - PearPhone, PearBook, PearPad, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
