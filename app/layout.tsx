import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitCast — Authentic African Characters for Film & TV',
  description: 'AI-powered character generation with deep cultural authenticity.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
