import type { Metadata } from 'next'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Insider | Premium Content Platform',
  description: 'Subscribe for exclusive access to premium articles, insights, and analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
