'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePerformance } from "@/hooks/use-performance";

const Aurora = dynamic(() => import("@/components/reactbits/Aurora"), { ssr: false });
const Magnet = dynamic(() => import("@/components/reactbits/Magnet"), { ssr: false });
const SpotlightCard = dynamic(() => import("@/components/reactbits/SpotlightCard"), { ssr: false });

export function CtaSection() {
    const { shouldReduceMotion } = usePerformance();

    return (
        <section className="relative overflow-hidden py-32">
            {/* Background Aurora - skip on low power */}
            <div className="absolute inset-0 z-0 h-full w-full">
                {!shouldReduceMotion ? (
                    <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} amplitude={1.5} blend={0.8} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-pink-900 to-red-900 opacity-30" />
                )}
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10 bg-white/10 dark:bg-zinc-950/40 backdrop-blur-3xl p-10 md:p-16 rounded-[40px] border border-white/20 dark:border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">Ready for your next adventure?</h2>
                    <p className="text-xl text-zinc-800 dark:text-zinc-300 max-w-2xl mx-auto drop-shadow-sm font-medium">
                        Stop searching. Start booking. Let AI build your perfect itinerary.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center">
                        {!shouldReduceMotion ? (
                            <Magnet padding={80} disabled={false} magnetStrength={3}>
                                <Link href="/auth?register=true" className="block">
                                    <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.4)" className="!p-0 overflow-hidden rounded-full border border-zinc-900/10 dark:border-white/10">
                                        <Button size="lg" className="h-16 px-10 text-lg w-full sm:w-auto rounded-full bg-zinc-900 hover:bg-black text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-900 transition-all font-semibold shadow-xl hover:shadow-2xl">
                                            <Sparkles className="mr-3 h-6 w-6" /> Generate Trip
                                        </Button>
                                    </SpotlightCard>
                                </Link>
                            </Magnet>
                        ) : (
                            <Link href="/auth?register=true" className="block">
                                <Button size="lg" className="h-16 px-10 text-lg w-full sm:w-auto rounded-full bg-zinc-900 hover:bg-black text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-900 transition-all font-semibold shadow-xl hover:shadow-2xl">
                                    <Sparkles className="mr-3 h-6 w-6" /> Generate Trip
                                </Button>
                            </Link>
                        )}
                        <Link href="/auth">
                            <Button size="lg" variant="outline" className="h-16 px-10 text-lg w-full sm:w-auto rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-white/30 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all shadow-md font-medium text-zinc-900 dark:text-zinc-50">
                                Log into existing account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
