// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ToastProvider } from '@/components/context/ToastContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
