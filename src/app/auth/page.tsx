'use client';

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function AuthComponent() {
    const searchParams = useSearchParams();
    const isRegistering = searchParams.get("register") === "true";
    const [isSign, setIsSign] = useState(!isRegistering);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Search className="h-5 w-5 text-primary" />
                        </div>
                    </Link>
                    <CardTitle className="text-2xl font-bold">
                        {isSign ? "Welcome back" : "Create an account"}
                    </CardTitle>
                    <CardDescription>
                        {isSign
                            ? "Enter your credentials to access your trips"
                            : "Sign up to save your travel preferences and history"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isSign && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="Ali Hassan" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Password</label>
                            {isSign && <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>}
                        </div>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/profile" className="w-full">
                        <Button className="w-full h-11">
                            {isSign ? "Sign In" : "Register"}
                        </Button>
                    </Link>
                    <div className="text-center text-sm text-muted-foreground w-full">
                        {isSign ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsSign(!isSign)}
                            className="text-primary font-medium hover:underline px-1"
                        >
                            {isSign ? "Sign up" : "Log in"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthComponent />
        </Suspense>
    );
}
