'use client'
import '@/app/globals.css'
import Layout from '@/components/layout/MainPage'
import { useEffect } from 'react'

export default function RootLayout ({ children }) {
  useEffect(() => {
    console.log('Se ejecuta')
  }, [])
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
