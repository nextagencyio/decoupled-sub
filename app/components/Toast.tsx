'use client'

import { useEffect, useState } from 'react'
import { X, Info } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, isVisible, onClose, duration = 4000 }: ToastProps) {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)
      const timer = setTimeout(() => {
        setIsShowing(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isShowing) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 shadow-xl">
        <Info className="h-5 w-5 text-primary-400 flex-shrink-0" />
        <p className="text-gray-200 text-sm">{message}</p>
        <button
          onClick={() => {
            setIsShowing(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-white transition-colors ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
