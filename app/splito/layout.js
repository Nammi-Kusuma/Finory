import { Inter } from "next/font/google";
import '../globals.css';
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Splito",
  description: "The smartest way to split expenses with friends",
};

export default function RootLayout({ children }) {
  return (
      <div className={`${inter.className}`}>
          <Header title="Splito"/>
          <main className="min-h-screen">
            {children}
          </main>
      </div>
  );
}