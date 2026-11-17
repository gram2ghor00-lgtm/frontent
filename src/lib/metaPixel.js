// Client-side Meta Pixel helper utility for Gram2Ghor
// Senior-level implementation: handles race-conditions, queueing, and Meta Ads DPA catalog specs

let activePixelId = null;
let pixelInitialized = false;
const eventQueue = [];

/**
 * Initialize Meta Pixel script dynamically
 */
export const initPixel = (pixelId) => {
    if (typeof window === "undefined" || !pixelId) return;

    activePixelId = pixelId;

    if (!window.fbq) {
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    if (!pixelInitialized) {
        window.fbq('init', pixelId);
        pixelInitialized = true;
    }

    // Flush any events that were queued before pixel initialization finished
    while (eventQueue.length > 0) {
        const queued = eventQueue.shift();
        try {
            window.fbq('track', queued.name, queued.data);
        } catch (e) {
            console.warn(`[MetaPixel] Error flushing queued event ${queued.name}:`, e);
        }
    }
};

/**
 * Check if pixel is ready to receive events
 */
export const isPixelReady = () => {
    return typeof window !== "undefined" && typeof window.fbq === "function" && pixelInitialized;
};

/**
 * Safe event tracker with automatic pre-init queueing
 */
export const trackEvent = (eventName, data = {}) => {
    try {
        if (typeof window === "undefined") return;

        if (window.fbq && pixelInitialized) {
            window.fbq("track", eventName, data);
        } else {
            // Queue the event so it fires immediately once initPixel is called
            eventQueue.push({ name: eventName, data });
        }
    } catch (err) {
        console.warn(`[MetaPixel] Failed to track ${eventName}:`, err);
    }
};

/**
 * Track PageView on initial load and route changes
 */
export const trackPageView = () => {
    trackEvent("PageView");
};

/**
 * Track ViewContent when a product details page is visited
 * Includes both content_ids & contents for Meta Dynamic Product Ads (DPA)
 */
export const trackViewContent = (product, selectedWeight = 0) => {
    if (!product) return;
    try {
        const weightObj = product.weights?.[selectedWeight] || product.weights?.[0];
        const rawPrice = weightObj ? (weightObj.price - ((weightObj.price * (weightObj.discountPercent || 0)) / 100)) : 0;
        const price = Math.max(0, Number(rawPrice.toFixed(2)));
        const productId = String(product._id || product.id || "");

        trackEvent("ViewContent", {
            content_name: String(product.firstName || product.name || "Product"),
            content_category: String(product.category?.category_name || "Organic Food"),
            content_ids: [productId],
            content_type: "product",
            value: price,
            currency: "BDT",
            contents: [
                {
                    id: productId,
                    quantity: 1,
                    item_price: price
                }
            ]
        });
    } catch (err) {
        console.warn("[MetaPixel] ViewContent error:", err);
    }
};

/**
 * Track AddToCart when a user adds a product to the cart
 * Includes both content_ids & contents for Meta Ads Machine Learning
 */
export const trackAddToCart = ({ productId, productName, price = 0, quantity = 1, category = "" }) => {
    try {
        const validQty = Math.max(1, Number(quantity) || 1);
        const validPrice = Math.max(0, Number(price) || 0);
        const totalValue = Number((validPrice * validQty).toFixed(2));
        const pId = String(productId || "");

        trackEvent("AddToCart", {
            content_name: String(productName || "Product"),
            content_category: String(category || "Organic Food"),
            content_ids: [pId],
            content_type: "product",
            value: totalValue,
            currency: "BDT",
            num_items: validQty,
            contents: [
                {
                    id: pId,
                    quantity: validQty,
                    item_price: validPrice
                }
            ]
        });
    } catch (err) {
        console.warn("[MetaPixel] AddToCart error:", err);
    }
};

/**
 * Track InitiateCheckout when the user visits the checkout page
 */
export const trackInitiateCheckout = (items = [], totalAmount = 0) => {
    try {
        const validItems = Array.isArray(items) ? items : [];
        const contentIds = validItems.map(item => String(item.productId || item._id || ""));
        const numItems = validItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        const validTotal = Math.max(0, Number(totalAmount) || 0);

        const contents = validItems.map(item => {
            const rawPrice = item.price ? (item.price - ((item.price * (item.discountPercent || 0)) / 100)) : 0;
            return {
                id: String(item.productId || item._id || ""),
                quantity: Number(item.quantity) || 1,
                item_price: Math.max(0, Number(rawPrice.toFixed(2)))
            };
        });

        trackEvent("InitiateCheckout", {
            content_ids: contentIds,
            content_type: "product",
            value: Number(validTotal.toFixed(2)),
            currency: "BDT",
            num_items: numItems,
            contents: contents
        });
    } catch (err) {
        console.warn("[MetaPixel] InitiateCheckout error:", err);
    }
};

/**
 * Track Purchase after order is successfully placed
 * Ensures unique orderId, complete contents array, and exact BDT currency
 */
export const trackPurchase = ({ orderId, totalAmount = 0, items = [] }) => {
    try {
        const validItems = Array.isArray(items) ? items : [];
        const contentIds = validItems.map(item => String(item.productId || item._id || ""));
        const numItems = validItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        const validTotal = Math.max(0, Number(totalAmount) || 0);

        const contents = validItems.map(item => {
            const rawPrice = item.price ? (item.price - ((item.price * (item.discountPercent || 0)) / 100)) : 0;
            return {
                id: String(item.productId || item._id || ""),
                quantity: Number(item.quantity) || 1,
                item_price: Math.max(0, Number(rawPrice.toFixed(2)))
            };
        });

        trackEvent("Purchase", {
            content_name: "Gram2Ghor Order",
            content_ids: contentIds,
            content_type: "product",
            value: Number(validTotal.toFixed(2)),
            currency: "BDT",
            num_items: numItems,
            order_id: String(orderId || ""),
            contents: contents
        });
    } catch (err) {
        console.warn("[MetaPixel] Purchase error:", err);
    }
};
