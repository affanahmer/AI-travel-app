import { useAuthStore } from '@/store/useAuthStore';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
    const token = useAuthStore.getState().token;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'API request failed');
    }

    return response.json();
}

export interface Destination {
    _id: string;
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

export interface Trip {
    _id: string;
    user_id: string;
    destination_id: string;
    query_parameters: {
        days: number;
        budget: number;
    };
    budget_breakdown: {
        hotel: number;
        travel: number;
        meals: number;
        total: number;
    };
    saved_at: string;
}

// Destination API
export const destinationsApi = {
    getAll: (params?: { region?: string; type?: string; max_cost?: number }) => {
        const query = new URLSearchParams();
        if (params?.region) query.append('region', params.region);
        if (params?.type) query.append('type', params.type);
        if (params?.max_cost) query.append('max_cost', params.max_cost.toString());
        return fetchFromAPI(`/destinations/?${query.toString()}`);
    },
    getById: (id: string) => fetchFromAPI(`/destinations/${id}`),
};

// Search & AI API
export const searchApi = {
    parse: (query: string) => fetchFromAPI('/search/parse', {
        method: 'POST',
        body: JSON.stringify({ query }),
    }),
    getRecommendations: (query: string, params?: any) => fetchFromAPI('/search/recommendations', {
        method: 'POST',
        body: JSON.stringify({ query, params }),
    }),
};

// Trips API
export const tripsApi = {
    calculate: (destinationId: string, days: number) => fetchFromAPI('/trips/calculate', {
        method: 'POST',
        body: JSON.stringify({ destination_id: destinationId, days }),
    }),
    save: (tripData: any) => fetchFromAPI('/trips/save', {
        method: 'POST',
        body: JSON.stringify(tripData),
    }),
    getMyTrips: () => fetchFromAPI('/trips/my-trips'),
    deleteTrip: (tripId: string) => fetchFromAPI(`/trips/my-trips/${tripId}`, {
        method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
    login: (data: any) => fetchFromAPI('/users/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    register: (data: any) => fetchFromAPI('/users/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getProfile: () => fetchFromAPI('/users/profile'),
    updatePreferences: (data: any) => fetchFromAPI('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};
