import axios from 'axios'

const FASMAPAY_API_URL = process.env.FASMAPAY_API_URL || 'https://pay.fasma.ao/api'
const FASMAPAY_SECRET_KEY = process.env.FASMAPAY_SECRET_KEY

if (!FASMAPAY_SECRET_KEY) {
  console.warn('FASMAPAY_SECRET_KEY não configurada - verificação de comprovantes desabilitada')
}

export interface PaymentProof {
  id: string
  amount: number
  currency: string
  timestamp: string
  sender: string
  receiver: string
  reference: string
}

export interface FasmaPayResponse {
  success: boolean
  valid: boolean
  data?: PaymentProof
  error?: string
}

export async function verifyPaymentProof(
  proofImageUrl: string
): Promise<FasmaPayResponse> {
  try {
    if (!FASMAPAY_SECRET_KEY) {
      // Simulação para desenvolvimento
      console.log('Simulando verificação de comprovante:', proofImageUrl)
      return {
        success: true,
        valid: true,
        data: {
          id: 'MOCK_' + Date.now(),
          amount: 50000,
          currency: 'KZ',
          timestamp: new Date().toISOString(),
          sender: 'João Silva',
          receiver: 'Maria Santos',
          reference: 'TRF' + Date.now()
        }
      }
    }

    const response = await axios.post(
      `${FASMAPAY_API_URL}/verify-payment`,
      {
        proofImageUrl,
        validateAmount: true,
        validateTimestamp: true
      },
      {
        headers: {
          'Authorization': `Bearer ${FASMAPAY_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30s timeout
      }
    )

    return {
      success: true,
      valid: response.data.valid,
      data: response.data.paymentData
    }
  } catch (error: any) {
    console.error('Erro ao verificar comprovante:', error)
    
    if (error.response) {
      return {
        success: false,
        valid: false,
        error: error.response.data?.message || 'Erro na API FasmaPay'
      }
    }
    
    return {
      success: false,
      valid: false,
      error: 'Falha na conexão com FasmaPay'
    }
  }
}

export async function validateProofAmount(
  proofData: PaymentProof,
  expectedAmount: number,
  tolerance: number = 0.01
): Promise<boolean> {
  const difference = Math.abs(proofData.amount - expectedAmount)
  return difference <= tolerance * expectedAmount
}

export async function validateProofTimestamp(
  proofData: PaymentProof,
  maxHoursOld: number = 24
): Promise<boolean> {
  const proofTime = new Date(proofData.timestamp)
  const now = new Date()
  const diffHours = (now.getTime() - proofTime.getTime()) / (1000 * 60 * 60)
  return diffHours <= maxHoursOld
}
