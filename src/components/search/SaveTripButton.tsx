'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Check } from "lucide-react";
import { tripsApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface SaveTripButtonProps {
    destinationId: string;
    days: number;
    budget: number;
    budgetBreakdown: {
        hotel: number;
        travel: number;
        meals: number;
        total: number;
    } | null;
}

export function SaveTripButton({ destinationId, days, budget, budgetBreakdown }: SaveTripButtonProps) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    const handleSave = async () => {
        if (!isAuthenticated) {
            router.push('/auth');
            return;
        }

        setLoading(true);
        try {
            await tripsApi.save({
                destination_id: destinationId,
                query_parameters: {
                    days,
                    budget: budget || 0
                },
                budget_breakdown: budgetBreakdown || {
                    hotel: 0,
                    travel: 0,
                    meals: 0,
                    total: 0
                }
            });
            setSaved(true);
        } catch (error) {
            console.error("Failed to save trip", error);
            alert("Failed to save trip. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant={saved ? "secondary" : "default"}
            onClick={handleSave}
            disabled={loading || saved}
        >
            {loading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : saved ? (
                <Check className="mr-1 h-4 w-4" />
            ) : (
                <Save className="mr-1 h-4 w-4" />
            )}
            {saved ? "Saved" : "Save Trip"}
        </Button>
    );
}
