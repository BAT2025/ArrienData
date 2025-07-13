'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number // en ms
}

export default function Toast({
  message,
  type = 'success',
  duration = 3000,
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 mr-2" />,
    error: <XCircle className="w-5 h-5 mr-2" />,
    info: <Info className="w-5 h-5 mr-2" />,
    warning: <AlertTriangle className="w-5 h-5 mr-2" />,
  }

  const bgColorMap = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 animate-fade-in ${bgColorMap[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        {iconMap[type]}
        <span>{message}</span>
      </div>
    </div>
  )
}
