import './globals.css'
import { ReactNode } from 'react'
import type { Viewport } from 'next'
import CommandPalette from '@/components/CommandPalette'
import { ThemeProvider } from '@/context/ThemeProvider'

export const metadata = {
  title: 'CareeroAI - AI-Powered Career Platform',
  description: 'AI-powered career guidance and recruitment platform for modern professionals',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-purple-100 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white antialiased overflow-x-hidden transition-colors duration-300">
        {/* Floating Gradient Blobs Background */}
        <div className="premium-bg fixed inset-0 -z-10" />

        <ThemeProvider>
          {/* Command Palette */}
          <CommandPalette />

          {/* Content */}
          <div className="relative z-0">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
