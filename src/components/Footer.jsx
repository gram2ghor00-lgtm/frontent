"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-[#ffb200] text-black py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section - Logo & Info */}
                    <div>
                        <div className="mb-4">
                            <Image
                                src="/logo.png"
                                alt="Gram2Ghor Logo"
                                width={280}
                                height={280}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-black mb-4">
                            Gram2ghor is an e-commerce platform dedicated to providing safe and reliable food to every home.
                        </p>
                        <div className="space-y-2 text-black mb-6">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-black" />
                                <span>14/D,Kaderabad housing, Mohammadpur,Dhaka</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiPhone className="text-black" />
                                <span>Phone: 01822858380,01822858283</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail className="text-black" />
                                <span>gram2ghor@gmail.com</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/1GcHsDrdfT/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors">
                                <FiFacebook className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/gram2ghor?igsh=cTNsdmJ1dWd1azZu" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors">
                                <FiInstagram className="w-6 h-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/gram-2-ghor-a5a15a402" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors">
                                <FiLinkedin className="w-6 h-6" />
                            </a>
                            <a href="mailto:gram2ghor@gmail.com" className="text-black hover:text-black transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com/@gram2ghor?si=iKdccWgOOUNrarJs" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors">
                                <FiYoutube className="w-6 h-6" />
                            </a>
                            <a href="https://www.tiktok.com/@gram2.ghor?_r=1&_t=ZS-95OXC3fLIaD" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 16.8a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.56a8.29 8.29 0 004.67 1.47V6.69h-4.91z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Middle Section - Customer Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/corporate-deal" className="text-black hover:text-black transition-colors">
                                    Corporate deal
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-black hover:text-black transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-returns" className="text-black hover:text-black transition-colors">
                                    Refund and returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-black hover:text-black transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-black hover:text-black transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section - Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Information</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-black hover:text-black transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-condition" className="text-black hover:text-black transition-colors">
                                    Terms & Condition
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-black hover:text-black transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom - Copyright */}
                <div className="border-t border-black mt-8 pt-8 text-center text-black">
                    <p>&copy; {new Date().getFullYear()} Gram2ghor. All rights reserved.</p>
                    <div className="mt-2 font-bold">
                        <p>Developed by Abdullah AL Fuad</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
