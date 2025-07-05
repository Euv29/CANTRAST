import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateProposalSchema = z.object({
  ofertaId: z.string().uuid('ID da oferta inválido'),
  valor: z.number().positive('Valor deve ser positivo'),
  metodoPagamento: z.string().min(1, 'Método de pagamento é obrigatório'),
  mensagem: z.string().max(500, 'Mensagem não pode exceder 500 caracteres').optional()
})

const UpdateProposalSchema = z.object({
  id: z.string().uuid('ID da proposta inválido'),
  status: z.enum(['ACEITA', 'REJEITADA'], {
    errorMap: () => ({ message: 'Status deve ser ACEITA ou REJEITADA' })
  }),
  mensagem: z.string().max(500, 'Mensagem não pode exceder 500 caracteres').optional()
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
    const validatedData = CreateProposalSchema.parse(body)

    // Verificar se o usuário existe e está verificado
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!userRecord.verified) {
      return NextResponse.json(
        { error: 'É necessário completar a verificação de identidade para fazer propostas' },
        { status: 400 }
      )
    }

    // Verificar se a oferta existe e está ativa
    const oferta = await prisma.oferta.findFirst({
      where: {
        id: validatedData.ofertaId,
        ativo: true
      },
      include: {
        user: true
      }
    })

    if (!oferta) {
      return NextResponse.json(
        { error: 'Oferta não encontrada ou não está mais ativa' },
        { status: 404 }
      )
    }

    // Verificar se o usuário não está fazendo proposta para sua própria oferta
    if (oferta.userId === userRecord.id) {
      return NextResponse.json(
        { error: 'Você não pode fazer uma proposta para sua própria oferta' },
        { status: 400 }
      )
    }

    // Verificar se o valor está dentro do range da oferta
    if (validatedData.valor < oferta.valorMinimo || validatedData.valor > oferta.valorMaximo) {
      return NextResponse.json(
        { 
          error: `Valor deve estar entre ${oferta.valorMinimo} e ${oferta.valorMaximo} ${oferta.moedaOrigem}`,
        },
        { status: 400 }
      )
    }

    // Verificar se o método de pagamento é aceito pela oferta
    if (!oferta.metodoPagamento.includes(validatedData.metodoPagamento)) {
      return NextResponse.json(
        { 
          error: 'Método de pagamento não aceito para esta oferta',
          metodosAceitos: oferta.metodoPagamento
        },
        { status: 400 }
      )
    }

    // Verificar se já existe uma proposta pendente do usuário para esta oferta
    const propostaPendente = await prisma.proposta.findFirst({
      where: {
        ofertaId: validatedData.ofertaId,
        userId: userRecord.id,
        status: 'PENDENTE'
      }
    })

    if (propostaPendente) {
      return NextResponse.json(
        { error: 'Você já tem uma proposta pendente para esta oferta' },
        { status: 400 }
      )
    }

    // Criar proposta
    const novaProposta = await prisma.proposta.create({
      data: {
        userId: userRecord.id,
        ofertaId: validatedData.ofertaId,
        valor: validatedData.valor,
        metodoPagamento: validatedData.metodoPagamento,
        mensagem: validatedData.mensagem,
        status: 'PENDENTE'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputacao: true,
            verified: true
          }
        },
        oferta: {
          select: {
            id: true,
            tipo: true,
            moedaOrigem: true,
            moedaDestino: true,
            taxa: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Proposta enviada com sucesso',
      data: novaProposta
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar proposta:', error)

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
    const type = searchParams.get('type') // 'received' | 'sent'
    const ofertaId = searchParams.get('ofertaId')
    const status = searchParams.get('status')
    
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
    const where: any = {}

    if (type === 'received') {
      // Propostas recebidas (para ofertas do usuário)
      where.oferta = { userId: userRecord.id }
    } else if (type === 'sent') {
      // Propostas enviadas pelo usuário
      where.userId = userRecord.id
    } else {
      // Todas as propostas relacionadas ao usuário
      where.OR = [
        { userId: userRecord.id },
        { oferta: { userId: userRecord.id } }
      ]
    }

    if (ofertaId) {
      where.ofertaId = ofertaId
    }

    if (status && ['PENDENTE', 'ACEITA', 'REJEITADA'].includes(status)) {
      where.status = status
    }

    // Buscar propostas
    const [propostas, total] = await Promise.all([
      prisma.proposta.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              verified: true
            }
          },
          oferta: {
            select: {
              id: true,
              tipo: true,
              moedaOrigem: true,
              moedaDestino: true,
              valorMinimo: true,
              valorMaximo: true,
              taxa: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  reputacao: true
                }
              }
            }
          },
          transacao: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.proposta.count({ where })
    ])

    return NextResponse.json({
      data: propostas,
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
    console.error('Erro ao buscar propostas:', error)
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
    const validatedData = UpdateProposalSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a proposta existe e o usuário é o dono da oferta
    const proposta = await prisma.proposta.findFirst({
      where: {
        id: validatedData.id,
        oferta: { userId: userRecord.id },
        status: 'PENDENTE'
      },
      include: {
        oferta: true,
        user: true
      }
    })

    if (!proposta) {
      return NextResponse.json(
        { error: 'Proposta não encontrada ou você não tem permissão para modificá-la' },
        { status: 404 }
      )
    }

    // Usar transação para atualizar proposta e criar transação se aceita
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar proposta
      const propostaAtualizada = await tx.proposta.update({
        where: { id: validatedData.id },
        data: {
          status: validatedData.status,
          mensagemResposta: validatedData.mensagem,
          respondidaEm: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              verified: true
            }
          },
          oferta: {
            select: {
              id: true,
              tipo: true,
              moedaOrigem: true,
              moedaDestino: true,
              taxa: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        }
      })

      // Se aceita, criar transação
      let transacao = null
      if (validatedData.status === 'ACEITA') {
        transacao = await tx.transacao.create({
          data: {
            propostaId: proposta.id,
            compradorId: proposta.oferta.tipo === 'VENDA' ? proposta.userId : proposta.oferta.userId,
            vendedorId: proposta.oferta.tipo === 'VENDA' ? proposta.oferta.userId : proposta.userId,
            valor: proposta.valor,
            moedaOrigem: proposta.oferta.moedaOrigem,
            moedaDestino: proposta.oferta.moedaDestino,
            taxa: proposta.oferta.taxa,
            metodoPagamento: proposta.metodoPagamento,
            status: 'AGUARDANDO_PAGAMENTO'
          }
        })

        // Desativar a oferta após aceitar uma proposta
        await tx.oferta.update({
          where: { id: proposta.ofertaId },
          data: { ativo: false }
        })
      }

      return { proposta: propostaAtualizada, transacao }
    })

    return NextResponse.json({
      success: true,
      message: `Proposta ${validatedData.status.toLowerCase()} com sucesso`,
      data: result
    })

  } catch (error) {
    console.error('Erro ao atualizar proposta:', error)

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
