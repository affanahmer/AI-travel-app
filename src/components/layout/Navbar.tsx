'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Plane className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl hidden sm:inline-block">
                        AI Travel
                    </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/search" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Explore
                    </Link>
                    <div className="flex items-center space-x-2">
                        {isAuthenticated && user ? (
                            <>
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                                        <User className="mr-2 h-4 w-4" />
                                        {user.name}
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4 hidden sm:inline" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth?register=true">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
