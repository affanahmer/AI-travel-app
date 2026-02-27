import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mountain, Sun, Palmtree } from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function TravelSuggestions() {
    const suggestions = [
        {
            title: "Top Adventure Spots",
            limit: "under 20,000 PKR",
            icon: <Mountain className="h-5 w-5 text-emerald-500" />,
            color: "emerald",
            spotlightColor: "rgba(16, 185, 129, 0.2)",
            query: "Top Adventure Spots under 20000 PKR"
        },
        {
            title: "Best Weekend Destinations",
            limit: "Near You",
            icon: <Sun className="h-5 w-5 text-amber-500" />,
            color: "amber",
            spotlightColor: "rgba(245, 158, 11, 0.2)",
            query: "Best Weekend Destinations Near Me"
        },
        {
            title: "Relaxing Coastal Escapes",
            limit: "under 30,000 PKR",
            icon: <Palmtree className="h-5 w-5 text-cyan-500" />,
            color: "cyan",
            spotlightColor: "rgba(6, 182, 212, 0.2)",
            query: "Relaxing Coastal Escapes under 30000 PKR"
        }
    ];

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Real-Time Suggestions</h2>
                        <p className="text-muted-foreground">
                            Not sure where to start? Check out these popular query templates to instantly find tailored trips.
                        </p>
                    </div>
                    <Link href="/search" className="text-primary hover:underline font-medium inline-flex items-center mt-4 md:mt-0">
                        View all categories <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestions.map((suggestion, index) => (
                        <Link key={index} href={`/search?q=${encodeURIComponent(suggestion.query)}`} className="block group h-full">
                            <SpotlightCard spotlightColor={suggestion.spotlightColor} className="h-full !p-0 transition-all hover:shadow-md border-zinc-200 dark:border-zinc-800 bg-card text-card-foreground">
                                <CardHeader className="pb-4">
                                    <div className="p-3 rounded-xl w-fit bg-zinc-100 dark:bg-zinc-900 mb-4">
                                        {suggestion.icon}
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {suggestion.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="animate-pulse">{suggestion.limit}</Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Click to instantly generate an itinerary for {suggestion.title.toLowerCase()} specifically tailored to your exact constraints.
                                    </p>
                                </CardContent>
                            </SpotlightCard>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
