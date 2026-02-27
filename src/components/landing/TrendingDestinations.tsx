'use client';

import { Badge } from "@/components/ui/badge";
import { MapPin, CloudSun, DollarSign, Star } from "lucide-react";
import data from "@/../data/destinations.json";
import dynamic from "next/dynamic";
import { usePerformance } from "@/hooks/use-performance";

const TiltedCard = dynamic(() => import("@/components/reactbits/TiltedCard"), { ssr: false });

export function TrendingDestinations() {
    const { shouldReduceMotion } = usePerformance();
    // Taking the first 4 for the bento grid
    const destinations = data.slice(0, 4);

    const destinationImages = [
        "https://images.unsplash.com/photo-1542401886-65d6c6127d47?w=800",
        "https://images.unsplash.com/photo-1506452899064-50012210b3ee?w=800",
        "https://images.unsplash.com/photo-1589808386348-18eaf396f437?w=800",
        "https://images.unsplash.com/photo-1596706069929-deac2c486414?w=800"
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Trending Destinations</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover the most highly-rated spots across Pakistan, curated by our AI based on millions of data points.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                    {destinations.map((dest, i) => {
                        const overlayContent = (
                            <div className="absolute inset-0 w-full h-full flex flex-col justify-end p-6 text-white overflow-hidden rounded-[15px]">
                                {/* Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60" />

                                {/* Content */}
                                <div className="relative z-20 flex flex-col justify-end h-full w-full transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0">
                                            {dest.type}
                                        </Badge>
                                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-sm font-medium">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {dest.user_rating}
                                        </div>
                                    </div>

                                    <h3 className={`${i === 0 ? 'text-3xl' : 'text-xl'} font-bold mb-2`}>{dest.name}</h3>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {dest.region}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-3.5 w-3.5" /> {dest.cost.toLocaleString()} PKR
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CloudSun className="h-3.5 w-3.5" /> {dest.weather}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );

                        return (
                            <div key={dest.name} className={`group block relative w-full h-full cursor-pointer overflow-hidden rounded-[15px] ${i === 0 ? "md:col-span-2 md:row-span-2" : i === 1 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"}`}>
                                {!shouldReduceMotion ? (
                                    <TiltedCard
                                        imageSrc={destinationImages[i] || destinationImages[0]}
                                        altText={dest.name}
                                        containerHeight="100%"
                                        containerWidth="100%"
                                        imageHeight="100%"
                                        imageWidth="100%"
                                        rotateAmplitude={20}
                                        scaleOnHover={1.1}
                                        showMobileWarning={false}
                                        showTooltip={false}
                                        displayOverlayContent={true}
                                        overlayContent={overlayContent}
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={destinationImages[i] || destinationImages[0]}
                                            alt={dest.name}
                                            className="w-full h-full object-cover rounded-[15px]"
                                            loading="lazy"
                                        />
                                        {overlayContent}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
