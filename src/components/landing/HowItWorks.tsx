import { MessageSquareText, Sparkles, Map } from "lucide-react";
import FadeContent from "@/components/reactbits/FadeContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function HowItWorks() {
    const steps = [
        {
            title: "Tell us your preferences",
            description: "Describe your ideal trip, budget, and travel style using natural language.",
            icon: <MessageSquareText className="h-6 w-6 text-primary" />,
        },
        {
            title: "AI curates your trip",
            description: "Our intelligent engine matches your preferences with the best destinations, hotels, and activities.",
            icon: <Sparkles className="h-6 w-6 text-primary" />,
        },
        {
            title: "Pack your bags",
            description: "Review your personalized itinerary, adjust details if needed, and set off on your tailored adventure.",
            icon: <Map className="h-6 w-6 text-primary" />,
        },
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
                    <p className="text-muted-foreground">
                        Planning your next vacation has never been easier. Just three simple steps to your perfect getaway.
                    </p>
                </div>

                <FadeContent blur duration={1000} ease="easeOutCubic" initialOpacity={0}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <SpotlightCard className="!rounded-full !bg-background !p-0 !border-2 border-zinc-200 dark:border-zinc-800 shadow-sm h-24 w-24 flex items-center justify-center" spotlightColor="rgba(58, 41, 255, 0.2)">
                                    <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center pointer-events-none">
                                        {step.icon}
                                    </div>
                                </SpotlightCard>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground px-4">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </FadeContent>
            </div>
        </section>
    );
}
