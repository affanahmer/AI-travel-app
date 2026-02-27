'use client';

import { useState, useCallback, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { MapPin, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Destination {
    _id: string;
    name: string;
    type: string;
    region: string;
    cost: number;
    weather: string;
    best_season: string;
    activities: string[];
    safety_rating: number;
    user_rating: number;
    image: string;
}

export function BudgetEstimator() {
    const [budget, setBudget] = useState([20000]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [topMatch, setTopMatch] = useState<Destination | null>(null);
    const [animating, setAnimating] = useState(false);

    // Fetch all destinations once
    useEffect(() => {
        async function fetchDestinations() {
            try {
                const res = await fetch(`${API_URL}/destinations/`);
                if (res.ok) {
                    const data = await res.json();
                    setDestinations(data);
                }
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            }
        }
        fetchDestinations();
    }, []);

    // Update top match when budget or destinations change
    useEffect(() => {
        if (destinations.length === 0) return;

        // Find the best destination within budget (with small buffer), sorted by rating
        const withinBudget = destinations
            .filter((d: Destination) => d.cost <= budget[0])
            .sort((a: Destination, b: Destination) => b.user_rating - a.user_rating);

        // If nothing within budget, find the cheapest destination
        const closestMatch = destinations
            .filter((d: Destination) => d.cost <= budget[0] + 5000)
            .sort((a: Destination, b: Destination) => b.user_rating - a.user_rating);

        const newMatch = withinBudget.length > 0
            ? withinBudget[0]
            : closestMatch.length > 0
                ? closestMatch[0]
                : destinations.sort((a, b) => a.cost - b.cost)[0];

        if (newMatch && newMatch._id !== topMatch?._id) {
            setAnimating(true);
            setTimeout(() => {
                setTopMatch(newMatch);
                setAnimating(false);
            }, 200);
        } else if (!topMatch) {
            setTopMatch(newMatch);
        }
    }, [budget, destinations, topMatch]);

    const handleBudgetChange = useCallback((value: number[]) => {
        setBudget(value);
    }, []);

    // Build the image src — handle both local paths and Unsplash URLs
    const imageSrc = topMatch?.image
        ? topMatch.image.startsWith('http')
            ? topMatch.image
            : topMatch.image
        : '';

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

                        <Link href={`/search?q=destinations under ${budget[0]} PKR`} className="inline-flex items-center text-primary font-medium hover:underline pt-4">
                            Explore trips for {budget[0].toLocaleString()} PKR <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-3 z-0"></div>

                        <SpotlightCard className="relative z-10 overflow-hidden border-0 shadow-2xl h-72 !p-0 bg-zinc-900" spotlightColor="rgba(255, 255, 255, 0.2)">
                            <div className={`h-full relative pointer-events-none transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                                {/* Destination Image */}
                                {imageSrc && (
                                    <img
                                        src={imageSrc}
                                        alt={topMatch?.name || 'Destination'}
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                    />
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />

                                {/* Content */}
                                <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white">
                                    <div className="text-white/80 text-sm font-medium mb-1 drop-shadow-md">
                                        Top Match for your budget
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 drop-shadow-md">
                                        <MapPin className="h-5 w-5" /> {topMatch?.name || "Loading..."}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                                                {topMatch?.type || "—"}
                                            </span>
                                            {topMatch?.user_rating && (
                                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {topMatch.user_rating}
                                                </span>
                                            )}
                                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                                                {topMatch?.region || "—"}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-lg drop-shadow-md">
                                            ~{topMatch?.cost.toLocaleString() || "—"} PKR
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
