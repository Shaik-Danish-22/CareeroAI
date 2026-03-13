'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    router.push('/')
  }

  // Hide navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-purple-100/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition duration-300">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isLoggedIn && (
              <a
                href="#features"
                className="text-slate-600 hover:text-purple-600 transition duration-300 font-medium"
              >
                Features
              </a>
            )}
          </div>

          {/* Desktop Auth Buttons or Dashboard Links */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-slate-600 hover:text-purple-600 transition duration-300 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-slate-600 hover:text-purple-600 transition duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-purple-100/40">
            {!isLoggedIn && (
              <a
                href="#features"
                className="block px-4 py-2 text-slate-600 hover:bg-purple-50 rounded-lg transition"
              >
                Features
              </a>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 rounded-lg transition font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-slate-600 hover:bg-purple-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg transition text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
