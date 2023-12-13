import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { UserProvider } from '@/utils/userContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TimeLogix',
  description: ''
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <Providers>{children}</Providers>I
        </UserProvider>
      </body>
    </html>
  )
}
