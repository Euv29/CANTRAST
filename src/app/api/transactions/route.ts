import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const UpdateTransactionSchema = z.object({
  id: z.string().uuid('ID da transação inválido'),
  status: z.enum(['AGUARDANDO_PAGAMENTO', 'PAGAMENTO_ENVIADO', 'PAGAMENTO_CONFIRMADO', 'CONCLUIDA', 'CANCELADA'], {
    errorMap: () => ({ message: 'Status inválido' })
  }),
  comprovante: z.string().url('URL do comprovante inválida').optional(),
  observacoes: z.string().max(500, 'Observações não podem exceder 500 caracteres').optional()
})

const AddMessageSchema = z.object({
  transacaoId: z.string().uuid('ID da transação inválido'),
  mensagem: z.string().min(1, 'Mensagem é obrigatória').max(1000, 'Mensagem não pode exceder 1000 caracteres'),
  anexo: z.string().url('URL do anexo inválida').optional()
})

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
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'comprador' | 'vendedor'
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Construir filtros
    const where: any = {
      OR: [
        { compradorId: userRecord.id },
        { vendedorId: userRecord.id }
      ]
    }

    if (status && ['AGUARDANDO_PAGAMENTO', 'PAGAMENTO_ENVIADO', 'PAGAMENTO_CONFIRMADO', 'CONCLUIDA', 'CANCELADA'].includes(status)) {
      where.status = status
    }

    if (role === 'comprador') {
      where.OR = [{ compradorId: userRecord.id }]
    } else if (role === 'vendedor') {
      where.OR = [{ vendedorId: userRecord.id }]
    }

    // Buscar transações
    const [transacoes, total] = await Promise.all([
      prisma.transacao.findMany({
        where,
        include: {
          comprador: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              verified: true
            }
          },
          vendedor: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              verified: true
            }
          },
          proposta: {
            include: {
              oferta: {
                select: {
                  id: true,
                  tipo: true,
                  localizacao: true
                }
              }
            }
          },
          mensagens: {
            take: 3, // Últimas 3 mensagens
            orderBy: { createdAt: 'desc' },
            include: {
              usuario: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              mensagens: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transacao.count({ where })
    ])

    return NextResponse.json({
      data: transacoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateTransactionSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a transação existe e o usuário é participante
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: validatedData.id,
        OR: [
          { compradorId: userRecord.id },
          { vendedorId: userRecord.id }
        ]
      },
      include: {
        comprador: true,
        vendedor: true
      }
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada ou você não tem permissão para modificá-la' },
        { status: 404 }
      )
    }

    // Validar transições de status
    const statusTransitions: { [key: string]: string[] } = {
      'AGUARDANDO_PAGAMENTO': ['PAGAMENTO_ENVIADO', 'CANCELADA'],
      'PAGAMENTO_ENVIADO': ['PAGAMENTO_CONFIRMADO', 'CANCELADA'],
      'PAGAMENTO_CONFIRMADO': ['CONCLUIDA'],
      'CONCLUIDA': [], // Status final
      'CANCELADA': [] // Status final
    }

    if (!statusTransitions[transacao.status]?.includes(validatedData.status)) {
      return NextResponse.json(
        { 
          error: `Transição de status inválida de ${transacao.status} para ${validatedData.status}`,
          statusPermitidos: statusTransitions[transacao.status] || []
        },
        { status: 400 }
      )
    }

    // Verificar permissões baseadas no role
    const isComprador = transacao.compradorId === userRecord.id
    const isVendedor = transacao.vendedorId === userRecord.id

    // Regras de negócio para mudanças de status
    if (validatedData.status === 'PAGAMENTO_ENVIADO' && !isComprador) {
      return NextResponse.json(
        { error: 'Apenas o comprador pode marcar o pagamento como enviado' },
        { status: 403 }
      )
    }

    if (validatedData.status === 'PAGAMENTO_CONFIRMADO' && !isVendedor) {
      return NextResponse.json(
        { error: 'Apenas o vendedor pode confirmar o recebimento do pagamento' },
        { status: 403 }
      )
    }

    if (validatedData.status === 'CONCLUIDA' && !isVendedor) {
      return NextResponse.json(
        { error: 'Apenas o vendedor pode marcar a transação como concluída' },
        { status: 403 }
      )
    }

    // Atualizar transação
    const transacaoAtualizada = await prisma.transacao.update({
      where: { id: validatedData.id },
      data: {
        status: validatedData.status,
        comprovante: validatedData.comprovante,
        observacoes: validatedData.observacoes,
        ...(validatedData.status === 'CONCLUIDA' && { concluidaEm: new Date() })
      },
      include: {
        comprador: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputacao: true,
            verified: true
          }
        },
        vendedor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputacao: true,
            verified: true
          }
        },
        proposta: {
          include: {
            oferta: {
              select: {
                id: true,
                tipo: true,
                localizacao: true
              }
            }
          }
        }
      }
    })

    // Adicionar mensagem automática sobre mudança de status
    await prisma.mensagem.create({
      data: {
        transacaoId: validatedData.id,
        usuarioId: userRecord.id,
        mensagem: `Status da transação alterado para: ${validatedData.status}`,
        tipo: 'SISTEMA'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Transação atualizada com sucesso',
      data: transacaoAtualizada
    })

  } catch (error) {
    console.error('Erro ao atualizar transação:', error)

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
    const validatedData = AddMessageSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a transação existe e o usuário é participante
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
        { error: 'Transação não encontrada ou você não tem permissão para enviar mensagens' },
        { status: 404 }
      )
    }

    // Criar mensagem
    const novaMensagem = await prisma.mensagem.create({
      data: {
        transacaoId: validatedData.transacaoId,
        usuarioId: userRecord.id,
        mensagem: validatedData.mensagem,
        anexo: validatedData.anexo,
        tipo: 'USUARIO'
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
      message: 'Mensagem enviada com sucesso',
      data: novaMensagem
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)

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
