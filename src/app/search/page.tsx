import { parseNaturalLanguageQuery, getRecommendations, getTrendingOrColdStart } from "@/lib/recommendations";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, DollarSign, CloudSun, Star, Search as SearchIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from 'react';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const rawQuery = (resolvedSearchParams.q as string) || "";
    const parsedBudget = Number(resolvedSearchParams.budget) || null;

    // Use the parsed budget from URL if it exists, otherwise parse from query
    const parsedParams = parseNaturalLanguageQuery(rawQuery);
    if (parsedBudget && !parsedParams.budget) {
        parsedParams.budget = parsedBudget;
    }

    // Get recommendations based on params
    const isSearchActive = !!rawQuery || !!parsedBudget;
    const results = isSearchActive ? getRecommendations(parsedParams) : getTrendingOrColdStart();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950/50">
            {/* Search Header */}
            <div className="bg-background border-b pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold tracking-tight mb-6">
                            {isSearchActive ? "Your Curated Recommendations" : "Trending & Popular Destinations"}
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
                            <Button type="submit" className="absolute right-2 h-10 rounded-lg">Update</Button>
                        </form>

                        {/* Parsed Attributes Tags */}
                        {isSearchActive && (
                            <div className="flex flex-wrap gap-2 items-center text-sm">
                                <span className="text-muted-foreground mr-2">Parsed Filters:</span>
                                {parsedParams.budget && (
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        Under {parsedParams.budget.toLocaleString()} PKR
                                    </Badge>
                                )}
                                {parsedParams.days && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {parsedParams.days} Days
                                    </Badge>
                                )}
                                {parsedParams.type && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                        {parsedParams.type} Style
                                    </Badge>
                                )}
                                {parsedParams.region && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        {parsedParams.region}
                                    </Badge>
                                )}
                                {Object.values(parsedParams).every(v => v === null) && (
                                    <span className="text-muted-foreground italic">Generic search (No specific constraints detected)</span>
                                )}
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
                            <Button variant="outline">Glear Filters</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((dest) => (
                            <Card key={dest.name} className="overflow-hidden flex flex-col group hover:shadow-lg transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                                {/* Image Placeholder */}
                                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 relative w-full flex items-center justify-center">
                                    <span className="text-muted-foreground absolute font-medium italic z-10">{dest.image.split('/').pop()}</span>
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
                                            <span className="font-semibold text-sm flex items-center"><DollarSign className="h-3.5 w-3.5 mr-0.5" />{dest.cost.toLocaleString()}</span>
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
                                    {/* Budget Breakdown Table */}
                                    <div className="w-full bg-white dark:bg-zinc-950 rounded-lg p-3 border text-sm">
                                        <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground tracking-wide">Estimated Budget</h4>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Hotel</span>
                                                <span className="font-medium">{(dest.cost * 0.45).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Travel</span>
                                                <span className="font-medium">{(dest.cost * 0.35).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Meals</span>
                                                <span className="font-medium">{(dest.cost * 0.20).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-dashed pt-1.5 mt-1.5">
                                                <span className="font-semibold text-foreground">Total</span>
                                                <span className="font-bold text-primary">PKR {dest.cost.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-xs text-muted-foreground flex flex-col">
                                            <span>Best in</span>
                                            <span className="font-medium text-foreground">{dest.best_season}</span>
                                        </div>
                                        <Button size="sm">
                                            Plan Details <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
