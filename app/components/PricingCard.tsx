'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  ctaText?: string
  onSubscribe?: () => void
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  ctaText = 'Subscribe',
  onSubscribe,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!onSubscribe) return
    setIsLoading(true)
    try {
      await onSubscribe()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`relative rounded-2xl p-8 ${
        highlighted
          ? 'bg-gradient-to-br from-primary-900/50 to-primary-800/30 border-2 border-primary-500 shadow-xl shadow-primary-500/20'
          : 'bg-gray-800/50 border border-gray-700'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400">/{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
              highlighted ? 'text-primary-400' : 'text-gray-400'
            }`} />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={isLoading || !onSubscribe}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          highlighted
            ? 'bg-primary-600 hover:bg-primary-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          ctaText
        )}
      </button>
    </div>
  )
}
