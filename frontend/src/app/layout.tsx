import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'CareeroAI',
  description: 'AI-powered career guidance and recruitment platform',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
