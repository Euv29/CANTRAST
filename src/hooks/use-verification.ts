import { useState, useCallback } from 'react'
import { faceIOManager } from '@/lib/faceio'

export interface VerificationStep {
  id: string
  label: string
  completed: boolean
  current: boolean
}

export interface VerificationState {
  biUploaded: boolean
  biVerified: boolean
  faceEnrolled: boolean
  faceVerified: boolean
  phoneVerified: boolean
  emailVerified: boolean
  isComplete: boolean
}

export function useVerification() {
  const [state, setState] = useState<VerificationState>({
    biUploaded: false,
    biVerified: false,
    faceEnrolled: false,
    faceVerified: false,
    phoneVerified: false,
    emailVerified: false,
    isComplete: false
  })
  
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps: VerificationStep[] = [
    {
      id: 'bi',
      label: 'Upload do BI',
      completed: state.biVerified,
      current: currentStep === 0
    },
    {
      id: 'face',
      label: 'Verificação Facial',
      completed: state.faceVerified,
      current: currentStep === 1
    },
    {
      id: 'contact',
      label: 'Contactos',
      completed: state.phoneVerified && state.emailVerified,
      current: currentStep === 2
    }
  ]

  const uploadBI = useCallback(async (file: File): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('bi', file)

      const response = await fetch('/api/verify-bi', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha no upload do BI')
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        biUploaded: true,
        biVerified: data.verified
      }))

      if (data.verified) {
        setCurrentStep(1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload do BI')
    } finally {
      setLoading(false)
    }
  }, [])

  const enrollFace = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const faceId = await faceIOManager.enroll()
      
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceId, action: 'enroll' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha na verificação facial')
      }

      setState(prev => ({
        ...prev,
        faceEnrolled: true,
        faceVerified: true
      }))

      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na verificação facial')
    } finally {
      setLoading(false)
    }
  }, [])

  const authenticateFace = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const faceId = await faceIOManager.authenticate()
      
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceId, action: 'authenticate' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha na autenticação facial')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na autenticação facial')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyPhone = useCallback(async (phone: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha na verificação do telefone')
      }

      setState(prev => ({
        ...prev,
        phoneVerified: true
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na verificação do telefone')
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyEmail = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/verify-email', {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha na verificação do email')
      }

      setState(prev => ({
        ...prev,
        emailVerified: true,
        isComplete: prev.biVerified && prev.faceVerified && prev.phoneVerified
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na verificação do email')
    } finally {
      setLoading(false)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const resetVerification = () => {
    setState({
      biUploaded: false,
      biVerified: false,
      faceEnrolled: false,
      faceVerified: false,
      phoneVerified: false,
      emailVerified: false,
      isComplete: false
    })
    setCurrentStep(0)
    setError(null)
  }

  return {
    state,
    steps,
    currentStep,
    loading,
    error,
    uploadBI,
    enrollFace,
    authenticateFace,
    verifyPhone,
    verifyEmail,
    nextStep,
    prevStep,
    resetVerification,
    setError
  }
}
