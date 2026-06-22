import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { UserProfile } from '../services/profileService'

function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const [lang, setLang] = useState('EN')
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const langDropdownRef = useRef<HTMLDivElement>(null)
    const userDropdownRef = useRef<HTMLDivElement>(null)

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Trips', path: '/trips' },
        { name: 'Operators', path: '/operators' },
        { name: 'Booking', path: '/booking' },
        { name: 'Subscription', path: '/subscription' },
        { name: 'Blog', path: '/blog' }
    ]

    // Monitor scroll position for transparent header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isTransparent = location.pathname === '/' && !isScrolled
    const effectiveTransparent = isTransparent && !isMobileMenuOpen

    // Load user profile and monitor pathname changes
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error(e)
            }
        } else {
            setUser(null)
        }
    }, [location.pathname])

    // Close mobile menu on pathname change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false)
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setIsUserDropdownOpen(false)
        navigate('/login')
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-primary ${effectiveTransparent
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'backdrop-blur-md bg-white/90 border-b border-slate-100 shadow-sm'
            }`}>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
                {/* Brand Logo & Name */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/images/logo.jpg"
                        alt="BusNet Logo"
                        className={`h-9 w-9 object-cover rounded-xl shadow-md border transition-all duration-300 group-hover:scale-105 ${effectiveTransparent ? 'border-white/10' : 'border-slate-100'
                            }`}
                    />
                    <span className={`brand-logo transition-colors duration-300 ${effectiveTransparent ? 'text-white' : 'text-slate-900'
                        }`}>
                        Bus<span className="text-primary">Net</span>
                    </span>
                </Link>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8 nav-link font-medium">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative py-1 transition-colors duration-300 ${isActive
                                    ? (effectiveTransparent ? 'text-white font-bold' : 'text-primary')
                                    : (effectiveTransparent ? 'text-white/75 hover:text-white' : 'text-slate-600 hover:text-primary')
                                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 ${effectiveTransparent ? 'after:bg-white' : 'after:bg-primary'
                                    } after:transition-all after:duration-300 ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Section: Language Dropdown & Auth CTA & Hamburger Menu */}
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="hidden md:block relative" ref={langDropdownRef}>
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 text-xs font-bold font-primary active:scale-[0.97] cursor-pointer ${effectiveTransparent
                                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            <span className="flex items-center gap-1.5">
                                {lang === 'VI' ? (
                                    <>
                                        <span className="text-sm leading-none">🇻🇳</span>
                                        <span>Vietnamese</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm leading-none">🇺🇸</span>
                                        <span>English</span>
                                    </>
                                )}
                            </span>
                            <svg
                                className={`w-3 h-3 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''
                                    } ${effectiveTransparent ? 'text-white/80' : 'text-slate-400'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isLangDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-slate-100 shadow-lg py-1 z-50 animate-fade-in">
                                <button
                                    onClick={() => {
                                        setLang('VI')
                                        setIsLangDropdownOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 cursor-pointer font-primary ${lang === 'VI' ? 'text-primary' : 'text-slate-600'
                                        }`}
                                >
                                    <span className="text-sm leading-none">🇻🇳</span>
                                    <span>Tiếng Việt</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setLang('EN')
                                        setIsLangDropdownOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 cursor-pointer font-primary ${lang === 'EN' ? 'text-primary' : 'text-slate-600'
                                        }`}
                                >
                                    <span className="text-sm leading-none">🇬🇧</span>
                                    <span>English</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <span className={`h-5 w-px hidden md:inline-block transition-colors duration-300 ${effectiveTransparent ? 'bg-white/20' : 'bg-slate-200'
                        }`}></span>

                    {/* Login Button or Avatar Dropdown */}
                    {user ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none cursor-pointer group"
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.fullName}
                                        className={`w-9 h-9 rounded-full object-cover border transition-all duration-300 ${effectiveTransparent ? 'border-white/30 group-hover:border-white' : 'border-slate-200 group-hover:border-primary'
                                            }`}
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border transition-all duration-300 ${effectiveTransparent
                                        ? 'bg-white/10 text-white border-white/20 group-hover:border-white'
                                        : 'bg-primary/10 text-primary border-slate-200 group-hover:border-primary'
                                        }`}>
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.username?.charAt(0)?.toUpperCase() || 'U')}
                                    </div>
                                )}
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-100 shadow-lg py-1 z-50 animate-fade-in font-primary text-xs">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="font-bold text-slate-800 truncate">{user.fullName || user.username}</p>
                                        <p className="text-slate-400 font-secondary mt-0.5 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer font-bold transition-all"
                                    >
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/booking"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer font-bold transition-all"
                                    >
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        My Tickets
                                    </Link>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-slate-50 cursor-pointer font-bold text-left transition-all"
                                    >
                                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to={location.pathname === '/verify-email' ? '#' : '/login'}
                            onClick={(e) => {
                                if (location.pathname === '/verify-email') {
                                    e.preventDefault()
                                } else {
                                    setIsMobileMenuOpen(false)
                                }
                            }}
                            className={`rounded-xl px-5 py-2 text-xs font-bold font-primary transition-all duration-300 active:scale-[0.97] inline-block text-center cursor-pointer ${
                                location.pathname === '/verify-email'
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 pointer-events-none cursor-not-allowed shadow-none'
                                    : effectiveTransparent
                                        ? 'border border-white/30 text-white bg-white/5 hover:bg-white hover:text-slate-900 hover:border-white shadow-none'
                                        : 'bg-primary text-white hover:bg-blue-600 shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25'
                            }`}
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Menu Button (Hamburger) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`block md:hidden p-2 rounded-xl border transition-all duration-200 active:scale-[0.95] cursor-pointer ${
                            effectiveTransparent
                                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-fade-in py-4 px-4 space-y-3 max-h-[70vh] overflow-y-auto">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        isActive
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Language Selector in Mobile Menu */}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-primary">Language</p>
                        <div className="flex gap-2 px-4">
                            <button
                                onClick={() => {
                                    setLang('VI')
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold font-primary transition-all duration-200 cursor-pointer ${
                                    lang === 'VI'
                                        ? 'bg-primary/10 text-primary border-primary shadow-sm shadow-primary/5'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <span className="text-sm leading-none">🇻🇳</span>
                                <span>Tiếng Việt</span>
                            </button>
                            <button
                                onClick={() => {
                                    setLang('EN')
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold font-primary transition-all duration-200 cursor-pointer ${
                                    lang === 'EN'
                                        ? 'bg-primary/10 text-primary border-primary shadow-sm shadow-primary/5'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <span className="text-sm leading-none">🇺🇸</span>
                                <span>English</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
