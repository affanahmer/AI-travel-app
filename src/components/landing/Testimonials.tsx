import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import React from 'react';
import TextPressure from "@/components/reactbits/TextPressure";

export function Testimonials() {
    const reviews = [
        {
            name: "Ali Hassan",
            trip: "Hunza Valley",
            text: "The AI suggestions saved me Rs. 15,000 on my week-long trip. The itinerary was spot on!",
            rating: 5,
        },
        {
            name: "Sarah Ahmed",
            trip: "Gwadar Beach",
            text: "I literally just typed 'relaxing beach under 40k' and it planned my entire weekend getaway perfectly.",
            rating: 5,
        },
        {
            name: "Usman Raza",
            trip: "Swat Valley",
            text: "The best part is how it dynamically matched my family's needs with child-friendly activities.",
            rating: 4,
        },
        {
            name: "Fatima Khan",
            trip: "Lahore Cultural Tour",
            text: "I live in Pakistan but this app helped me discover historical spots in my own city I never knew existed.",
            rating: 5,
        },
        {
            name: "Bilal Tariq",
            trip: "Skardu Adventure",
            text: "It was so easy to tweak the budget. 10/10 would recommend to anyone planning a trip to the North.",
            rating: 5,
        }
    ];

    return (
        <section className="py-24 bg-background overflow-hidden relative border-y">
            <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Travelers Love Us</h2>
                <p className="text-muted-foreground">Don&apos;t just take our word for it.</p>
            </div>

            <div className="relative flex w-full h-[600px] overflow-hidden items-center justify-center">
                {/* Background TextPressure */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
                    <TextPressure
                        text="TRAVELERS"
                        flex={true}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#000000"
                        minFontSize={120}
                    />
                </div>

                {/* Magic UI style Marquee implementation */}
                <div className="group/marquee relative w-full flex overflow-hidden z-10">
                    <div className="animate-marquee flex gap-6 px-4 whitespace-nowrap py-12 items-center group-hover/marquee:[animation-play-state:paused]">
                        {[...reviews, ...reviews, ...reviews].map((review, i) => (
                            <Card key={i} className="relative z-20 min-w-[350px] max-w-[400px] shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-md cursor-pointer transition-all duration-300 group-hover/marquee:opacity-40 hover:!opacity-100 hover:scale-105">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-300 italic mb-6 break-words whitespace-normal text-sm md:text-base h-[80px]">
                                        &#34;{review.text}&#34;
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-semibold text-sm">{review.name}</span>
                                        <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                                            {review.trip}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
                {/* Gradient Fades */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-20"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-20"></div>
            </div>
        </section>
    );
}
