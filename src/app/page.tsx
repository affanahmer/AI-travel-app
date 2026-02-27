import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, CircleDollarSign } from "lucide-react";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TravelSuggestions } from "@/components/landing/TravelSuggestions";
import { TrendingDestinations } from "@/components/landing/TrendingDestinations";
import { TravelStyles } from "@/components/landing/TravelStyles";
import { Testimonials } from "@/components/landing/Testimonials";
import { BudgetEstimator } from "@/components/landing/BudgetEstimator";
import { CtaSection } from "@/components/landing/CtaSection";
import Aurora from "@/components/reactbits/Aurora";
import SplitText from "@/components/reactbits/SplitText";
import ShinyText from "@/components/reactbits/ShinyText";
import Magnet from "@/components/reactbits/Magnet";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-zinc-950 text-white overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5} />
        </div>
        {/* Animated grid layered over Aurora */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="container px-4 md:px-6 relative z-20 flex flex-col space-y-8 items-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="flex flex-col items-center justify-center text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl select-none">
              <SplitText text="Your Perfect Trip," className="text-zinc-100" delay={40} />
              <ShinyText text="Designed by AI" disabled={false} speed={3} className="mt-2" />
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
              Tell us what you want, and let our intelligent engine curate the ideal itinerary, accommodations, and activities within your budget.
            </p>
          </div>

          <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row gap-2 transition-all hover:border-zinc-700">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-zinc-500" />
              <Input
                placeholder="Plan a 3-day trip to northern Pakistan under 25,000 PKR"
                className="w-full pl-10 h-14 bg-transparent border-none text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base flex-1"
              />
            </div>
            <Magnet padding={50} disabled={false} magnetStrength={3}>
              <Button size="lg" className="h-14 px-8 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold w-full md:w-auto">
                Generate Trip
              </Button>
            </Magnet>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-500 mt-4">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Any Destination</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Flexible Dates</span>
            <span className="flex items-center gap-1"><CircleDollarSign className="h-4 w-4" /> Smart Budgeting</span>
          </div>
        </div>
      </section>

      <HowItWorks />
      <TravelSuggestions />
      <TrendingDestinations />
      <TravelStyles />
      <Testimonials />
      <BudgetEstimator />
      <CtaSection />
    </div>
  );
}
