"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRef, useEffect } from "react";

const Hero = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const img = imageRef.current;

    const handleScroll = () => {
      const scrPos = window.scrollY;
      const scrThr =  100;

      if(scrPos > scrThr) {
        img.classList.add("scrolled");
      } else {
        img.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [imageRef]);

return (
    <div className="pb-20 px-4 container mx-auto">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-[105px] pb-6 gradient-title">Manage your expenses <br /> with ease</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Finalyze is an AI-powered financial management tool that helps you track, manage, and analyze your expenses with ease.</p>
        <div className="mb-12 flex justify-center space-x-4">
            <Link href="/signup">
            <Button size="lg" variant="default" className="px-10">Get Started</Button>
            </Link>
        </div>
        <div className="hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
                <Image src="/banner.jpeg" alt="" width={1280} height={720} priority className="rounded-lg shadow-2xl border mx-auto"/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
