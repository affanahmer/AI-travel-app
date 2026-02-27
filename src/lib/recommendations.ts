import destinationsData from '@/../data/destinations.json';

export interface Destination {
    name: string;
    type: string;
    region: string;
    cost: number;
    weather: string;
    best_season: string;
    activities: string[];
    safety_rating: number;
    user_rating: number;
    image: string;
}

const destinations = destinationsData as Destination[];

export interface ParsedQuery {
    budget: number | null;
    days: number | null;
    type: string | null;
    region: string | null;
}

export function parseNaturalLanguageQuery(query: string): ParsedQuery {
    const result: ParsedQuery = {
        budget: null,
        days: null,
        type: null,
        region: null
    };

    if (!query) return result;

    const lowerQuery = query.toLowerCase();

    // 1. Extract Budget (e.g. "under 25,000", "40k", "25000 PKR")
    const budgetMatch = lowerQuery.match(/(?:under|below|max)?\s*(\d{1,3}(?:,\d{3})*|\d+)\s*(k|pkr|rs)?/i);
    if (budgetMatch) {
        let num = parseInt(budgetMatch[1].replace(/,/g, ''));
        if (budgetMatch[2]?.toLowerCase() === 'k' || lowerQuery.includes(' k')) num *= 1000;
        // ensure realistic
        if (num > 1000) result.budget = num;
    }

    // 2. Extract Days (e.g. "3-day", "5 days", "weekend")
    const daysMatch = lowerQuery.match(/(\d+)\s*[- ]*(day|days|week)/i);
    if (daysMatch) {
        if (daysMatch[2].startsWith('week')) {
            result.days = parseInt(daysMatch[1]) * 7;
        } else {
            result.days = parseInt(daysMatch[1]);
        }
    } else if (lowerQuery.includes('weekend')) {
        result.days = 2;
    }

    // 3. Extract Travel Type (Adventure, Relaxation, Family, Historical, Cultural)
    const types = ["Adventure", "Relaxation", "Family", "Historical", "Cultural"];
    for (const t of types) {
        if (lowerQuery.includes(t.toLowerCase())) {
            result.type = t;
            break;
        }
    }

    // additional heuristics
    if (!result.type) {
        if (lowerQuery.includes('beach') || lowerQuery.includes('chill')) result.type = "Relaxation";
        if (lowerQuery.includes('mountain') || lowerQuery.includes('trek')) result.type = "Adventure";
        if (lowerQuery.includes('kids') || lowerQuery.includes('safe')) result.type = "Family";
    }

    // 4. Extract Region (Punjab, Balochistan, Gilgit, Sindh, etc.)
    const regions = ["Punjab", "Balochistan", "Gilgit Baltistan", "Sindh", "KPK", "Northern"];
    for (const r of regions) {
        if (lowerQuery.includes(r.toLowerCase())) {
            result.region = r === "Northern" ? "Gilgit Baltistan" : r;
            break;
        }
    }

    return result;
}

export function getRecommendations(parsedParams: ParsedQuery): Destination[] {
    return destinations.filter(dest => {
        // Content-Based Filtering Heuristics
        // If budget provided, filter within 15% buffer
        if (parsedParams.budget && dest.cost > (parsedParams.budget * 1.15)) return false;

        // If type provided, must match it or its activities
        if (parsedParams.type && dest.type !== parsedParams.type) return false;

        // If region provided, must match
        if (parsedParams.region && dest.region !== parsedParams.region) return false;

        return true;
    }).sort((a, b) => {
        // Sort by user rating
        return b.user_rating - a.user_rating;
    });
}

// Generate fallback recommendations for empty/generic queries
export function getTrendingOrColdStart(): Destination[] {
    return destinations.sort((a, b) => b.user_rating - a.user_rating).slice(0, 3);
}
