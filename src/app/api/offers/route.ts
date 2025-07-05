import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateOfferSchema = z.object({
  tipo: z.enum(['COMPRA', 'VENDA'], {
    errorMap: () => ({ message: 'Tipo deve ser COMPRA ou VENDA' })
  }),
  moedaOrigem: z.string().min(3).max(3, 'Moeda de origem deve ter 3 caracteres'),
  moedaDestino: z.string().min(3).max(3, 'Moeda de destino deve ter 3 caracteres'),
  valorMinimo: z.number().positive('Valor mínimo deve ser positivo'),
  valorMaximo: z.number().positive('Valor máximo deve ser positivo'),
  taxa: z.number().positive('Taxa deve ser positiva'),
  metodoPagamento: z.array(z.string()).min(1, 'Selecione pelo menos um método de pagamento'),
  localizacao: z.string().optional(),
  observacoes: z.string().max(500, 'Observações não podem exceder 500 caracteres').optional()
}).refine(data => data.valorMaximo >= data.valorMinimo, {
  message: 'Valor máximo deve ser maior ou igual ao valor mínimo',
  path: ['valorMaximo']
}).refine(data => data.moedaOrigem !== data.moedaDestino, {
  message: 'Moeda de origem deve ser diferente da moeda de destino',
  path: ['moedaDestino']
})

const UpdateOfferSchema = z.object({
  id: z.string().uuid('ID da oferta inválido'),
  tipo: z.enum(['COMPRA', 'VENDA']).optional(),
  moedaOrigem: z.string().min(3).max(3).optional(),
  moedaDestino: z.string().min(3).max(3).optional(),
  valorMinimo: z.number().positive().optional(),
  valorMaximo: z.number().positive().optional(),
  taxa: z.number().positive().optional(),
  metodoPagamento: z.array(z.string()).optional(),
  localizacao: z.string().optional(),
  observacoes: z.string().max(500).optional(),
  ativo: z.boolean().optional()
})

const MOEDAS_PERMITIDAS = ['AOA', 'USD', 'EUR', 'BRL', 'ZAR']
const METODOS_PAGAMENTO = ['TPA', 'Multicaixa', 'PayPal', 'Wise', 'Banco', 'Dinheiro']

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
    const validatedData = CreateOfferSchema.parse(body)

    // Verificar se as moedas são válidas
    if (!MOEDAS_PERMITIDAS.includes(validatedData.moedaOrigem) || 
        !MOEDAS_PERMITIDAS.includes(validatedData.moedaDestino)) {
      return NextResponse.json(
        { error: `Moedas permitidas: ${MOEDAS_PERMITIDAS.join(', ')}` },
        { status: 400 }
      )
    }

    // Verificar se os métodos de pagamento são válidos
    const metodosInvalidos = validatedData.metodoPagamento.filter(
      metodo => !METODOS_PAGAMENTO.includes(metodo)
    )

    if (metodosInvalidos.length > 0) {
      return NextResponse.json(
        { 
          error: `Métodos de pagamento inválidos: ${metodosInvalidos.join(', ')}`,
          metodosPermitidos: METODOS_PAGAMENTO
        },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe e está verificado
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { verificacao: true }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!userRecord.verified) {
      return NextResponse.json(
        { error: 'É necessário completar a verificação de identidade para criar ofertas' },
        { status: 400 }
      )
    }

    // Verificar limite de ofertas ativas (máximo 5 por usuário)
    const ofertasAtivas = await prisma.oferta.count({
      where: {
        userId: userRecord.id,
        ativo: true
      }
    })

    if (ofertasAtivas >= 5) {
      return NextResponse.json(
        { error: 'Limite máximo de 5 ofertas ativas atingido' },
        { status: 400 }
      )
    }

    // Criar oferta
    const novaOferta = await prisma.oferta.create({
      data: {
        userId: userRecord.id,
        tipo: validatedData.tipo,
        moedaOrigem: validatedData.moedaOrigem,
        moedaDestino: validatedData.moedaDestino,
        valorMinimo: validatedData.valorMinimo,
        valorMaximo: validatedData.valorMaximo,
        taxa: validatedData.taxa,
        metodoPagamento: validatedData.metodoPagamento,
        localizacao: validatedData.localizacao,
        observacoes: validatedData.observacoes,
        ativo: true
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Oferta criada com sucesso',
      data: novaOferta
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar oferta:', error)

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
    
    // Parâmetros de filtro
    const tipo = searchParams.get('tipo')
    const moedaOrigem = searchParams.get('moedaOrigem')
    const moedaDestino = searchParams.get('moedaDestino')
    const valorMinimo = searchParams.get('valorMinimo')
    const valorMaximo = searchParams.get('valorMaximo')
    const localizacao = searchParams.get('localizacao')
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      ativo: true
    }

    if (tipo && ['COMPRA', 'VENDA'].includes(tipo)) {
      where.tipo = tipo
    }

    if (moedaOrigem && MOEDAS_PERMITIDAS.includes(moedaOrigem)) {
      where.moedaOrigem = moedaOrigem
    }

    if (moedaDestino && MOEDAS_PERMITIDAS.includes(moedaDestino)) {
      where.moedaDestino = moedaDestino
    }

    if (valorMinimo) {
      where.valorMaximo = { gte: parseFloat(valorMinimo) }
    }

    if (valorMaximo) {
      where.valorMinimo = { lte: parseFloat(valorMaximo) }
    }

    if (localizacao) {
      where.localizacao = {
        contains: localizacao,
        mode: 'insensitive'
      }
    }

    // Buscar ofertas
    const [ofertas, total] = await Promise.all([
      prisma.oferta.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              reputacao: true,
              verified: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              propostas: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' },
          { user: { reputacao: 'desc' } }
        ],
        skip,
        take: limit
      }),
      prisma.oferta.count({ where })
    ])

    return NextResponse.json({
      data: ofertas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        moedasDisponiveis: MOEDAS_PERMITIDAS,
        metodosPagamento: METODOS_PAGAMENTO
      }
    })

  } catch (error) {
    console.error('Erro ao buscar ofertas:', error)
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
    const validatedData = UpdateOfferSchema.parse(body)

    // Verificar se o usuário é dono da oferta
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const oferta = await prisma.oferta.findFirst({
      where: {
        id: validatedData.id,
        userId: userRecord.id
      }
    })

    if (!oferta) {
      return NextResponse.json(
        { error: 'Oferta não encontrada ou você não tem permissão para editá-la' },
        { status: 404 }
      )
    }

    // Atualizar oferta
    const { id, ...updateData } = validatedData
    const ofertaAtualizada = await prisma.oferta.update({
      where: { id: validatedData.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputacao: true,
            verified: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Oferta atualizada com sucesso',
      data: ofertaAtualizada
    })

  } catch (error) {
    console.error('Erro ao atualizar oferta:', error)

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
