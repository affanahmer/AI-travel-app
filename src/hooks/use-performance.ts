'use client';

import { useSyncExternalStore } from 'react';

interface PerformanceResult {
    isLowPowerMode: boolean;
    isMobile: boolean;
    isWeakGPU: boolean;
    shouldReduceMotion: boolean;
}

// Cached server snapshot — must be the SAME reference every call
const SERVER_SNAPSHOT: PerformanceResult = Object.freeze({
    isLowPowerMode: false,
    isMobile: false,
    isWeakGPU: false,
    shouldReduceMotion: false,
});

// Cached client snapshot — computed once, reused forever
let clientSnapshot: PerformanceResult | null = null;

function detectWeakGPU(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return true; // No WebGL = definitely weak

        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
            // Known software/weak renderers
            if (
                renderer.includes('swiftshader') ||
                renderer.includes('llvmpipe') ||
                renderer.includes('softpipe') ||
                renderer.includes('software') ||
                renderer.includes('mesa') ||
                renderer.includes('microsoft basic render')
            ) {
                return true;
            }
        }

        // Low core count is a reasonable proxy for weak hardware
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            return true;
        }

        // Check device memory if available
        if ('deviceMemory' in navigator && (navigator as Record<string, unknown>).deviceMemory as number <= 2) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

function getSnapshot(): PerformanceResult {
    if (clientSnapshot) return clientSnapshot;

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isLowPowerMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isWeakGPU = detectWeakGPU();

    clientSnapshot = Object.freeze({
        isLowPowerMode,
        isMobile,
        isWeakGPU,
        shouldReduceMotion: isLowPowerMode || isMobile || isWeakGPU,
    });
    return clientSnapshot;
}

function getServerSnapshot(): PerformanceResult {
    return SERVER_SNAPSHOT;
}

function subscribe() {
    return () => { };
}

export function usePerformance() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
