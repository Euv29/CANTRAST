import { ImageAnnotatorClient } from '@google-cloud/vision'

// Configuração do cliente Google Vision
let visionClient: ImageAnnotatorClient | null = null

export function getVisionClient() {
  if (!visionClient) {
    // Para produção, usar service account key file
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      visionClient = new ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      })
    } else if (process.env.GOOGLE_CLOUD_VISION_KEY) {
      // Para desenvolvimento, usar key como string
      try {
        const credentials = JSON.parse(process.env.GOOGLE_CLOUD_VISION_KEY)
        visionClient = new ImageAnnotatorClient({
          credentials,
        })
      } catch (error) {
        console.error('Erro ao fazer parse das credenciais Google Vision:', error)
        throw new Error('Credenciais do Google Vision inválidas')
      }
    } else {
      console.warn('Google Vision não configurado - funcionalidade de OCR desabilitada')
      // Retornar um cliente mock para desenvolvimento/build
      visionClient = null as any
    }
  }
  return visionClient
}

export interface OCRResult {
  extractedText: string
  biNumber?: string
  confidence: number
}

export interface BIExtractionResult {
  biNumber?: string
  extractedText: string
  confidence: number
  name?: string
  birthDate?: string
  issueDate?: string
  expiryDate?: string
  nationality?: string
}

export async function extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
  try {
    const client = getVisionClient()
    
    if (!client) {
      return {
        extractedText: '',
        confidence: 0
      }
    }
    
    const [result] = await client.textDetection({
      image: {
        content: imageBuffer.toString('base64'),
      },
    })

    const detections = result.textAnnotations
    if (!detections || detections.length === 0) {
      return {
        extractedText: '',
        confidence: 0
      }
    }

    const extractedText = detections[0]?.description || ''
    
    // Extrair número do BI (formato angolano)
    const biPattern = /\b\d{9}[A-Z]{2}\d{3}\b/g
    const biMatches = extractedText.match(biPattern)
    const biNumber = biMatches?.[0]

    return {
      extractedText,
      biNumber,
      confidence: detections[0]?.confidence || 0
    }
  } catch (error) {
    console.error('Erro no OCR:', error)
    throw new Error('Falha ao processar imagem do BI')
  }
}

export async function extractBIData(imageBase64: string): Promise<BIExtractionResult> {
  try {
    const client = getVisionClient()
    
    if (!client) {
      return {
        extractedText: '',
        confidence: 0
      }
    }
    
    // Remover prefixo data:image se existir
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
    
    const [result] = await client.textDetection({
      image: {
        content: base64Data,
      },
    })

    const detections = result.textAnnotations
    if (!detections || detections.length === 0) {
      return {
        extractedText: '',
        confidence: 0
      }
    }

    const extractedText = detections[0]?.description || ''
    
    // Extrair número do BI (formato angolano: 9 dígitos + 2 letras + 3 dígitos)
    const biPattern = /\b\d{9}[A-Z]{2}\d{3}\b/g
    const biMatches = extractedText.match(biPattern)
    const biNumber = biMatches?.[0]

    // Extrair nome (geralmente nas primeiras linhas após "Nome" ou "NOME")
    const namePattern = /(?:NOME|Nome|NAME)\s*:?\s*([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i
    const nameMatch = extractedText.match(namePattern)
    const name = nameMatch?.[1]?.trim().substring(0, 100)

    // Extrair data de nascimento (formato DD/MM/YYYY, DD-MM-YYYY, ou DD.MM.YYYY)
    const birthDatePattern = /(?:NASCIMENTO|Nascimento|Data de Nascimento|Born)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
    const birthDateMatch = extractedText.match(birthDatePattern)
    const birthDate = birthDateMatch?.[1]

    // Extrair data de emissão
    const issueDatePattern = /(?:EMISSÃO|Emissão|Emission|Issue)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
    const issueDateMatch = extractedText.match(issueDatePattern)
    const issueDate = issueDateMatch?.[1]

    // Extrair data de validade
    const expiryPattern = /(?:VALIDADE|Validade|Expiry|Valid)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
    const expiryMatch = extractedText.match(expiryPattern)
    const expiryDate = expiryMatch?.[1]

    // Extrair nacionalidade
    const nationalityPattern = /(?:NACIONALIDADE|Nacionalidade|Nationality)\s*:?\s*([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i
    const nationalityMatch = extractedText.match(nationalityPattern)
    const nationality = nationalityMatch?.[1]?.trim().substring(0, 50)

    return {
      biNumber,
      extractedText,
      confidence: detections[0]?.confidence || 0,
      name,
      birthDate,
      issueDate,
      expiryDate,
      nationality
    }
  } catch (error) {
    console.error('Erro ao extrair dados do BI:', error)
    throw new Error('Falha ao processar imagem do BI')
  }
}

export async function validateBIFormat(biNumber: string): Promise<boolean> {
  // Validar formato: 9 dígitos + 2 letras + 3 dígitos
  const biRegex = /^\d{9}[A-Z]{2}\d{3}$/
  return biRegex.test(biNumber)
}
