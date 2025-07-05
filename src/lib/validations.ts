import { z } from 'zod'

// Validação de número de telefone angolano
export const phoneSchema = z
  .string()
  .regex(/^\+244\d{9}$/, 'Número deve estar no formato +244XXXXXXXXX')

// Validação de BI angolano
export const biSchema = z
  .string()
  .regex(/^\d{9}[A-Z]{2}\d{3}$/, 'Formato de BI inválido (9 dígitos + 2 letras + 3 dígitos)')

// Validação de email
export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(1, 'Email é obrigatório')

// Schema para criação de oferta
export const createOfferSchema = z.object({
  type: z.enum(['SELL', 'BUY'], {
    required_error: 'Tipo de oferta é obrigatório'
  }),
  fromCurrency: z
    .string()
    .min(3, 'Moeda de origem deve ter 3 caracteres')
    .max(3, 'Moeda de origem deve ter 3 caracteres'),
  toCurrency: z
    .string()
    .min(2, 'Moeda de destino é obrigatória')
    .max(3, 'Moeda de destino deve ter no máximo 3 caracteres'),
  amount: z
    .number()
    .positive('Quantidade deve ser positiva')
    .min(1, 'Quantidade mínima é 1'),
  rate: z
    .number()
    .positive('Taxa deve ser positiva')
    .min(0.01, 'Taxa mínima é 0.01'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  expiresAt: z
    .date()
    .min(new Date(), 'Data de expiração deve ser futura')
    .optional()
})

// Schema para proposta
export const createProposalSchema = z.object({
  offerId: z.string().cuid('ID da oferta inválido'),
  message: z
    .string()
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
    .optional(),
  proposedRate: z
    .number()
    .positive('Taxa proposta deve ser positiva')
    .optional()
})

// Schema para avaliação
export const createReviewSchema = z.object({
  transactionId: z.string().cuid('ID da transação inválido'),
  toUserId: z.string().cuid('ID do usuário avaliado inválido'),
  rating: z
    .number()
    .int('Avaliação deve ser um número inteiro')
    .min(1, 'Avaliação mínima é 1')
    .max(5, 'Avaliação máxima é 5'),
  comment: z
    .string()
    .max(500, 'Comentário deve ter no máximo 500 caracteres')
    .optional()
})

// Schema para verificação de BI
export const verifyBISchema = z.object({
  biNumber: biSchema,
  biImageUrl: z.string().url('URL da imagem do BI inválida')
})

// Schema para verificação facial
export const verifyFaceSchema = z.object({
  faceId: z.string().min(1, 'Face ID é obrigatório')
})

// Schema para upload de comprovante
export const uploadProofSchema = z.object({
  transactionId: z.string().cuid('ID da transação inválido'),
  proofImageUrl: z.string().url('URL da imagem do comprovante inválida')
})

// Tipos TypeScript derivados dos schemas
export type CreateOfferInput = z.infer<typeof createOfferSchema>
export type CreateProposalInput = z.infer<typeof createProposalSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type VerifyBIInput = z.infer<typeof verifyBISchema>
export type VerifyFaceInput = z.infer<typeof verifyFaceSchema>
export type UploadProofInput = z.infer<typeof uploadProofSchema>
