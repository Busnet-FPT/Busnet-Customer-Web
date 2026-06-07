import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
    const location = useLocation()
    const [lang, setLang] = useState('VI')
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const navLinks = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Tìm chuyến', path: '/trips' },
        { name: 'Vé của tôi', path: '/booking' },
        { name: 'Tài khoản', path: '/profile' }
    ]

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-100 shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
                {/* Brand Logo & Name */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/logo.jpg"
                        alt="BusNet Logo"
                        className="h-9 w-9 object-cover rounded-xl shadow-md border border-slate-100 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-primary uppercase group-hover:text-primary transition-colors duration-300">
                        Bus<span className="text-primary">Net</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide font-primary">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative py-1 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Section: Language Dropdown & Auth CTA */}
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 text-xs font-bold text-slate-700 font-primary active:scale-[0.97] cursor-pointer"
                        >
                            <span className="flex items-center gap-1.5">
                                {lang === 'VI' ? (
                                    <>
                                        <span className="text-sm leading-none">🇻🇳</span>
                                        <span>Tiếng Việt</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm leading-none">🇬🇧</span>
                                        <span>English</span>
                                    </>
                                )}
                            </span>
                            <svg
                                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''
                                    }`}
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
                    <span className="h-5 w-[1px] bg-slate-200 hidden sm:inline-block"></span>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="rounded-xl bg-primary hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-bold tracking-wide font-primary uppercase transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
