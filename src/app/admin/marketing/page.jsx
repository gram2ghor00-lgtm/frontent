"use client";
import React, { useState, useEffect } from "react";
import { authFetch } from "@/services/api";
import {
    FiTrendingUp,
    FiDollarSign,
    FiShoppingBag,
    FiTarget,
    FiLayers,
    FiCopy,
    FiCheck,
    FiRefreshCw,
    FiSettings,
    FiMessageCircle,
    FiExternalLink,
    FiInfo,
    FiCalendar,
    FiActivity,
    FiCheckCircle,
    FiAlertCircle,
    FiEye,
    FiEyeOff,
    FiHelpCircle
} from "react-icons/fi";
import { PiWhatsappLogoBold } from "react-icons/pi";

export default function MetaMarketingSuitePage() {
    const [activeTab, setActiveTab] = useState("insights"); // "insights" | "catalog" | "whatsapp"
    const [loading, setLoading] = useState(true);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copiedFeed, setCopiedFeed] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [dateRange, setDateRange] = useState("last_7d");
    const [message, setMessage] = useState({ type: "", text: "" });

    // Insights State
    const [insightsData, setInsightsData] = useState({
        isDemo: true,
        overview: {
            spend: 18450,
            purchases: 46,
            purchaseValue: 82400,
            roas: 4.47,
            cpa: 401.08,
            impressions: 124500,
            clicks: 3820,
            ctr: 3.07,
            cpc: 4.83
        },
        campaigns: [
            {
                id: "cmp_1",
                name: "Ghee & Honey Conversions - Dhaka Metro",
                status: "ACTIVE",
                spend: 8500,
                purchases: 24,
                purchaseValue: 43200,
                roas: 5.08,
                cpa: 354.16
            },
            {
                id: "cmp_2",
                name: "Organic Mustard Oil Retargeting (Catalog DPA)",
                status: "ACTIVE",
                spend: 5200,
                purchases: 14,
                purchaseValue: 24500,
                roas: 4.71,
                cpa: 371.42
            },
            {
                id: "cmp_3",
                name: "New Arrivals - Spice & Aachar Awareness",
                status: "ACTIVE",
                spend: 4750,
                purchases: 8,
                purchaseValue: 14700,
                roas: 3.09,
                cpa: 593.75
            }
        ]
    });

    // Settings State
    const [settings, setSettings] = useState({
        adAccountId: "",
        hasMetaToken: false,
        maskedToken: "",
        metaAccessToken: "",
        whatsappOwnerPhone: "8801822858380",
        whatsappEnabled: true,
        catalogEnabled: true
    });

    const catalogFeedUrl = typeof window !== "undefined"
        ? `${window.location.origin}/api/client/marketing/catalog.xml`
        : "https://gram2ghor.com/api/client/marketing/catalog.xml";

    useEffect(() => {
        fetchSettingsAndInsights();
    }, []);

    const fetchSettingsAndInsights = async () => {
        setLoading(true);
        try {
            // 1. Fetch settings
            const setRes = await authFetch("/api/admin/marketing/get-settings");
            if (setRes.ok) {
                const setData = await setRes.json();
                if (setData.success && setData.data) {
                    setSettings(prev => ({
                        ...prev,
                        adAccountId: setData.data.adAccountId || "",
                        hasMetaToken: setData.data.hasMetaToken || false,
                        maskedToken: setData.data.maskedToken || "",
                        whatsappOwnerPhone: setData.data.whatsappOwnerPhone || "8801822858380",
                        whatsappEnabled: setData.data.whatsappEnabled ?? true,
                        catalogEnabled: setData.data.catalogEnabled ?? true
                    }));
                }
            }

            // 2. Fetch insights
            await fetchInsights(dateRange);
        } catch (error) {
            console.error("Marketing suite load error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async (range) => {
        setInsightsLoading(true);
        try {
            const res = await authFetch(`/api/admin/marketing/insights?range=${range}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setInsightsData({
                        isDemo: Boolean(data.isDemo),
                        overview: data.data.overview || insightsData.overview,
                        campaigns: data.data.campaigns || []
                    });
                }
            }
        } catch (error) {
            console.error("Fetch insights error:", error);
        } finally {
            setInsightsLoading(false);
        }
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
        fetchInsights(range);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await authFetch("/api/admin/marketing/save-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setMessage({
                        type: "success",
                        text: "মেটা মার্কেটিং ও অটোমেশন সেটিংস সফলভাবে সেভ হয়েছে!"
                    });
                    setShowConfigModal(false);
                    fetchInsights(dateRange);
                } else {
                    setMessage({ type: "error", text: data.message || "সেভ করতে সমস্যা হয়েছে।" });
                }
            } else {
                setMessage({
                    type: "warning",
                    text: "ব্রাউজারে কনফিগারেশন আপডেট হয়েছে। সম্পূর্ণ সিঙ্কের জন্য cPanel-এ src ফোল্ডার কপি করে অ্যাপ রিস্টার্ট করুন।"
                });
            }
        } catch (error) {
            console.error("Save settings error:", error);
            setMessage({ type: "error", text: "সার্ভার কানেকশন এরর।" });
        } finally {
            setSaving(false);
        }
    };

    const copyFeedUrl = () => {
        navigator.clipboard.writeText(catalogFeedUrl);
        setCopiedFeed(true);
        setTimeout(() => setCopiedFeed(false), 2500);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[450px]">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Meta Business Suite Pro
                        </span>
                        {insightsData.isDemo && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                প্রিভিউ / ডেমো মোড
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Meta Growth &amp; Marketing Engine
                    </h1>
                    <p className="text-sm text-slate-300 mt-1">
                        বিজ্ঞাপনের আসল লাভ (ROAS), ফেসবুক ও ইনস্টাগ্রাম শপ সিঙ্ক, এবং হোয়াটসঅ্যাপ অটোমেশন
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowConfigModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition backdrop-blur-sm border border-white/10 shadow"
                    >
                        <FiSettings className="w-4 h-4" />
                        <span>মেটা এপিআই কানেক্ট</span>
                    </button>
                    <button
                        onClick={() => fetchInsights(dateRange)}
                        disabled={insightsLoading}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow disabled:opacity-50"
                        title="রিফ্রেশ করুন"
                    >
                        <FiRefreshCw className={`w-4 h-4 ${insightsLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Notification Alert */}
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
                    ) : (
                        <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* 3 Main Tabs Navigation */}
            <div className="flex border-b border-gray-200 bg-white rounded-t-2xl px-4 pt-3 gap-2">
                <button
                    onClick={() => setActiveTab("insights")}
                    className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
                        activeTab === "insights"
                            ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                    <FiTrendingUp className="w-4 h-4" />
                    <span>১. লাইভ মেটা অ্যাডস অ্যানালিটিক্স (ROAS)</span>
                </button>

                <button
                    onClick={() => setActiveTab("catalog")}
                    className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
                        activeTab === "catalog"
                            ? "border-emerald-600 text-emerald-600 bg-emerald-50/50"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                    <FiLayers className="w-4 h-4" />
                    <span>২. ফেসবুক ও ইনস্টাগ্রাম শপ সিঙ্ক (Catalog)</span>
                </button>

                <button
                    onClick={() => setActiveTab("whatsapp")}
                    className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
                        activeTab === "whatsapp"
                            ? "border-green-600 text-green-700 bg-green-50/50"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                    <PiWhatsappLogoBold className="w-5 h-5 text-green-600" />
                    <span>৩. হোয়াটসঅ্যাপ অর্ডার অ্যালার্ট (Automation)</span>
                </button>
            </div>

            {/* ======================================================== */}
            {/* TAB 1: META ADS INSIGHTS & ROAS DASHBOARD                */}
            {/* ======================================================== */}
            {activeTab === "insights" && (
                <div className="space-y-6">
                    {/* Filters & Mode Notification */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">সময়সীমা:</span>
                            <div className="flex flex-wrap gap-1">
                                {[
                                    { label: "আজ (Today)", val: "today" },
                                    { label: "গতকাল (Yesterday)", val: "yesterday" },
                                    { label: "বিগত ৭ দিন", val: "last_7d" },
                                    { label: "বিগত ৩০ দিন", val: "last_30d" },
                                    { label: "সর্বমোট (Lifetime)", val: "maximum" }
                                ].map((item) => (
                                    <button
                                        key={item.val}
                                        onClick={() => handleDateRangeChange(item.val)}
                                        className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                                            dateRange === item.val
                                                ? "bg-indigo-600 text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {insightsData.isDemo && (
                            <button
                                onClick={() => setShowConfigModal(true)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline flex items-center gap-1"
                            >
                                <FiInfo className="w-3.5 h-3.5" />
                                আপনার আসল Ad Account সংযুক্ত করুন
                            </button>
                        )}
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* ROAS Card (Most Important) */}
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-5 rounded-2xl shadow-md space-y-2">
                            <div className="flex items-center justify-between text-indigo-100">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    বিজ্ঞাপনের রিটার্ন (ROAS)
                                </span>
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <FiTarget className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold">{insightsData.overview.roas}x</span>
                                <span className="text-xs font-medium bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                                    {insightsData.overview.roas >= 3 ? "🔥 সুপার লাভজনক" : "স্বাভাবিক"}
                                </span>
                            </div>
                            <p className="text-xs text-indigo-100 pt-1 border-t border-white/20">
                                প্রতি ৳১ বিজ্ঞাপন খরচে ৳{insightsData.overview.roas} টাকার পণ্য বিক্রয় হয়েছে।
                            </p>
                        </div>

                        {/* Revenue Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    অ্যাড থেকে মোট বিক্রয় (Revenue)
                                </span>
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                    <FiDollarSign className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                ৳{insightsData.overview.purchaseValue.toLocaleString()}
                            </div>
                            <p className="text-xs text-emerald-600 font-medium">
                                মোট {insightsData.overview.purchases} টি কনফার্মড সেলস
                            </p>
                        </div>

                        {/* Ad Spend Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    মোট বিজ্ঞাপন খরচ (Ad Spend)
                                </span>
                                <div className="p-2 bg-red-50 rounded-xl text-red-600">
                                    <FiTrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                ৳{insightsData.overview.spend.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500">
                                ফেসবুক ও ইনস্টাগ্রামে মোট বাজেট ব্যয়
                            </p>
                        </div>

                        {/* Cost Per Purchase (CPA) Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    প্রতি অর্ডারে খরচ (CPA)
                                </span>
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <FiShoppingBag className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                ৳{insightsData.overview.cpa.toFixed(0)}
                            </div>
                            <p className="text-xs text-gray-500">
                                প্রতিটি কাস্টমার আনতে মেটাতে গড় খরচ
                            </p>
                        </div>
                    </div>

                    {/* Secondary Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <span className="text-xs text-gray-500 block">মোট প্রদর্শন (Impressions)</span>
                            <span className="text-lg font-bold text-gray-800">
                                {insightsData.overview.impressions.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">ওয়েবসাইট ক্লিকস (Clicks)</span>
                            <span className="text-lg font-bold text-gray-800">
                                {insightsData.overview.clicks.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">ক্লিক রেট (CTR)</span>
                            <span className="text-lg font-bold text-emerald-600">
                                {insightsData.overview.ctr}%
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">প্রতি ক্লিকে খরচ (CPC)</span>
                            <span className="text-lg font-bold text-gray-800">
                                ৳{insightsData.overview.cpc}
                            </span>
                        </div>
                    </div>

                    {/* Campaign Performance Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">
                                    ক্যাম্পেইন পারফরম্যান্স ব্রেকডাউন (Live Campaigns)
                                </h3>
                                <p className="text-xs text-gray-500">
                                    কোন বিজ্ঞাপন থেকে কত লাভ ও বিক্রয় হচ্ছে তার তালিকা
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs border-b">
                                    <tr>
                                        <th className="p-4">ক্যাম্পেইনের নাম</th>
                                        <th className="p-4">স্ট্যাটাস</th>
                                        <th className="p-4 text-right">খরচ (Spend)</th>
                                        <th className="p-4 text-right">অর্ডার সংখ্যা</th>
                                        <th className="p-4 text-right">মোট বিক্রয়</th>
                                        <th className="p-4 text-right">ROAS</th>
                                        <th className="p-4 text-right">CPA</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {insightsData.campaigns.map((camp) => (
                                        <tr key={camp.id} className="hover:bg-gray-50/80 transition">
                                            <td className="p-4 font-medium text-gray-800">
                                                {camp.name}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    {camp.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-semibold text-gray-700">
                                                ৳{camp.spend.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right font-bold text-emerald-600">
                                                {camp.purchases}
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-900">
                                                ৳{camp.purchaseValue.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`font-extrabold px-2 py-0.5 rounded ${
                                                    camp.roas >= 4 ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-800"
                                                }`}>
                                                    {camp.roas}x
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-gray-600">
                                                ৳{camp.cpa.toFixed(0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: FACEBOOK & INSTAGRAM CATALOG SYNC                 */}
            {/* ======================================================== */}
            {activeTab === "catalog" && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FiLayers className="w-6 h-6 text-emerald-600" />
                                    Facebook &amp; Instagram Shop Auto Catalog Sync
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    ওয়েবসাইটের পণ্যসমূহ অটোমেটিক মেটা ক্যাটালগ ও ইনস্টাগ্রাম শপে সিঙ্ক হবে
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                ফিড ইঞ্জিন সক্রিয় (Active)
                            </span>
                        </div>

                        {/* Copy Feed URL Box */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                            <label className="block text-sm font-bold text-gray-800">
                                আপনার স্বয়ংক্রিয় প্রডাক্ট ক্যাটালগ ফিড লিঙ্ক (Data Feed URL):
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={catalogFeedUrl}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm font-mono outline-none select-all"
                                />
                                <button
                                    onClick={copyFeedUrl}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow"
                                >
                                    {copiedFeed ? (
                                        <>
                                            <FiCheck className="w-4 h-4" />
                                            <span>কপি হয়েছে!</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiCopy className="w-4 h-4" />
                                            <span>ফিড লিঙ্ক কপি করুন</span>
                                        </>
                                    )}
                                </button>
                                <a
                                    href={catalogFeedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition text-sm"
                                >
                                    <span>ফিড ভিউ</span>
                                    <FiExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <p className="text-xs text-gray-500">
                                এই ফিডে স্বয়ংক্রিয়ভাবে গ্রাম২ঘরের সমস্ত পণ্য, ছবি, ক্যাটাগরি, স্টক ও ডিসকাউন্টেড দাম মেটা স্ট্যান্ডার্ড অনুযায়ী আপডেট থাকে।
                            </p>
                        </div>

                        {/* Step by Step Guide to connect to Meta Commerce Manager */}
                        <div className="space-y-4 pt-2">
                            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                                <FiHelpCircle className="w-5 h-5 text-indigo-600" />
                                কীভাবে মেটা কমার্স ম্যানেজারে (Meta Commerce Manager) সেট করবেন:
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                                    <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center justify-center text-sm">
                                        ১
                                    </span>
                                    <h4 className="font-semibold text-gray-800 text-sm">Commerce Manager-এ যান</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <a href="https://business.facebook.com/commerce" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                            Meta Commerce Manager
                                        </a>-এ লগইন করে আপনার ক্যাটালগে ক্লিক করুন এবং বাম পাশের <strong>Data Sources</strong> অপশনে যান।
                                    </p>
                                </div>

                                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                                    <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center justify-center text-sm">
                                        ২
                                    </span>
                                    <h4 className="font-semibold text-gray-800 text-sm">Data Feed সিলেক্ট করুন</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <strong>Add Products</strong> ➔ <strong>Data Feed</strong> ➔ <strong>Scheduled Feed</strong> সিলেক্ট করে ওপরের কপি করা ফিড লিঙ্কটি পেস্ট করুন।
                                    </p>
                                </div>

                                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                                    <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center justify-center text-sm">
                                        ৩
                                    </span>
                                    <h4 className="font-semibold text-gray-800 text-sm">Hourly Sync চালু করুন</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        সিঙ্ক শিডিউলে <strong>Hourly</strong> বা <strong>Daily</strong> সিলেক্ট করে সেভ দিন। ব্যাস! ফেসবুক ও ইনস্টাগ্রামে সব পণ্য স্বয়ংক্রিয়ভাবে সিঙ্ক হয়ে যাবে!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: WHATSAPP AUTOMATION & REAL-TIME ALERTS           */}
            {/* ======================================================== */}
            {activeTab === "whatsapp" && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <PiWhatsappLogoBold className="w-6 h-6 text-green-600" />
                                    WhatsApp Order Alerts &amp; Customer Automation
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    নতুন অর্ডার আসলেই সরাসরি আপনার নিজস্ব হোয়াটসঅ্যাপে অ্যালার্ট মেসেজ আসবে
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                হোয়াটসঅ্যাপ রেডি
                            </span>
                        </div>

                        {/* WhatsApp Settings Form */}
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            {/* Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div>
                                    <label htmlFor="whatsappEnabled" className="text-sm font-bold text-gray-800 cursor-pointer">
                                        হোয়াটসঅ্যাপ নোটিফিকেশন সিস্টেম চালু রাখুন
                                    </label>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        অর্ডার প্লেস হলে মালিকের হোয়াটসঅ্যাপে তাৎক্ষণিক মেসেজ পাঠানোর ব্যবস্থা
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="whatsappEnabled"
                                        checked={settings.whatsappEnabled}
                                        onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Owner WhatsApp Number Input */}
                            <div className="space-y-2 max-w-md">
                                <label className="block text-sm font-semibold text-gray-700">
                                    মালিকের ব্যক্তিগত WhatsApp নম্বর (দেশীয় কোড সহ):
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={settings.whatsappOwnerPhone}
                                        onChange={(e) => setSettings({ ...settings, whatsappOwnerPhone: e.target.value })}
                                        placeholder="8801822858380"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 text-sm font-mono focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <PiWhatsappLogoBold className="w-5 h-5 text-green-600 absolute left-3 top-3" />
                                </div>
                                <p className="text-xs text-gray-500">
                                    এই নম্বরে নতুন অর্ডারের মেসেজ পাঠানো হবে (যেমন: 88017XXXXXXXX)।
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow transition disabled:opacity-50"
                            >
                                {saving ? "সেভ হচ্ছে..." : "হোয়াটসঅ্যাপ সেটিংস সেভ করুন"}
                            </button>
                        </form>

                        {/* Live Message Preview (Customer & Admin) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Admin Alert Preview */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    ১. মালিকের কাছে যে মেসেজ যাবে (Admin Alert Preview):
                                </span>
                                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-gray-200 text-sm font-sans space-y-2 shadow-inner">
                                    <div className="bg-white p-3.5 rounded-xl shadow-sm space-y-1.5 max-w-sm">
                                        <p className="font-bold text-emerald-800">🚨 গ্রাম২ঘর: নতুন অর্ডার এসেছে!</p>
                                        <p className="text-xs text-gray-600">অর্ডার আইডি: <strong className="text-gray-900">#ORD-94821</strong></p>
                                        <p className="text-xs text-gray-600">কাস্টমার: <strong>মোঃ তানভীর আহমেদ</strong></p>
                                        <p className="text-xs text-gray-600">ফোন: <strong>01712-XXXXXX</strong></p>
                                        <p className="text-xs text-gray-600">পণ্য: খাঁটি গাওয়া ঘি (১ কেজি) x ১</p>
                                        <p className="text-xs text-emerald-700 font-bold">মোট টাকা: ৳১,৫২০ (Cash on Delivery)</p>
                                        <p className="text-[10px] text-gray-400 text-right mt-1">10:45 PM ✓✓</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Confirmation Preview */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    ২. কাস্টমারের কাছে যে মেসেজ যাবে (Customer Preview):
                                </span>
                                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-gray-200 text-sm font-sans space-y-2 shadow-inner">
                                    <div className="bg-white p-3.5 rounded-xl shadow-sm space-y-1.5 max-w-sm">
                                        <p className="font-bold text-gray-800">আসসালামু আলাইকুম তানভীর ভাই! 🌿</p>
                                        <p className="text-xs text-gray-600">
                                            গ্রাম২ঘর-এ আপনার অর্ডার <strong>#ORD-94821</strong> সফলভাবে গ্রহণ করা হয়েছে।
                                        </p>
                                        <p className="text-xs text-gray-600">মোট পরিশোধযোগ্য: <strong>৳১,৫২০</strong> (পণ্য হাতে পেয়ে পরিশোধ করবেন)।</p>
                                        <p className="text-xs text-blue-600 underline">
                                            https://gram2ghor.com/track-order
                                        </p>
                                        <p className="text-[10px] text-gray-400 text-right mt-1">10:45 PM ✓✓</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL: META AD ACCOUNT & ACCESS TOKEN CONFIGURATION      */}
            {/* ======================================================== */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiSettings className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">Meta Ad Account Connection</h3>
                                    <p className="text-xs text-slate-300">বিজ্ঞাপনের আসল ডাটা দেখতে আপনার Ad Account আইডি দিন</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowConfigModal(false)}
                                className="text-slate-400 hover:text-white text-lg font-bold p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
                            {/* Ad Account ID */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Meta Ad Account ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.adAccountId}
                                    onChange={(e) => setSettings({ ...settings, adAccountId: e.target.value })}
                                    placeholder="উদাহরণ: 123456789012345 (বা act_123456789)"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Meta Ads Manager-এর ওপরে ড্রপডাউনে এই অ্যাকাউন্ট আইডিটি দেখতে পাবেন।
                                </p>
                            </div>

                            {/* Access Token */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Meta Access Token (with ads_read permission)
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
                                    value={settings.metaAccessToken}
                                    onChange={(e) => setSettings({ ...settings, metaAccessToken: e.target.value })}
                                    placeholder={settings.hasMetaToken ? `বর্তমান টোকেন: ${settings.maskedToken}` : "EAA..."}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Meta Business Settings ➔ System Users থেকে তৈরি করা টোকেন। খালি রাখলে ডেমো ডাটা থাকবে।
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowConfigModal(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow transition disabled:opacity-50"
                                >
                                    {saving ? "কানেক্ট হচ্ছে..." : "সংযুক্ত ও সেভ করুন"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
