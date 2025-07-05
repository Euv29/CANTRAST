import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { extractBIData } from '@/lib/vision'

const BiVerificationSchema = z.object({
  image: z.string().min(1, 'Imagem é obrigatória'),
  imageType: z.enum(['image/jpeg', 'image/jpg', 'image/png'], {
    errorMap: () => ({ message: 'Formato de imagem inválido. Use JPG ou PNG.' })
  })
})

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = BiVerificationSchema.parse(body)

    // Verificar se o usuário já tem verificação pendente ou aprovada
    const existingVerification = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { biVerified: true, verificacao: true }
    })

    if (existingVerification?.biVerified) {
      return NextResponse.json(
        { error: 'BI já verificado para este usuário' },
        { status: 400 }
      )
    }

    // Processar imagem com Google Vision API
    const extractedData = await extractBIData(validatedData.image)

    if (!extractedData.biNumber) {
      return NextResponse.json(
        { error: 'Não foi possível extrair o número do BI. Verifique se a imagem está clara e legível.' },
        { status: 400 }
      )
    }

    // Verificar se o número do BI já existe
    const existingBI = await prisma.user.findFirst({
      where: { 
        biNumber: extractedData.biNumber,
        NOT: { clerkId: user.id }
      }
    })

    if (existingBI) {
      return NextResponse.json(
        { error: 'Este número de BI já está registrado por outro usuário' },
        { status: 400 }
      )
    }

    // Atualizar usuário no banco de dados
    const updatedUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        biNumber: extractedData.biNumber,
        biVerified: true,
        verificacao: {
          upsert: {
            create: {
              biVerified: true,
              biVerifiedAt: new Date(),
              extractedData: extractedData
            },
            update: {
              biVerified: true,
              biVerifiedAt: new Date(),
              extractedData: extractedData
            }
          }
        }
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || user.firstName || '',
        avatar: user.imageUrl,
        biNumber: extractedData.biNumber,
        biVerified: true,
        verificacao: {
          create: {
            biVerified: true,
            biVerifiedAt: new Date(),
            extractedData: extractedData
          }
        }
      },
      include: {
        verificacao: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'BI verificado com sucesso',
      data: {
        biNumber: extractedData.biNumber,
        extractedInfo: extractedData,
        nextStep: 'face_verification'
      }
    })

  } catch (error) {
    console.error('Erro na verificação do BI:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const userVerification = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        verificacao: true
      }
    })

    if (!userVerification) {
      return NextResponse.json({
        biVerified: false,
        biNumber: null,
        status: 'not_started'
      })
    }

    return NextResponse.json({
      biVerified: userVerification.biVerified,
      biNumber: userVerification.biNumber,
      status: userVerification.biVerified ? 'verified' : 'pending',
      verifiedAt: userVerification.verificacao?.biVerifiedAt
    })

  } catch (error) {
    console.error('Erro ao buscar status de verificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}