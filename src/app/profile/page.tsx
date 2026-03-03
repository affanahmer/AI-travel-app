'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, History, Settings, User, Loader2, Trash } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { usersApi, tripsApi, Trip } from "@/lib/api";

export default function ProfilePage() {
    const { user, updateUser, isAuthenticated } = useAuthStore();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("preferences");
    const [loading, setLoading] = useState(false);

    // Preferences state
    const [budgetMin, setBudgetMin] = useState(0);
    const [budgetMax, setBudgetMax] = useState(100000);
    const [duration, setDuration] = useState(3);
    const [style, setStyle] = useState("Adventure");

    // Trips state
    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripsLoading, setTripsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/auth');
            return;
        }

        // Initialize state from auth store
        if (user.preferences) {
            setBudgetMin(user.preferences.budget_range?.[0] || 0);
            setBudgetMax(user.preferences.budget_range?.[1] || 100000);
            setDuration(user.preferences.preferred_duration || 3);
            setStyle(user.preferences.travel_styles?.[0] || "Adventure");
        }
    }, [isAuthenticated, user, router]);

    // Load trips when history tab is active
    useEffect(() => {
        if (activeTab === "history" && isAuthenticated) {
            fetchTrips();
        }
    }, [activeTab, isAuthenticated]);

    const fetchTrips = async () => {
        setTripsLoading(true);
        try {
            const data = await tripsApi.getMyTrips();
            setTrips(data);
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setTripsLoading(false);
        }
    };

    const handleDeleteTrip = async (tripId: string) => {
        try {
            await tripsApi.deleteTrip(tripId);
            setTrips(prev => prev.filter(t => t._id !== tripId));
        } catch (error) {
            console.error("Failed to delete trip", error);
        }
    };

    const savePreferences = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newPrefs = {
                budget_range: [budgetMin, budgetMax],
                preferred_duration: duration,
                travel_styles: [style]
            };

            await usersApi.updatePreferences(newPrefs);
            updateUser({ preferences: newPrefs });
            alert("Preferences saved successfully!");
        } catch (error) {
            console.error("Failed to save preferences", error);
            alert("Failed to save preferences.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || !user) {
        return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <div className="px-4 py-6 border rounded-xl mb-4 bg-background">
                        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-lg text-center md:text-left">{user.name}</h3>
                        <p className="text-sm text-muted-foreground text-center md:text-left">{user.email}</p>
                    </div>

                    <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant={activeTab === "preferences" ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => setActiveTab("preferences")}
                        >
                            <Settings className="mr-2 h-4 w-4" /> Preferences
                        </Button>
                        <Button
                            variant={activeTab === "history" ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => setActiveTab("history")}
                        >
                            <History className="mr-2 h-4 w-4" /> Saved Trips
                        </Button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {activeTab === "preferences" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Travel Preferences</CardTitle>
                                <CardDescription>Update your default preferences to get better AI recommendations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={savePreferences} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Default Budget Range (PKR)</label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="number"
                                                value={budgetMin}
                                                onChange={(e) => setBudgetMin(Number(e.target.value))}
                                                min={0}
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                value={budgetMax}
                                                onChange={(e) => setBudgetMax(Number(e.target.value))}
                                                min={0}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Preferred Travel Style</label>
                                        <select
                                            value={style}
                                            onChange={(e) => setStyle(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                                        >
                                            <option value="Adventure">Adventure</option>
                                            <option value="Relaxation">Relaxation</option>
                                            <option value="Family">Family</option>
                                            <option value="Historical">Historical</option>
                                            <option value="Nature">Nature</option>
                                            <option value="Cultural">Cultural</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Typical Trip Duration (Days)</label>
                                        <Input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            min={1}
                                        />
                                    </div>

                                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save Preferences
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-6">Your Saved Trips</h2>

                            {tripsLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : trips.length === 0 ? (
                                <Card className="p-12 text-center border-dashed">
                                    <p className="text-muted-foreground">You haven't saved any trips yet.</p>
                                    <Button className="mt-4" onClick={() => router.push('/search')}>
                                        Start Exploring
                                    </Button>
                                </Card>
                            ) : (
                                trips.map((trip) => (
                                    <Card key={trip._id} className="overflow-hidden">
                                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:justify-between border-b relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDeleteTrip(trip._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>

                                            <div className="w-full text-left">
                                                <h3 className="font-bold text-lg mb-1">{trip.destination_id}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="outline">{trip.query_parameters.budget?.toLocaleString() || 0} PKR Budget</Badge>
                                                    <Badge variant="outline">{trip.query_parameters.days || 3} Days</Badge>
                                                </div>
                                            </div>

                                            <div className="w-full text-left sm:text-right flex-shrink-0 mt-4 sm:mt-0">
                                                <div className="text-sm mb-2">
                                                    <div className="flex justify-between sm:justify-end gap-4"><span className="text-muted-foreground">Total:</span> <span className="font-bold">{trip.budget_breakdown?.total?.toLocaleString()} PKR</span></div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-3">Saved on {new Date(trip.saved_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
