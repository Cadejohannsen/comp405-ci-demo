import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground mb-6">
          The smartest way to buy a car
        </p>

        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] tracking-tight mb-8">
          Find.
          <br />
          Compare.
          <br />
          <span className="text-accent">Drive.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body">
          Search thousands of cars from dealerships in your area. Compare prices
          instantly. Never overpay again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/search"
            className="group flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-all"
          >
            Start Searching
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-3 border-2 border-black text-black px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all"
          >
            Browse All Cars
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div>
            <p className="font-heading text-4xl font-bold">500+</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              Dealers
            </p>
          </div>
          <div>
            <p className="font-heading text-4xl font-bold">10K+</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              Listings
            </p>
          </div>
          <div>
            <p className="font-heading text-4xl font-bold">$2.4K</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              Avg Saved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
