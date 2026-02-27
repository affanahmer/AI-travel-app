import { Button } from "@/components/ui/button";
import { Tent, Waves, Users, Landmark, Camera } from "lucide-react";
import Magnet from "@/components/reactbits/Magnet";

export function TravelStyles() {
    const styles = [
        { name: "Adventure", icon: <Tent className="h-5 w-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
        { name: "Relaxation", icon: <Waves className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Family", icon: <Users className="h-5 w-5" />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "Historical", icon: <Landmark className="h-5 w-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { name: "Cultural", icon: <Camera className="h-5 w-5" />, color: "text-pink-500", bg: "bg-pink-500/10" },
    ];

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Travel Your Way</h2>
                    <p className="text-muted-foreground">
                        Whether you&apos;re a thrill-seeker or looking to unwind, filter destinations by your preferred travel style.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {styles.map((style) => (
                        <Magnet key={style.name} padding={50} disabled={false} magnetStrength={2}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-16 px-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-background text-foreground hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-colors duration-150 ease-out"
                            >
                                <div className={`mr-3 p-2 rounded-full ${style.bg} ${style.color} transition-colors group-hover:bg-transparent`}>
                                    {style.icon}
                                </div>
                                <span className="text-base font-semibold">{style.name}</span>
                            </Button>
                        </Magnet>
                    ))}
                </div>
            </div>
        </section>
    );
}
