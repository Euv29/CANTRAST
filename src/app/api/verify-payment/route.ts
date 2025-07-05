import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPaymentWithFasmaPay } from '@/lib/fasmapay'

const VerifyPaymentSchema = z.object({
  transacaoId: z.string().uuid('ID da transação inválido'),
  comprovanteUrl: z.string().url('URL do comprovante inválida'),
  numeroReferencia: z.string().min(1, 'Número de referência é obrigatório'),
  metodoPagamento: z.string().min(1, 'Método de pagamento é obrigatório'),
  valor: z.number().positive('Valor deve ser positivo'),
  observacoes: z.string().max(500, 'Observações não podem exceder 500 caracteres').optional()
})

const CheckPaymentSchema = z.object({
  numeroReferencia: z.string().min(1, 'Número de referência é obrigatório'),
  metodoPagamento: z.string().min(1, 'Método de pagamento é obrigatório')
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
    const validatedData = VerifyPaymentSchema.parse(body)

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a transação existe e o usuário é o comprador
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: validatedData.transacaoId,
        compradorId: userRecord.id,
        status: {
          in: ['AGUARDANDO_PAGAMENTO', 'PAGAMENTO_ENVIADO']
        }
      },
      include: {
        vendedor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        proposta: {
          include: {
            oferta: true
          }
        }
      }
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada ou você não tem permissão para verificar pagamento' },
        { status: 404 }
      )
    }

    // Verificar se o valor corresponde ao da transação
    if (Math.abs(validatedData.valor - transacao.valor) > 0.01) {
      return NextResponse.json(
        { error: 'Valor do comprovante não corresponde ao valor da transação' },
        { status: 400 }
      )
    }

    try {
      // Verificar pagamento com FasmaPay (se suportado)
      let verificacaoFasmaPay = null
      if (['TPA', 'Multicaixa'].includes(validatedData.metodoPagamento)) {
        verificacaoFasmaPay = await verifyPaymentWithFasmaPay({
          referencia: validatedData.numeroReferencia,
          valor: validatedData.valor,
          metodo: validatedData.metodoPagamento
        })

        if (!verificacaoFasmaPay.success) {
          return NextResponse.json(
            { 
              error: 'Não foi possível verificar o pagamento automaticamente',
              details: verificacaoFasmaPay.error,
              requiresManualVerification: true
            },
            { status: 400 }
          )
        }
      }

      // Usar transação para atualizar status e criar registro de verificação
      const result = await prisma.$transaction(async (tx) => {
        // Criar registro de verificação de pagamento
        const verificacao = await tx.verificacaoPagamento.create({
          data: {
            transacaoId: validatedData.transacaoId,
            comprovanteUrl: validatedData.comprovanteUrl,
            numeroReferencia: validatedData.numeroReferencia,
            metodoPagamento: validatedData.metodoPagamento,
            valor: validatedData.valor,
            observacoes: validatedData.observacoes,
            verificadoAutomaticamente: !!verificacaoFasmaPay,
            dadosVerificacao: verificacaoFasmaPay ? {
              fasmapay: verificacaoFasmaPay,
              verificadoEm: new Date().toISOString()
            } : null,
            status: verificacaoFasmaPay ? 'VERIFICADO' : 'PENDENTE'
          }
        })

        // Atualizar status da transação
        const novoStatus = verificacaoFasmaPay ? 'PAGAMENTO_CONFIRMADO' : 'PAGAMENTO_ENVIADO'
        const transacaoAtualizada = await tx.transacao.update({
          where: { id: validatedData.transacaoId },
          data: {
            status: novoStatus,
            comprovante: validatedData.comprovanteUrl,
            observacoes: validatedData.observacoes
          },
          include: {
            comprador: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verified: true
              }
            },
            vendedor: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verified: true
              }
            },
            proposta: {
              include: {
                oferta: true
              }
            }
          }
        })

        // Adicionar mensagem automática
        await tx.mensagem.create({
          data: {
            transacaoId: validatedData.transacaoId,
            usuarioId: userRecord.id,
            mensagem: verificacaoFasmaPay 
              ? `Pagamento verificado automaticamente - Ref: ${validatedData.numeroReferencia}`
              : `Comprovante de pagamento enviado - Ref: ${validatedData.numeroReferencia}`,
            anexo: validatedData.comprovanteUrl,
            tipo: 'SISTEMA'
          }
        })

        return { transacao: transacaoAtualizada, verificacao }
      })

      return NextResponse.json({
        success: true,
        message: verificacaoFasmaPay 
          ? 'Pagamento verificado automaticamente com sucesso'
          : 'Comprovante enviado. Aguardando verificação manual do vendedor',
        data: result,
        automaticVerification: !!verificacaoFasmaPay
      })

    } catch (verificationError) {
      console.error('Erro na verificação automática:', verificationError)
      
      // Se a verificação automática falhar, ainda permitir o envio manual
      const result = await prisma.$transaction(async (tx) => {
        const verificacao = await tx.verificacaoPagamento.create({
          data: {
            transacaoId: validatedData.transacaoId,
            comprovanteUrl: validatedData.comprovanteUrl,
            numeroReferencia: validatedData.numeroReferencia,
            metodoPagamento: validatedData.metodoPagamento,
            valor: validatedData.valor,
            observacoes: validatedData.observacoes,
            verificadoAutomaticamente: false,
            status: 'PENDENTE',
            erroVerificacao: String(verificationError)
          }
        })

        const transacaoAtualizada = await tx.transacao.update({
          where: { id: validatedData.transacaoId },
          data: {
            status: 'PAGAMENTO_ENVIADO',
            comprovante: validatedData.comprovanteUrl,
            observacoes: validatedData.observacoes
          },
          include: {
            comprador: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verified: true
              }
            },
            vendedor: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verified: true
              }
            }
          }
        })

        await tx.mensagem.create({
          data: {
            transacaoId: validatedData.transacaoId,
            usuarioId: userRecord.id,
            mensagem: `Comprovante de pagamento enviado - Ref: ${validatedData.numeroReferencia} (Verificação manual necessária)`,
            anexo: validatedData.comprovanteUrl,
            tipo: 'SISTEMA'
          }
        })

        return { transacao: transacaoAtualizada, verificacao }
      })

      return NextResponse.json({
        success: true,
        message: 'Comprovante enviado. Verificação automática falhou, aguardando verificação manual',
        data: result,
        automaticVerification: false,
        warning: 'Verificação automática não disponível para este método de pagamento'
      })
    }

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)

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

    // Buscar verificações de pagamento da transação
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: transacaoId,
        OR: [
          { compradorId: userRecord.id },
          { vendedorId: userRecord.id }
        ]
      },
      include: {
        verificacoesPagamento: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: transacao.verificacoesPagamento,
      transacaoStatus: transacao.status
    })

  } catch (error) {
    console.error('Erro ao buscar verificações de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
