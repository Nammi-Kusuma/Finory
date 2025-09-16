import Hero from "@/components/Hero";
import { statsData, featuresData, howItWorksData, testimonialsData } from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mt-40">
      <Hero />
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.value}</div>
                <div className="text-gray-600"> {item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20"> 
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Finory? </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((item, index) => (
              <Card key={index} className="p-6">
              <CardContent className="space-y-4 pt-4">
                {item.icon}
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">How It Works? </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-8">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white ">Ready to get started? </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Sign up now and start managing your expenses with ease.</p>
          <Link href="/dashboard" className="text-white">
          <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
