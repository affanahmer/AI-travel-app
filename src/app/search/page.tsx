import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, CloudSun, Star, Search as SearchIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from 'react';
import { SaveTripButton } from "@/components/search/SaveTripButton";

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

interface ParsedParams {
    destination?: string;
    days?: number;
    budget?: number;
}

async function getRecommendations(query: string): Promise<{ params: ParsedParams; results: Destination[] }> {
    try {
        const res = await fetch(`${API_URL}/search/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('API error');
        return res.json();
    } catch {
        // Fallback: fetch all destinations if backend is down
        try {
            const res = await fetch(`${API_URL}/destinations/`, { cache: 'no-store' });
            const results = await res.json();
            return { params: {}, results };
        } catch {
            return { params: {}, results: [] };
        }
    }
}

async function getAllDestinations(): Promise<Destination[]> {
    try {
        const res = await fetch(`${API_URL}/destinations/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API error');
        return res.json();
    } catch {
        return [];
    }
}

async function getBudgetBreakdown(destId: string, days: number) {
    try {
        const res = await fetch(`${API_URL}/trips/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination_id: destId, days }),
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('API error');
        return res.json();
    } catch {
        return null;
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const rawQuery = (resolvedSearchParams.q as string) || "";
    const parsedBudget = Number(resolvedSearchParams.budget) || null;

    const isSearchActive = !!rawQuery || !!parsedBudget;

    let results: Destination[] = [];
    let parsedParams: ParsedParams = {};

    if (isSearchActive) {
        // Build the query — include budget if provided separately
        const fullQuery = parsedBudget && !rawQuery.includes(String(parsedBudget))
            ? `${rawQuery} under ${parsedBudget}`
            : rawQuery || `destinations under ${parsedBudget}`;

        const data = await getRecommendations(fullQuery);
        results = data.results;
        parsedParams = data.params;
    } else {
        // No search — show all destinations sorted by rating
        results = await getAllDestinations();
    }

    // Fetch budget breakdowns for top results
    const days = parsedParams.days || 3;
    const budgets: Record<string, { days?: number; hotel: number; travel: number; meals: number; total: number }> = {};
    for (const dest of results.slice(0, 6)) {
        if (dest._id) {
            const breakdown = await getBudgetBreakdown(dest._id, days);
            if (breakdown) budgets[dest._id] = breakdown;
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950/50">
            {/* Search Header */}
            <div className="bg-background border-b pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold tracking-tight mb-6">
                            {isSearchActive ? "Your AI-Curated Recommendations" : "Trending & Popular Destinations"}
                        </h1>

                        {/* Active Search Bar */}
                        <form className="relative flex items-center mb-6" action="/search" method="GET">
                            <SearchIcon className="absolute left-4 h-5 w-5 text-muted-foreground" />
                            <Input
                                name="q"
                                defaultValue={rawQuery}
                                placeholder="Try: 3-day family trip to Punjab under 40k"
                                className="pl-12 h-14 bg-zinc-100 dark:bg-zinc-900 border-transparent focus-visible:ring-1 text-base rounded-xl"
                            />
                            <Button type="submit" className="absolute right-2 h-10 rounded-lg">Search</Button>
                        </form>

                        {/* Parsed Attributes Tags */}
                        {isSearchActive && (
                            <div className="flex flex-wrap gap-2 items-center text-sm">
                                <span className="text-muted-foreground mr-2">AI Parsed:</span>
                                {parsedParams.budget && parsedParams.budget > 0 && (
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        Under {parsedParams.budget.toLocaleString()} PKR
                                    </Badge>
                                )}
                                {parsedParams.days && parsedParams.days > 0 && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {parsedParams.days} Days
                                    </Badge>
                                )}
                                {parsedParams.destination && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        {parsedParams.destination}
                                    </Badge>
                                )}
                                {(!parsedParams.budget && !parsedParams.days && !parsedParams.destination) && (
                                    <span className="text-muted-foreground italic">Generic search (No specific constraints detected)</span>
                                )}
                                <Badge variant="outline" className="ml-auto text-xs">
                                    Powered by ML
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="container mx-auto px-4 md:px-6 py-12">
                {results.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
                            <SearchIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No exact matches found</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Try adjusting your budget or broadening your search criteria. You can also browse our trending destinations.
                        </p>
                        <Link href="/search">
                            <Button variant="outline">Clear Filters</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((dest) => {
                            const budget = budgets[dest._id];

                            return (
                                <Card key={dest._id || dest.name} className="overflow-hidden flex flex-col group hover:shadow-lg transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                                    {/* Image Header */}
                                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 relative w-full overflow-hidden">
                                        {dest.image && (dest.image.startsWith('http') || dest.image.startsWith('/')) ? (
                                            <img
                                                src={dest.image}
                                                alt={dest.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-muted-foreground font-medium italic">{dest.image?.split('/').pop()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                                        <div className="absolute bottom-4 left-4 right-4 z-30 flex justify-between items-end text-white">
                                            <div>
                                                <h2 className="text-xl font-bold">{dest.name}</h2>
                                                <div className="flex items-center text-sm text-zinc-300 mt-1">
                                                    <MapPin className="h-3.5 w-3.5 mr-1" /> {dest.region}
                                                </div>
                                            </div>
                                            <Badge className="bg-white/20 hover:bg-white/20 backdrop-blur-md text-white border-0">
                                                {dest.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="pt-6 flex-1">
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground mb-1">Cost / Trip</span>
                                                <span className="font-semibold text-sm flex items-center">PKR {dest.cost.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground mb-1">Weather</span>
                                                <span className="font-semibold text-sm flex items-center"><CloudSun className="h-3.5 w-3.5 mr-1" />{dest.weather}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground mb-1">Rating</span>
                                                <span className="font-semibold text-sm flex items-center"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />{dest.user_rating}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Top Activities</span>
                                            <div className="flex flex-wrap gap-2">
                                                {dest.activities.map(act => (
                                                    <Badge key={act} variant="secondary" className="font-normal">{act}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 border-t p-4 bg-zinc-50 dark:bg-zinc-900/50 mt-auto flex-col gap-4">
                                        {/* Budget Breakdown from API */}
                                        <div className="w-full bg-white dark:bg-zinc-950 rounded-lg p-3 border text-sm">
                                            <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground tracking-wide">
                                                Estimated Budget ({budget ? `${budget.days} days` : `${days} days`})
                                            </h4>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Hotel</span>
                                                    <span className="font-medium">PKR {budget ? budget.hotel.toLocaleString() : (dest.cost * 0.4 * days).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Travel</span>
                                                    <span className="font-medium">PKR {budget ? budget.travel.toLocaleString() : (dest.cost * 0.4).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Meals</span>
                                                    <span className="font-medium">PKR {budget ? budget.meals.toLocaleString() : (dest.cost * 0.2 * days).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-dashed pt-1.5 mt-1.5">
                                                    <span className="font-semibold text-foreground">Total</span>
                                                    <span className="font-bold text-primary">PKR {budget ? budget.total.toLocaleString() : dest.cost.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full">
                                            <div className="text-xs text-muted-foreground flex flex-col">
                                                <span>Best in</span>
                                                <span className="font-medium text-foreground">{dest.best_season}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <SaveTripButton
                                                    destinationId={dest._id}
                                                    days={budget ? budget.days || days : days}
                                                    budget={parsedBudget || dest.cost}
                                                    budgetBreakdown={budget ? {
                                                        hotel: budget.hotel,
                                                        travel: budget.travel,
                                                        meals: budget.meals,
                                                        total: budget.total
                                                    } : null}
                                                />
                                                <Button size="sm" variant="outline">
                                                    Plan Details <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
