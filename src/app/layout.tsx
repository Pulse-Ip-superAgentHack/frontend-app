import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/DashboardNavbar'
import localFont from 'next/font/local'
import StyleFixer from '@/components/StyleFixer'
import { Toaster } from "@/components/ui/sonner"

// Load your local font files
const newsreader = localFont({
  src: '../../public/Newsreader_9pt-Medium.ttf',
  variable: '--font-newsreader',
  display: 'swap',
})

const newsreaderLight = localFont({
  src: '../../public/Newsreader_14pt-Light.ttf',
  variable: '--font-newsreader-light',
  display: 'swap',
})

const inter = localFont({
  src: [
    {
      path: '../../public/Inter-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fitbit Data Viewer',
  description: 'View and analyze your Fitbit data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${newsreaderLight.variable} ${inter.variable}`}>
      <body className="font-newsreader" style={{"--number-font": "var(--font-inter)"}}>
        <Navbar />
        <StyleFixer />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
