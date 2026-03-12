import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'CareeroAI - AI-Powered Career Platform',
  description: 'AI-powered career guidance and recruitment platform for modern professionals',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-text-primary antialiased overflow-x-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="fixed inset-0 z-0 bg-gradient-mesh">
          {/* Multiple animated radial gradients for mesh effect */}
          <div className="absolute inset-0 opacity-40 animate-mesh-1">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/40 to-transparent rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 opacity-30 animate-mesh-2">
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-primary-600/30 to-transparent rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 opacity-25 animate-mesh-3">
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl" />
          </div>
          {/* Deep base gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950/95" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
