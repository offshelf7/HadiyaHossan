"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1540379708242-14a809bef941?w=1200&q=80",
      title: "HADIYA HOSSANA FC",
      subtitle: "ETHIOPIAN PREMIER LEAGUE",
      description:
        "Join us for the biggest match of the season as we face St. George in the Ethiopian Premier League.",
      cta: "Buy Tickets",
      ctaLink: "/tickets",
    },
    {
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=1200&q=80",
      title: "NEW KIT RELEASE",
      subtitle: "2023/24 SEASON",
      description:
        "Our new home and away kits are now available. Be the first to wear our colors.",
      cta: "Shop Now",
      ctaLink: "/shop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
      title: "JOIN OUR ACADEMY",
      subtitle: "YOUTH DEVELOPMENT",
      description:
        "Develop your skills with our world-class coaching staff. Open for ages 7-16.",
      cta: "Learn More",
      ctaLink: "/academy",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative overflow-hidden bg-black h-[600px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          {/* Image with overlay */}
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-4 inline-block px-4 py-1 bg-[#7f001b] text-white font-bold">
                  {slide.subtitle}
                </div>
                <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center px-8 py-4 text-white bg-[#7f001b] hover:bg-opacity-90 transition-colors text-lg font-medium"
                >
                  {slide.cta}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-[#7f001b]" : "bg-white bg-opacity-50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
