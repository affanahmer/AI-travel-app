import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg">AI Travel</h3>
                        <p className="text-sm text-muted-foreground">
                            Your personal AI-powered travel planning assistant. Curated trips matching your style and budget.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/search" className="hover:text-primary transition-colors">Destinations</Link></li>
                            <li><Link href="/search" className="hover:text-primary transition-colors">Trip Planner</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Account</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/auth" className="hover:text-primary transition-colors">Login / Register</Link></li>
                            <li><Link href="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Admin</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} AI Travel App. CS619 Prototype.</p>
                </div>
            </div>
        </footer>
    );
}
