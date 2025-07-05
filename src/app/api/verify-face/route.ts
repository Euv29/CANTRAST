import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const FaceVerificationSchema = z.object({
  faceId: z.string().min(1, 'Face ID é obrigatório'),
  fioToken: z.string().min(1, 'Token FaceIO é obrigatório'),
  livenessScore: z.number().min(0).max(1).optional(),
  confidence: z.number().min(0).max(1).optional()
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
    const validatedData = FaceVerificationSchema.parse(body)

    // Verificar se o usuário existe e tem BI verificado
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { verificacao: true }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!existingUser.biVerified) {
      return NextResponse.json(
        { error: 'É necessário verificar o BI antes da verificação facial' },
        { status: 400 }
      )
    }

    if (existingUser.verificacao?.faceVerified) {
      return NextResponse.json(
        { error: 'Verificação facial já realizada' },
        { status: 400 }
      )
    }

    // Verificar se o Face ID já está sendo usado por outro usuário
    const existingFaceId = await prisma.verificacao.findFirst({
      where: { 
        faceId: validatedData.faceId,
        NOT: { userId: existingUser.id }
      }
    })

    if (existingFaceId) {
      return NextResponse.json(
        { error: 'Esta identidade facial já está registrada por outro usuário' },
        { status: 400 }
      )
    }

    // Atualizar verificação facial
    const updatedVerification = await prisma.verificacao.upsert({
      where: { userId: existingUser.id },
      update: {
        faceVerified: true,
        faceVerifiedAt: new Date(),
        faceId: validatedData.faceId,
        fioToken: validatedData.fioToken,
        faceData: {
          livenessScore: validatedData.livenessScore,
          confidence: validatedData.confidence,
          verifiedAt: new Date().toISOString()
        }
      },
      create: {
        userId: existingUser.id,
        faceVerified: true,
        faceVerifiedAt: new Date(),
        faceId: validatedData.faceId,
        fioToken: validatedData.fioToken,
        faceData: {
          livenessScore: validatedData.livenessScore,
          confidence: validatedData.confidence,
          verifiedAt: new Date().toISOString()
        }
      }
    })

    // Verificar se todas as verificações foram concluídas
    const allVerified = updatedVerification.biVerified && 
                       updatedVerification.faceVerified &&
                       updatedVerification.phoneVerified

    if (allVerified) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { verified: true }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Verificação facial concluída com sucesso',
      data: {
        faceVerified: true,
        allVerified,
        nextStep: updatedVerification.phoneVerified ? 'complete' : 'phone_verification'
      }
    })

  } catch (error) {
    console.error('Erro na verificação facial:', error)

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

    if (!userVerification?.verificacao) {
      return NextResponse.json({
        faceVerified: false,
        status: 'not_started'
      })
    }

    return NextResponse.json({
      faceVerified: userVerification.verificacao.faceVerified,
      status: userVerification.verificacao.faceVerified ? 'verified' : 'pending',
      verifiedAt: userVerification.verificacao.faceVerifiedAt,
      hasFaceId: !!userVerification.verificacao.faceId
    })

  } catch (error) {
    console.error('Erro ao buscar status de verificação facial:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { verificacao: true }
    })

    if (!userRecord?.verificacao) {
      return NextResponse.json(
        { error: 'Nenhuma verificação encontrada' },
        { status: 404 }
      )
    }

    // Remover verificação facial (permitir nova tentativa)
    await prisma.verificacao.update({
      where: { userId: userRecord.id },
      data: {
        faceVerified: false,
        faceVerifiedAt: null,
        faceId: null,
        fioToken: null,
        faceData: null
      }
    })

    await prisma.user.update({
      where: { id: userRecord.id },
      data: { verified: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Verificação facial removida. Você pode tentar novamente.'
    })

  } catch (error) {
    console.error('Erro ao remover verificação facial:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
