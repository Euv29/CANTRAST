import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateMessageSchema = z.object({
  transacaoId: z.string().uuid('ID da transação inválido'),
  mensagem: z.string().min(1, 'Mensagem é obrigatória').max(1000, 'Mensagem muito longa'),
  anexo: z.string().url('URL do anexo inválida').optional(),
  tipo: z.enum(['USUARIO', 'SISTEMA']).default('USUARIO')
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
    const validatedData = CreateMessageSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem acesso à transação
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: validatedData.transacaoId,
        OR: [
          { compradorId: userRecord.id },
          { vendedorId: userRecord.id }
        ]
      }
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    // Criar mensagem
    const mensagem = await prisma.mensagem.create({
      data: {
        transacaoId: validatedData.transacaoId,
        usuarioId: userRecord.id,
        mensagem: validatedData.mensagem,
        anexo: validatedData.anexo,
        tipo: validatedData.tipo
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: mensagem
    })

  } catch (error) {
    console.error('Erro ao criar mensagem:', error)

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

    const { searchParams } = new URL(request.url)
    const transacaoId = searchParams.get('transacaoId')

    if (!transacaoId) {
      return NextResponse.json(
        { error: 'ID da transação é obrigatório' },
        { status: 400 }
      )
    }

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem acesso à transação
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: transacaoId,
        OR: [
          { compradorId: userRecord.id },
          { vendedorId: userRecord.id }
        ]
      }
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    // Buscar mensagens da transação
    const mensagens = await prisma.mensagem.findMany({
      where: {
        transacaoId: transacaoId
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      data: mensagens
    })

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
