import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export interface UserData {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  phone?: string
  biNumber?: string
  faceId?: string
  isVerified: boolean
  reputation: number
  totalRatings: number
}

export function useAuth() {
  const { user, isLoaded: userLoaded } = useUser()
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (!authLoaded || !userLoaded) return
      
      if (!isSignedIn || !user) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        // Buscar dados do usuário no banco
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUserData(data.user)
        } else {
          // Se usuário não existe no banco, criar entrada
          const createResponse = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl
            })
          })
          
          if (createResponse.ok) {
            const newData = await createResponse.json()
            setUserData(newData.user)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isSignedIn, user, authLoaded, userLoaded])

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...newData } : null)
  }

  return {
    user,
    userData,
    isSignedIn,
    isLoaded: authLoaded && userLoaded,
    loading,
    updateUserData
  }
}
