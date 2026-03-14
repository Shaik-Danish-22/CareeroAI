'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedDarkMode || (localStorage.getItem('darkMode') === null && prefersDark)
    
    setIsDarkMode(shouldBeDark)
    applyDarkMode(shouldBeDark)
  }, [])

  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    applyDarkMode(newDarkMode)
  }

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    router.push('/')
  }

  // Hide navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  if (!mounted) {
    return null
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-purple-100/40 dark:border-purple-900/40 shadow-sm transition-colors duration-300">
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
                className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition duration-300 font-medium"
              >
                Features
              </a>
            )}
          </div>

          {/* Dark Mode Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-300"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition duration-300 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition duration-300 font-medium"
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
            className="md:hidden p-2 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-purple-100/40 dark:border-purple-900/40">
            {!isLoggedIn && (
              <a
                href="#features"
                className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Features
              </a>
            )}
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                toggleDarkMode()
              }}
              className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition font-medium flex items-center gap-2"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-5 h-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  Dark Mode
                </>
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
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
