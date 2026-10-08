import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Iglesia Victoria en Jesús | Comunidad de Fe',
    template: '%s | Iglesia Victoria en Jesús',
  },
  description: 'Una comunidad de fe centrada en Cristo, comprometida con el Evangelio y el servicio. Únete a nuestros cultos, ministerios y eventos.',
  keywords: ['iglesia', 'cristiana', 'culto', 'ministerios', 'estudio bíblico', 'fe', 'Jesús'],
  authors: [{ name: 'Iglesia Victoria en Jesús' }],
  creator: 'Iglesia Victoria en Jesús',
  publisher: 'Iglesia Victoria en Jesús',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://victoriaenjesus.org',
    siteName: 'Iglesia Victoria en Jesús',
    title: 'Iglesia Victoria en Jesús | Comunidad de Fe',
    description: 'Una comunidad de fe centrada en Cristo, comprometida con el Evangelio y el servicio.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Iglesia Victoria en Jesús',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iglesia Victoria en Jesús',
    description: 'Una comunidad de fe centrada en Cristo, comprometida con el Evangelio y el servicio.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a2230',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased text-primary-900 bg-white min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}