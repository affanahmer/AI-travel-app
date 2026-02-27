'use client';

import { useState, useCallback, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import data from "@/../data/destinations.json";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function BudgetEstimator() {
    const [budget, setBudget] = useState([20000]);

    const handleBudgetChange = useCallback((value: number[]) => {
        setBudget(value);
    }, []);

    // Memoize the expensive filter
    const topMatch = useMemo(() => {
        const matching = data.filter(d => d.cost <= budget[0] + 5000);
        return matching.length > 0 ? matching[0] : data[0];
    }, [budget]);

    return (
        <section className="py-24 bg-background border-t">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Play with your budget
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Not sure where you can go? Adjust your budget slider to discover what destinations fit your wallet instantly.
                        </p>

                        <div className="pt-8 pb-4">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-sm font-medium text-muted-foreground">Budget Estimate</span>
                                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 tabular-nums">
                                    {budget[0].toLocaleString()} PKR
                                </span>
                            </div>
                            <Slider
                                defaultValue={[20000]}
                                max={100000}
                                min={5000}
                                step={1000}
                                value={budget}
                                onValueChange={handleBudgetChange}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>5k</span>
                                <span>100k+</span>
                            </div>
                        </div>

                        <Link href={`/search?budget=${budget[0]}`} className="inline-flex items-center text-primary font-medium hover:underline pt-4">
                            Explore trips for {budget[0].toLocaleString()} PKR <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-3 z-0"></div>

                        <SpotlightCard className="relative z-10 overflow-hidden border-0 shadow-2xl h-64 !p-0 bg-zinc-900" spotlightColor="rgba(255, 255, 255, 0.2)">
                            <div className="h-full relative pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <div className="absolute inset-0 bg-zinc-800 transition-opacity duration-500 ease-in-out"></div>
                                <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white">
                                    <div className="text-primary-foreground/80 text-sm font-medium mb-1 drop-shadow-md">
                                        Top Match for your budget
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 drop-shadow-md">
                                        <MapPin className="h-5 w-5" /> {topMatch.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                                            {topMatch.type}
                                        </span>
                                        <span className="font-semibold text-lg drop-shadow-md">
                                            ~{topMatch.cost.toLocaleString()} PKR
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div>
        </section>
    );
}
