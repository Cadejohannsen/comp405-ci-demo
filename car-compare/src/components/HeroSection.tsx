import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VideoBackground from "./VideoBackground";
// import YouTubeBackground from "./YouTubeBackground"; // Uncomment to use YouTube

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <VideoBackground opacity={0.3}>
      {/* Alternative: Use YouTube Background */}
      {/* <YouTubeBackground videoId="t9-cMiEDNyk" opacity={0.3}> */}
        <div className="flex items-center justify-center min-h-[90vh]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="mb-8">
              <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] tracking-tight mb-4 text-white">
                Car<span className="text-accent">Compare</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 font-body">
                The smartest way to buy a car
              </p>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.9] tracking-tight mb-8 text-white">
              Find.
              <br />
              Compare.
              <br />
              <span className="text-accent">Drive.</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 font-body">
              Search thousands of cars from dealerships in your area. Compare prices
              instantly. Never overpay again.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="group flex items-center gap-3 bg-accent text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-accent-dark transition-all"
              >
                <span>Search Cars</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-3 border-2 border-accent text-accent px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-accent hover:text-white transition-all"
              >
                Browse All Cars
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <p className="font-heading text-4xl font-bold text-white">500+</p>
                <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">
                  Dealers
                </p>
              </div>
              <div>
                <p className="font-heading text-4xl font-bold text-white">10K+</p>
                <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">
                  Listings
                </p>
              </div>
              <div>
                <p className="font-heading text-4xl font-bold text-white">$2.4K</p>
                <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">
                  Avg Saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </VideoBackground>
      {/* </YouTubeBackground> */}
    </section>
  );
}
