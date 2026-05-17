"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const socialLinks = [
    {
        href: "https://www.facebook.com/share/1GcHsDrdfT/",
        label: "Facebook",
        Icon: FaFacebookF,
        hoverBg: "hover:bg-[#1877F2]",
    },
    {
        href: "https://www.instagram.com/gram2ghor?igsh=cTNsdmJ1dWd1azZu",
        label: "Instagram",
        Icon: FaInstagram,
        hoverBg: "hover:bg-gradient-to-tr hover:from-[#feda75] hover:via-[#fa7e1e] hover:to-[#d62976]",
    },
    {
        href: "https://www.linkedin.com/in/gram-2-ghor-a5a15a402",
        label: "LinkedIn",
        Icon: FaLinkedinIn,
        hoverBg: "hover:bg-[#0A66C2]",
    },
    {
        href: "mailto:gram2ghor@gmail.com",
        label: "Email",
        Icon: HiOutlineMail,
        hoverBg: "hover:bg-[#EA4335]",
        external: false,
    },
    {
        href: "https://youtube.com/@gram2ghor?si=iKdccWgOOUNrarJs",
        label: "YouTube",
        Icon: FaYoutube,
        hoverBg: "hover:bg-[#FF0000]",
    },
    {
        href: "https://www.tiktok.com/@gram2.ghor?_r=1&_t=ZS-95OXC3fLIaD",
        label: "TikTok",
        Icon: FaTiktok,
        hoverBg: "hover:bg-black",
    },
];

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
                        <div className="flex flex-wrap gap-2.5">
                            {socialLinks.map(({ href, label, Icon, hoverBg, external = true }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    title={label}
                                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-black/10 text-black ${hoverBg} hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </a>
                            ))}
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
