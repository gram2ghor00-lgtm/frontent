"use client";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPixel, trackPageView } from "@/lib/metaPixel";

const CACHE_KEY_ID = "gram_pixel_id";
const CACHE_KEY_ENABLED = "gram_pixel_enabled";

function PixelRouteTracker({ isEnabled }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isEnabled) return;
        // Trigger PageView on route changes
        trackPageView();
    }, [pathname, searchParams, isEnabled]);

    return null;
}

export default function MetaPixel() {
    const [pixelConfig, setPixelConfig] = useState({
        pixelId: "",
        isEnabled: false
    });

    useEffect(() => {
        let isMounted = true;

        // 1. Fast boot: check localStorage cache to initialize with 0ms delay
        try {
            const cachedId = localStorage.getItem(CACHE_KEY_ID);
            const cachedEnabled = localStorage.getItem(CACHE_KEY_ENABLED) === "true";

            if (cachedId && cachedEnabled) {
                setPixelConfig({ pixelId: cachedId, isEnabled: true });
                initPixel(cachedId);
            }
        } catch {
            // LocalStorage might be disabled in private mode
        }

        // 2. Fetch fresh config from backend to stay in sync with admin changes
        const syncPixelSettings = async () => {
            try {
                const res = await fetch("/api/client/pixel/config", {
                    cache: "no-store"
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && isMounted) {
                        const newId = data.data?.pixelId || "";
                        const newEnabled = Boolean(data.data?.isEnabled && newId);

                        setPixelConfig({ pixelId: newId, isEnabled: newEnabled });

                        try {
                            localStorage.setItem(CACHE_KEY_ID, newId);
                            localStorage.setItem(CACHE_KEY_ENABLED, String(newEnabled));
                        } catch {}

                        if (newEnabled && newId) {
                            initPixel(newId);
                        }
                        return;
                    }
                }

                // Fallback to environment variable or configured client pixel ID
                const fallbackId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1450696980557999";
                if (fallbackId && isMounted) {
                    setPixelConfig({ pixelId: fallbackId, isEnabled: true });
                    initPixel(fallbackId);
                }
            } catch (err) {
                // If API is temporarily unreachable, fallback to env variable or configured client pixel ID
                const fallbackId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1450696980557999";
                if (fallbackId && isMounted) {
                    setPixelConfig({ pixelId: fallbackId, isEnabled: true });
                    initPixel(fallbackId);
                }
            }
        };

        syncPixelSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!pixelConfig.isEnabled || !pixelConfig.pixelId) {
        return null;
    }

    return (
        <>
            <Suspense fallback={null}>
                <PixelRouteTracker isEnabled={pixelConfig.isEnabled} />
            </Suspense>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${pixelConfig.pixelId}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}
