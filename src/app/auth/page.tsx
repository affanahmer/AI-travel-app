'use client';

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

function AuthComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isRegistering = searchParams.get("register") === "true";

    const [isSign, setIsSign] = useState(!isRegistering);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSign) {
                // Login
                const data = await usersApi.login({ email, password });
                login(data.user, data.token);
            } else {
                // Register
                const data = await usersApi.register({ name, email, password });
                login(data.user, data.token);
            }
            // Optional: Get 'redirect' query parameter
            const redirectParams = searchParams.get('redirect');
            if (redirectParams) {
                router.push(redirectParams);
            } else {
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
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
                        {error && (
                            <div className="mt-2 p-2 bg-red-100 text-red-600 text-sm rounded-md">
                                {error}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isSign && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    placeholder="Ali Hassan"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Password</label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full h-11" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSign ? "Sign In" : "Register"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground w-full">
                            {isSign ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSign(!isSign);
                                    setError(null);
                                }}
                                className="text-primary font-medium hover:underline px-1"
                            >
                                {isSign ? "Sign up" : "Log in"}
                            </button>
                        </div>
                    </CardFooter>
                </form>
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
