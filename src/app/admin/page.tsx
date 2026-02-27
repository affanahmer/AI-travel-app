import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Activity, DollarSign, Plus, Settings } from "lucide-react";
import React from 'react';
import data from "@/../data/destinations.json";

export default function AdminDashboard() {
    const stats = [
        { title: "Total Users", value: "8,234", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: "Active Destinations", value: data.length.toString(), icon: <MapPin className="h-4 w-4 text-muted-foreground" /> },
        { title: "Searches Today", value: "1,429", icon: <Activity className="h-4 w-4 text-muted-foreground" /> },
        { title: "Avg. Budget Searched", value: "45,000 PKR", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950/50 flex flex-col md:flex-row">
            {/* Admin Sidebar */}
            <div className="w-full md:w-64 bg-background border-r p-4 hidden md:block">
                <div className="flex items-center gap-2 mb-8 px-2 py-4">
                    <div className="h-8 w-8 bg-zinc-900 dark:bg-zinc-100 rounded-md flex items-center justify-center">
                        <Settings className="h-4 w-4 text-zinc-50 dark:text-zinc-900" />
                    </div>
                    <span className="font-bold text-lg">Admin Panel</span>
                </div>
                <nav className="space-y-2 text-sm font-medium">
                    <Button variant="secondary" className="w-full justify-start">Dashboard</Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">Destinations</Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">Users</Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">AI Models</Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">Settings</Button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 pt-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                        <p className="text-muted-foreground">Monitor travel app performance and manage data.</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Destination
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Data Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Destination Management</CardTitle>
                        <CardDescription>View and edit the currently served mock destination dataset.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Region</th>
                                        <th className="px-4 py-3 font-medium">Type</th>
                                        <th className="px-4 py-3 font-medium">Cost (PKR)</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.map((dest, i) => (
                                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">{dest.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{dest.region}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline">{dest.type}</Badge>
                                            </td>
                                            <td className="px-4 py-3">{dest.cost.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
