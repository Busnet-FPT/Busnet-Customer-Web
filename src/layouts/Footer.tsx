import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800 font-primary">
            <div className="mx-auto max-w-6xl px-4 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Column 1: Brand & Logo */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/logo.jpg"
                                alt="BusNet Logo"
                                className="h-10 w-10 object-cover rounded-xl border border-slate-700 shadow-md"
                            />
                            <span className="brand-logo text-white">
                                Bus<span className="text-primary">Net</span>
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            Vietnam's leading technology-driven coach ticket booking platform. Connecting quickly, traveling safely and reliably on every journey.
                        </p>
                    </div>

                    {/* Column 2: About BusNet */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            About BusNet
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors">About Company</Link>
                            </li>
                            <li>
                                <Link to="/news" className="hover:text-primary transition-colors">News & Events</Link>
                            </li>
                            <li>
                                <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Policy & Support */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Policy & Support
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>
                                <Link to="/rules" className="hover:text-primary transition-colors">Operating Rules</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-primary transition-colors">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Contact Info
                        </h4>
                        <div className="space-y-2 text-xs text-slate-400">
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Hotline: <strong className="text-white hover:text-primary transition-colors">1900 6868</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email: support@busnet.vn
                            </p>
                            <p className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>600 Nguyen Van Cu Extended, An Binh, Can Tho</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom copyright & socials */}
                <div className="mt-12 pt-6 border-t border-slate-800 flex justify-center text-xs text-slate-500">
                    <p>© 2026 BusNet. All rights reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
