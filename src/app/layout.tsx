import './globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'
import {AccountProvider} from "@/context/AccountContext";

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: {
    default: 'Answer Quickly',
    template: '%s | Answer Quickly'
  },
  description: 'Open source dynamic website without database, built with Next.js and GitHub API',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
     <AccountProvider>
        <Layout>{children}</Layout>
     </AccountProvider>
      </body>
    </html>
  )
}
