'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, History, Settings, User } from "lucide-react";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("preferences");

    const savePreferences = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Preferences saved successfully!");
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <div className="px-4 py-6 border rounded-xl mb-4 bg-background">
                        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-lg text-center md:text-left">Ali Hassan</h3>
                        <p className="text-sm text-muted-foreground text-center md:text-left">ali@example.com</p>
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
                                            <Input type="number" defaultValue="20000" />
                                            <span className="text-muted-foreground">to</span>
                                            <Input type="number" defaultValue="50000" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Preferred Travel Style</label>
                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background md:text-sm">
                                            <option>Adventure</option>
                                            <option>Relaxation</option>
                                            <option>Family</option>
                                            <option>Historical</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Typical Trip Duration (Days)</label>
                                        <Input type="number" defaultValue="3" />
                                    </div>

                                    <Button type="submit" className="w-full sm:w-auto">
                                        <Save className="mr-2 h-4 w-4" /> Save Preferences
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-6">Your Saved Trips</h2>
                            {/* Mock Trip History */}
                            <Card className="overflow-hidden">
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:justify-between border-b">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Hunza Valley Exploration</h3>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">Adventure</Badge>
                                            <Badge variant="outline">25,000 PKR</Badge>
                                            <Badge variant="outline">5 Days</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm text-muted-foreground mb-2">Saved 2 days ago</p>
                                        <Button size="sm" variant="outline">View Itinerary</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
