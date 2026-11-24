"use client";
import React, { useState, useEffect } from "react";
import { authFetch } from "@/services/api";
import { 
    FiActivity, 
    FiSave, 
    FiCheckCircle, 
    FiAlertCircle, 
    FiInfo, 
    FiExternalLink, 
    FiEye, 
    FiEyeOff 
} from "react-icons/fi";

export default function MetaPixelAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showToken, setShowToken] = useState(false);

    const [form, setForm] = useState({
        pixelId: "",
        isEnabled: false,
        capiToken: "",
        testEventCode: ""
    });

    useEffect(() => {
        fetchPixelConfig();
    }, []);

    const fetchPixelConfig = async () => {
        setLoading(true);
        try {
            const res = await authFetch("/api/admin/pixel/get-pixel");
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setForm({
                        pixelId: data.data.pixelId || "1450696980557999",
                        isEnabled: data.data.pixelId ? Boolean(data.data.isEnabled) : true,
                        capiToken: data.data.capiToken || "",
                        testEventCode: data.data.testEventCode || ""
                    });
                }
            } else {
                // If backend API is not yet updated on cPanel, load from localStorage or default
                try {
                    const cachedId = localStorage.getItem("gram_pixel_id") || "1450696980557999";
                    const cachedEnabled = localStorage.getItem("gram_pixel_enabled") !== "false";
                    setForm(prev => ({
                        ...prev,
                        pixelId: cachedId,
                        isEnabled: cachedEnabled
                    }));
                } catch {}
            }
        } catch (error) {
            console.error("Failed to fetch pixel config:", error);
            // Fallback to client default ID
            setForm(prev => ({
                ...prev,
                pixelId: prev.pixelId || "1450696980557999",
                isEnabled: true
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // Immediately cache in localStorage for instant client-side tracking
            try {
                localStorage.setItem("gram_pixel_id", form.pixelId);
                localStorage.setItem("gram_pixel_enabled", String(form.isEnabled));
            } catch {}

            const res = await authFetch("/api/admin/pixel/save-pixel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setMessage({
                        type: "warning",
                        text: "পিক্সেল আইডি ব্রাউজারে সক্রিয় হয়েছে! তবে cPanel ব্যাকএন্ডে রুটটি এখনও আপডেট করা হয়নি। স্থায়ীভাবে ডাটাবেজে সেভ করার জন্য cPanel > Git Version Control থেকে 'Update from Remote' এবং Node.js App 'Restart' করুন।"
                    });
                    return;
                }
                const errText = await res.text();
                throw new Error(errText);
            }

            const data = await res.json();

            if (data.success) {
                setMessage({
                    type: "success",
                    text: "মেটা পিক্সেল সেটিংস সফলভাবে সেভ হয়েছে! ওয়েবসাইটে এখন ট্র্যাকিং সক্রিয় রয়েছে।"
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "সেভ করতে সমস্যা হয়েছে।"
                });
            }
        } catch (error) {
            console.error("Failed to save pixel config:", error);
            setMessage({
                type: "warning",
                text: "পিক্সেল আইডি ব্রাউজারে সক্রিয় হয়েছে! কিন্তু cPanel ব্যাকএন্ড সার্ভারে কানেক্ট করা যায়নি। দয়া করে cPanel-এ গিয়ে কোড আপডেট এবং রিস্টার্ট করুন।"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <FiActivity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Meta (Facebook) Pixel & CAPI
                        </h1>
                        <p className="text-sm text-gray-500">
                            ই-কমার্স ইভেন্ট ট্র্যাকিং এবং অ্যাড অপ্টিমাইজেশন সেটিংস
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">স্ট্যাটাস:</span>
                    {form.isEnabled && form.pixelId ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            সক্রিয় (Active)
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                            নিষ্ক্রিয় (Inactive)
                        </span>
                    )}
                </div>
            </div>

            {/* Notification Message */}
            {message.text && (
                <div
                    className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                        message.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : message.type === "warning"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {message.type === "success" ? (
                        <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    ) : message.type === "warning" ? (
                        <FiInfo className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    ) : (
                        <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Main Configuration Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Enable / Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <label htmlFor="isEnabled" className="text-sm font-bold text-gray-800 cursor-pointer">
                                মেটা পিক্সেল ট্র্যাকিং চালু করুন (Enable Pixel Tracking)
                            </label>
                            <p className="text-xs text-gray-500 mt-0.5">
                                এটি অন রাখলে ভিজিটরদের ব্রাউজিং এবং কেনাকাটার ইভেন্ট মেটা পিক্সেলে ট্র্যাক হবে।
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="isEnabled"
                                name="isEnabled"
                                checked={form.isEnabled}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    {/* Meta Pixel ID */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Meta Pixel ID / Dataset ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="pixelId"
                            value={form.pixelId}
                            onChange={handleChange}
                            placeholder="উদাহরণ: 1234567890123456"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-mono text-sm"
                            required={form.isEnabled}
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FiInfo className="w-3.5 h-3.5" />
                            Meta Events Manager থেকে ১৫-১৬ ডিজিটের Pixel ID / Dataset ID কপি করে বসান।
                        </p>
                    </div>

                    {/* Conversions API Access Token (Optional) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-semibold text-gray-700">
                                Conversions API (CAPI) Access Token <span className="text-xs text-gray-400 font-normal">(ঐচ্ছিক / Optional)</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowToken(!showToken)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                                {showToken ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                                {showToken ? "লুকান" : "দেখুন"}
                            </button>
                        </div>
                        <input
                            type={showToken ? "text" : "password"}
                            name="capiToken"
                            value={form.capiToken}
                            onChange={handleChange}
                            placeholder="EAA..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            iOS 14+ এবং অ্যাডব্লকার বাইপাস করার জন্য সার্ভার সাইড ট্র্যাকিং টোকেন (Events Manager Settings থেকে পাওয়া যায়)।
                        </p>
                    </div>

                    {/* Test Event Code (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Test Event Code <span className="text-xs text-gray-400 font-normal">(ঐচ্ছিক - টেস্টিংয়ের জন্য)</span>
                        </label>
                        <input
                            type="text"
                            name="testEventCode"
                            value={form.testEventCode}
                            onChange={handleChange}
                            placeholder="উদাহরণ: TEST12345"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            Meta Events Manager-এর &apos;Test Events&apos; ট্যাবের কোড। লাইভ রান করার সময় ফাঁকা রাখতে পারেন।
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>সেভ হচ্ছে...</span>
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4" />
                                    <span>সেটিংস সেভ করুন</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Quick Guide & Automatic Events Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                        স্বয়ংক্রিয়ভাবে ট্র্যাক হওয়া ই-কমার্স ইভেন্টসমূহ:
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">PageView</span>
                            <span>প্রতিটি পেজ ভিজিট অটোমেটিক ট্র্যাক হবে।</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">ViewContent</span>
                            <span>যেকোনো প্রোডাক্টের ডিটেইল পেজে ঢুকলে প্রাইস ও প্রোডাক্ট আইডি সহ ট্র্যাক হবে।</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">AddToCart</span>
                            <span>কাস্টমার প্রোডাক্ট কার্টে যোগ করলে সাথে সাথে ভ্যালু সহ ফায়ার হবে।</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">InitiateCheckout</span>
                            <span>চেকআউট পেজ ওপেন করলে সাবটোটাল ও আইটেম কাউন্ট যাবে।</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-emerald-700 font-mono text-xs bg-emerald-50 px-2 py-0.5 rounded">Purchase</span>
                            <span>অর্ডার কনফার্ম হলে অর্ডার আইডি ও মোট টাকার পরিমাণ সহ ফায়ার হবে।</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <FiInfo className="w-5 h-5 text-blue-600" />
                        পিক্সেল চেক ও টেস্ট করার নিয়ম:
                    </h2>
                    <ol className="space-y-2.5 text-sm text-gray-600 list-decimal list-inside">
                        <li>
                            গুগল ক্রোম ব্রাউজারে{" "}
                            <a 
                                href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc" 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 underline inline-flex items-center gap-0.5 font-medium"
                            >
                                Meta Pixel Helper <FiExternalLink className="w-3 h-3" />
                            </a>{" "}
                            এক্সটেনশনটি ইনস্টল করুন।
                        </li>
                        <li>উপরে আপনার Pixel ID দিয়ে সেভ করুন এবং নিশ্চিত করুন স্ট্যাটাস &apos;Active&apos; দেখাচ্ছে।</li>
                        <li>ওয়েবসাইটে গিয়ে যেকোনো প্রোডাক্ট দেখুন, কার্টে যোগ করুন এবং একটি টেস্ট অর্ডার দিন।</li>
                        <li>এক্সটেনশনে ক্লিক করলে স্বয়ংক্রিয়ভাবে সব ইভেন্টে গ্রিন টিক চিহ্ন দেখতে পাবেন।</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
