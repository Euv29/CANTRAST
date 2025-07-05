import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateReviewSchema = z.object({
  transacaoId: z.string().uuid('ID da transação inválido'),
  usuarioAvaliadoId: z.string().uuid('ID do usuário avaliado inválido'),
  rating: z.number().int().min(1, 'Rating mínimo é 1').max(5, 'Rating máximo é 5'),
  comentario: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(500, 'Comentário não pode exceder 500 caracteres')
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
    const validatedData = CreateReviewSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a transação existe e está concluída
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: validatedData.transacaoId,
        status: 'CONCLUIDA',
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
        { error: 'Transação não encontrada ou não está concluída' },
        { status: 404 }
      )
    }

    // Verificar se o usuário está tentando avaliar a pessoa correta
    const usuarioParaAvaliar = transacao.compradorId === userRecord.id 
      ? transacao.vendedor 
      : transacao.comprador

    if (usuarioParaAvaliar.id !== validatedData.usuarioAvaliadoId) {
      return NextResponse.json(
        { error: 'Você só pode avaliar a outra parte da transação' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma avaliação
    const avaliacaoExistente = await prisma.avaliacao.findFirst({
      where: {
        transacaoId: validatedData.transacaoId,
        avaliadorId: userRecord.id
      }
    })

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou esta transação' },
        { status: 400 }
      )
    }

    // Usar transação para criar avaliação e atualizar reputação
    const result = await prisma.$transaction(async (tx) => {
      // Criar avaliação
      const novaAvaliacao = await tx.avaliacao.create({
        data: {
          transacaoId: validatedData.transacaoId,
          avaliadorId: userRecord.id,
          avaliadoId: validatedData.usuarioAvaliadoId,
          rating: validatedData.rating,
          comentario: validatedData.comentario
        },
        include: {
          avaliador: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          avaliado: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          transacao: {
            select: {
              id: true,
              valor: true,
              moedaOrigem: true,
              moedaDestino: true
            }
          }
        }
      })

      // Recalcular reputação do usuário avaliado
      const avaliacoes = await tx.avaliacao.findMany({
        where: { avaliadoId: validatedData.usuarioAvaliadoId },
        select: { rating: true }
      })

      const totalAvaliacoes = avaliacoes.length
      const somaRatings = avaliacoes.reduce((sum, av) => sum + av.rating, 0)
      const novaReputacao = totalAvaliacoes > 0 ? somaRatings / totalAvaliacoes : 0

      // Atualizar reputação do usuário
      await tx.user.update({
        where: { id: validatedData.usuarioAvaliadoId },
        data: { 
          reputacao: Number(novaReputacao.toFixed(2)),
          totalAvaliacoes: totalAvaliacoes
        }
      })

      return novaAvaliacao
    })

    return NextResponse.json({
      success: true,
      message: 'Avaliação criada com sucesso',
      data: result
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar avaliação:', error)

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
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const transacaoId = searchParams.get('transacaoId')
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    // Construir filtros
    const where: {
      avaliadoId?: string
      transacaoId?: string
      avaliadorId?: string
    } = {}

    if (usuarioId) {
      where.avaliadoId = usuarioId
    }

    if (transacaoId) {
      where.transacaoId = transacaoId
    }

    // Buscar avaliações
    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where,
        include: {
          avaliador: {
            select: {
              id: true,
              name: true,
              avatar: true,
              verified: true
            }
          },
          avaliado: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              totalAvaliacoes: true
            }
          },
          transacao: {
            select: {
              id: true,
              valor: true,
              moedaOrigem: true,
              moedaDestino: true,
              concluidaEm: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.avaliacao.count({ where })
    ])

    // Calcular estatísticas se for para um usuário específico
    let estatisticas = null
    if (usuarioId) {
      const stats = await prisma.avaliacao.groupBy({
        by: ['rating'],
        where: { avaliadoId: usuarioId },
        _count: { rating: true }
      })

      const totalAvaliacoes = stats.reduce((sum, stat) => sum + stat._count.rating, 0)
      const somaRatings = stats.reduce((sum, stat) => sum + (stat.rating * stat._count.rating), 0)
      const mediaRating = totalAvaliacoes > 0 ? somaRatings / totalAvaliacoes : 0

      estatisticas = {
        totalAvaliacoes,
        mediaRating: Number(mediaRating.toFixed(2)),
        distribuicao: {
          5: stats.find(s => s.rating === 5)?._count.rating || 0,
          4: stats.find(s => s.rating === 4)?._count.rating || 0,
          3: stats.find(s => s.rating === 3)?._count.rating || 0,
          2: stats.find(s => s.rating === 2)?._count.rating || 0,
          1: stats.find(s => s.rating === 1)?._count.rating || 0,
        }
      }
    }

    return NextResponse.json({
      data: avaliacoes,
      estatisticas,
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
    console.error('Erro ao buscar avaliações:', error)
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

    const { searchParams } = new URL(request.url)
    const avaliacaoId = searchParams.get('id')

    if (!avaliacaoId) {
      return NextResponse.json(
        { error: 'ID da avaliação é obrigatório' },
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

    // Verificar se a avaliação existe e pertence ao usuário
    const avaliacao = await prisma.avaliacao.findFirst({
      where: {
        id: avaliacaoId,
        avaliadorId: userRecord.id
      }
    })

    if (!avaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada ou você não tem permissão para removê-la' },
        { status: 404 }
      )
    }

    // Verificar se a avaliação foi criada há menos de 24 horas
    const umDiaAtras = new Date(Date.now() - 24 * 60 * 60 * 1000)
    if (avaliacao.createdAt < umDiaAtras) {
      return NextResponse.json(
        { error: 'Avaliações só podem ser removidas dentro de 24 horas após criação' },
        { status: 400 }
      )
    }

    // Usar transação para remover avaliação e recalcular reputação
    await prisma.$transaction(async (tx) => {
      // Remover avaliação
      await tx.avaliacao.delete({
        where: { id: avaliacaoId }
      })

      // Recalcular reputação do usuário avaliado
      const avaliacoes = await tx.avaliacao.findMany({
        where: { avaliadoId: avaliacao.avaliadoId },
        select: { rating: true }
      })

      const totalAvaliacoes = avaliacoes.length
      const somaRatings = avaliacoes.reduce((sum, av) => sum + av.rating, 0)
      const novaReputacao = totalAvaliacoes > 0 ? somaRatings / totalAvaliacoes : 0

      // Atualizar reputação do usuário
      await tx.user.update({
        where: { id: avaliacao.avaliadoId },
        data: { 
          reputacao: Number(novaReputacao.toFixed(2)),
          totalAvaliacoes: totalAvaliacoes
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Avaliação removida com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
