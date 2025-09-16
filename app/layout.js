import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/convexClientProvider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finory",
  description: "One stop finance platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
      <html lang="en">
        <body
          className={inter.className}
        >
          <Header title="Finory"/>
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <Footer title="Finory"/>
        </body>
      </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
