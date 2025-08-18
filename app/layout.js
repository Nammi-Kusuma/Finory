import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/convexClientProvider";

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
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Finory</p>
              <p>© {new Date().getFullYear()} Finory. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
