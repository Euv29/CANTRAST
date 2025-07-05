'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Mensagem {
  id: string
  mensagem: string
  usuario: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  anexo?: string
  tipo: 'USUARIO' | 'SISTEMA'
}

interface Transacao {
  id: string
  status: string
  valor: number
  comprador: {
    id: string
    name: string
    avatar?: string
  }
  vendedor: {
    id: string
    name: string
    avatar?: string
  }
  proposta: {
    oferta: {
      titulo: string
      categoria: string
    }
  }
}

export default function ChatPage() {
  const params = useParams()
  const { user } = useUser()
  const transacaoId = params.transacaoId as string

  const [transacao, setTransacao] = useState<Transacao | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const carregarTransacao = useCallback(async () => {
    try {
      const response = await fetch(`/api/transactions?id=${transacaoId}`)
      if (response.ok) {
        const data = await response.json()
        setTransacao(data.data[0])
      }
    } catch (error) {
      console.error('Erro ao carregar transação:', error)
    }
  }, [transacaoId])

  const carregarMensagens = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?transacaoId=${transacaoId}`)
      if (response.ok) {
        const data = await response.json()
        setMensagens(data.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }, [transacaoId])

  useEffect(() => {
    if (transacaoId) {
      carregarTransacao()
      carregarMensagens()
    }
  }, [transacaoId, carregarTransacao, carregarMensagens])

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transacaoId,
          mensagem: novaMensagem.trim(),
          tipo: 'USUARIO'
        }),
      })

      if (response.ok) {
        setNovaMensagem('')
        carregarMensagens()
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setSending(false)
    }
  }

  const formatarData = (data: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!transacao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Transação não encontrada
          </h1>
          <p className="text-gray-600">
            A transação solicitada não existe ou você não tem permissão para acessá-la.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header da transação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{transacao.proposta.oferta.titulo}</span>
              <Badge variant="outline">
                {transacao.status.replace('_', ' ')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <Image 
                      src={transacao.comprador.avatar || '/placeholder-avatar.png'} 
                      alt={transacao.comprador.name}
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <span className="text-sm font-medium">
                    {transacao.comprador.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    (Comprador)
                  </span>
                </div>
                <span className="text-gray-400">↔</span>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <Image 
                      src={transacao.vendedor.avatar || '/placeholder-avatar.png'} 
                      alt={transacao.vendedor.name}
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <span className="text-sm font-medium">
                    {transacao.vendedor.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    (Vendedor)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(transacao.valor)}
                </p>
                <p className="text-sm text-gray-500">
                  {transacao.proposta.oferta.categoria}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardHeader>
            <CardTitle>Conversa</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mensagens */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {mensagens.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              ) : (
                mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${
                      mensagem.usuario.id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        mensagem.tipo === 'SISTEMA'
                          ? 'bg-blue-100 text-blue-800'
                          : mensagem.usuario.id === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {mensagem.tipo !== 'SISTEMA' && (
                        <p className="text-xs font-medium mb-1">
                          {mensagem.usuario.name}
                        </p>
                      )}
                      <p className="text-sm">{mensagem.mensagem}</p>
                      {mensagem.anexo && (
                        <a
                          href={mensagem.anexo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline mt-1 block"
                        >
                          📎 Anexo
                        </a>
                      )}
                      <p className="text-xs opacity-75 mt-1">
                        {formatarData(mensagem.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de nova mensagem */}
            <div className="flex space-x-2">
              <Input
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    enviarMensagem()
                  }
                }}
                disabled={sending}
              />
              <Button 
                onClick={enviarMensagem}
                disabled={!novaMensagem.trim() || sending}
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}