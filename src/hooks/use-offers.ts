import { useState, useEffect, useCallback } from 'react'
import { CreateOfferInput } from '@/lib/validations'

export interface Offer {
  id: string
  type: 'SELL' | 'BUY'
  fromCurrency: string
  toCurrency: string
  amount: number
  rate: number
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  description?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    imageUrl?: string
    reputation: number
    totalRatings: number
  }
  _count: {
    proposals: number
  }
}

export interface OffersFilter {
  type?: 'SELL' | 'BUY'
  currency?: string
  minAmount?: number
  maxAmount?: number
  minRate?: number
  maxRate?: number
  minReputation?: number
}

export function useOffers(initialFilter?: OffersFilter) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<OffersFilter>(initialFilter || {})

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/offers?${params}`)
      if (!response.ok) {
        throw new Error('Falha ao carregar ofertas')
      }

      const data = await response.json()
      setOffers(data.offers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const createOffer = async (offerData: CreateOfferInput): Promise<Offer> => {
    const response = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Falha ao criar oferta')
    }

    const data = await response.json()
    setOffers(prev => [data.offer, ...prev])
    return data.offer
  }

  const updateOffer = async (offerId: string, updates: Partial<CreateOfferInput>): Promise<Offer> => {
    const response = await fetch(`/api/offers/${offerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Falha ao atualizar oferta')
    }

    const data = await response.json()
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? data.offer : offer
    ))
    return data.offer
  }

  const deleteOffer = async (offerId: string): Promise<void> => {
    const response = await fetch(`/api/offers/${offerId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Falha ao deletar oferta')
    }

    setOffers(prev => prev.filter(offer => offer.id !== offerId))
  }

  const updateFilter = (newFilter: Partial<OffersFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
  }

  const clearFilter = () => {
    setFilter({})
  }

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    loading,
    error,
    filter,
    createOffer,
    updateOffer,
    deleteOffer,
    updateFilter,
    clearFilter,
    refetch: fetchOffers
  }
}
