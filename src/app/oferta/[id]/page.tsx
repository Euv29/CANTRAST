'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface Oferta {
  id: string
  titulo: string
  descricao: string
  categoria: string
  tipo: 'COMPRA' | 'VENDA'
  valorMin: number
  valorMax?: number
  localizacao: string
  ativo: boolean
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
    verified: boolean
  }
  _count: {
    propostas: number
  }
}

export default function OfertaDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const ofertaId = params.id as string

  const [oferta, setOferta] = useState<Oferta | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPropostaForm, setShowPropostaForm] = useState(false)
  const [proposta, setProposta] = useState({
    valor: '',
    mensagem: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const carregarOferta = useCallback(async () => {
    try {
      const response = await fetch(`/api/offers/${ofertaId}`)
      if (response.ok) {
        const data = await response.json()
        setOferta(data.data)
      } else if (response.status === 404) {
        router.push('/feed')
      }
    } catch (error) {
      console.error('Erro ao carregar oferta:', error)
      router.push('/feed')
    } finally {
      setLoading(false)
    }
  }, [ofertaId, router])

  useEffect(() => {
    if (ofertaId) {
      carregarOferta()
    }
  }, [ofertaId, carregarOferta])

  const enviarProposta = async () => {
    if (!proposta.valor || !proposta.mensagem.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ofertaId,
          valor: parseFloat(proposta.valor),
          mensagem: proposta.mensagem.trim()
        }),
      })

      if (response.ok) {
        setProposta({ valor: '', mensagem: '' })
        setShowPropostaForm(false)
        alert('Proposta enviada com sucesso!')
        carregarOferta() // Recarregar para atualizar contador de propostas
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao enviar proposta')
      }
    } catch (error) {
      console.error('Erro ao enviar proposta:', error)
      alert('Erro ao enviar proposta')
    } finally {
      setSubmitting(false)
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

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!oferta) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oferta não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A oferta solicitada não existe ou foi removida.
          </p>
          <Button onClick={() => router.push('/feed')}>
            Voltar ao Feed
          </Button>
        </div>
      </div>
    )
  }

  const isOwnOffer = oferta.user.id === user?.id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Voltar
        </Button>

        {/* Detalhes da Oferta */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{oferta.titulo}</CardTitle>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant={oferta.tipo === 'COMPRA' ? 'default' : 'secondary'}>
                    {oferta.tipo}
                  </Badge>
                  <Badge variant="outline">
                    {oferta.categoria}
                  </Badge>
                  {!oferta.ativo && (
                    <Badge variant="destructive">
                      Inativa
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {oferta.valorMax 
                    ? `${formatarValor(oferta.valorMin)} - ${formatarValor(oferta.valorMax)}`
                    : formatarValor(oferta.valorMin)
                  }
                </p>
                <p className="text-sm text-gray-500">
                  📍 {oferta.localizacao}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {oferta.descricao}
                </p>
              </div>

              {/* Informações do Usuário */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Publicado por</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <Image 
                      src={oferta.user.avatar || '/placeholder-avatar.png'} 
                      alt={oferta.user.name}
                      width={48}
                      height={48}
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{oferta.user.name}</p>
                      {oferta.user.verified && (
                        <Badge variant="outline" className="text-green-600">
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Publicado em {formatarData(oferta.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {oferta._count.propostas}
                    </p>
                    <p className="text-sm text-gray-500">Propostas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {oferta.ativo ? 'Ativa' : 'Inativa'}
                    </p>
                    <p className="text-sm text-gray-500">Status</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {oferta.categoria}
                    </p>
                    <p className="text-sm text-gray-500">Categoria</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        {!isOwnOffer && oferta.ativo && user && (
          <Card>
            <CardHeader>
              <CardTitle>Fazer Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              {!showPropostaForm ? (
                <Button 
                  onClick={() => setShowPropostaForm(true)}
                  className="w-full"
                >
                  Enviar Proposta
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor da Proposta (AOA)
                    </label>
                    <Input
                      type="number"
                      value={proposta.valor}
                      onChange={(e) => setProposta(prev => ({
                        ...prev,
                        valor: e.target.value
                      }))}
                      placeholder="Ex: 50000"
                      min={0}
                      step={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      value={proposta.mensagem}
                      onChange={(e) => setProposta(prev => ({
                        ...prev,
                        mensagem: e.target.value
                      }))}
                      placeholder="Descreva sua proposta ou faça perguntas..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={enviarProposta}
                      disabled={!proposta.valor || !proposta.mensagem.trim() || submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Enviando...' : 'Enviar Proposta'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowPropostaForm(false)
                        setProposta({ valor: '', mensagem: '' })
                      }}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mensagem para usuário não autenticado */}
        {!user && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Faça login para enviar propostas
              </p>
              <Button onClick={() => router.push('/auth/signin')}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mensagem para própria oferta */}
        {isOwnOffer && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Esta é sua oferta. Você pode gerenciá-la no seu perfil.
              </p>
              <Button onClick={() => router.push('/perfil')}>
                Ver Perfil
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
