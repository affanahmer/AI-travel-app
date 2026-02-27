'use client';

import { usePerformance } from '@/hooks/use-performance';
import dynamic from 'next/dynamic';

// Lazy-load the entire SplashCursor — don't even parse the 1293 lines of WebGL unless needed
const SplashCursor = dynamic(() => import('@/components/reactbits/SplashCursor'), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const { shouldReduceMotion } = usePerformance();

    return (
        <>
            {!shouldReduceMotion && <SplashCursor />}
            {children}
        </>
    );
}
