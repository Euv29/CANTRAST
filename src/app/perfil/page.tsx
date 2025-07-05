'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  verified: boolean
  biVerified: boolean
  createdAt: string
  _count: {
    ofertas: number
    propostas: number
    transacoes: number
    avaliacoes: number
  }
  mediaAvaliacao?: number
}

interface UserOffer {
  id: string
  titulo: string
  categoria: string
  tipo: 'COMPRA' | 'VENDA'
  valorMin: number
  valorMax?: number
  ativo: boolean
  createdAt: string
  _count: {
    propostas: number
  }
}

interface UserTransaction {
  id: string
  valor: number
  status: string
  createdAt: string
  proposta: {
    oferta: {
      titulo: string
      categoria: string
    }
  }
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
}

export default function PerfilPage() {
  const { user } = useUser()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [offers, setOffers] = useState<UserOffer[]>([])
  const [transactions, setTransactions] = useState<UserTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ofertas')

  const carregarPerfil = useCallback(async () => {
    try {
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }, [])

  const carregarOfertas = useCallback(async () => {
    try {
      const response = await fetch('/api/offers?myOffers=true')
      if (response.ok) {
        const data = await response.json()
        setOffers(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error)
    }
  }, [])

  const carregarTransacoes = useCallback(async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      Promise.all([
        carregarPerfil(),
        carregarOfertas(),
        carregarTransacoes()
      ]).finally(() => setLoading(false))
    }
  }, [user, carregarPerfil, carregarOfertas, carregarTransacoes])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(valor)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'AGUARDANDO_PAGAMENTO': 'bg-yellow-100 text-yellow-800',
      'PAGAMENTO_ENVIADO': 'bg-blue-100 text-blue-800',
      'PAGAMENTO_CONFIRMADO': 'bg-green-100 text-green-800',
      'CONCLUIDA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      'AGUARDANDO_PAGAMENTO': 'Aguardando Pagamento',
      'PAGAMENTO_ENVIADO': 'Pagamento Enviado',
      'PAGAMENTO_CONFIRMADO': 'Pagamento Confirmado',
      'CONCLUIDA': 'Concluída',
      'CANCELADA': 'Cancelada'
    }
    return texts[status as keyof typeof texts] || status
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para ver seu perfil.
          </p>
          <Button onClick={() => router.push('/auth/signin')}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header do Perfil */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-20 h-20">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || 'Usuário'}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {user.fullName?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.fullName || user.firstName || 'Usuário'}
                  </h1>
                  {profile?.verified && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
                
                {profile && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Ofertas</p>
                      <p className="font-semibold">{profile._count.ofertas}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Propostas</p>
                      <p className="font-semibold">{profile._count.propostas}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Transações</p>
                      <p className="font-semibold">{profile._count.transacoes}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avaliação</p>
                      <p className="font-semibold">
                        {profile.mediaAvaliacao ? 
                          `⭐ ${profile.mediaAvaliacao.toFixed(1)}` : 
                          'Sem avaliações'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/verificacao')}
                  variant={profile?.verified ? 'outline' : 'default'}
                >
                  {profile?.verified ? 'Verificado' : 'Verificar Conta'}
                </Button>
                <Button 
                  onClick={() => router.push('/oferta/nova')}
                  variant="outline"
                >
                  Nova Oferta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ofertas">Minhas Ofertas</TabsTrigger>
            <TabsTrigger value="transacoes">Minhas Transações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ofertas" className="space-y-4">
            {offers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">
                    Você ainda não criou nenhuma oferta.
                  </p>
                  <Button onClick={() => router.push('/oferta/nova')}>
                    Criar Primeira Oferta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              offers.map(oferta => (
                <Card key={oferta.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{oferta.titulo}</h3>
                          <Badge variant={oferta.tipo === 'COMPRA' ? 'default' : 'secondary'}>
                            {oferta.tipo}
                          </Badge>
                          <Badge variant="outline">{oferta.categoria}</Badge>
                          {!oferta.ativo && (
                            <Badge variant="secondary">Inativa</Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-blue-600">
                            {oferta.valorMax 
                              ? `${oferta.valorMin.toLocaleString()} - ${oferta.valorMax.toLocaleString()} AOA`
                              : `${oferta.valorMin.toLocaleString()} AOA`
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {oferta._count.propostas} proposta(s) • {formatarData(oferta.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/oferta/${oferta.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="transacoes" className="space-y-4">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">
                    Você ainda não tem transações.
                  </p>
                </CardContent>
              </Card>
            ) : (
              transactions.map(transacao => (
                <Card key={transacao.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">
                            {transacao.proposta.oferta.titulo}
                          </h3>
                          <Badge variant="outline">
                            {transacao.proposta.oferta.categoria}
                          </Badge>
                          <Badge className={getStatusColor(transacao.status)}>
                            {getStatusText(transacao.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-green-600">
                            {formatarValor(transacao.valor)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatarData(transacao.createdAt)}
                          </p>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span>
                            {transacao.comprador.id === profile?.id ? 'Comprando de: ' : 'Vendendo para: '}
                            {transacao.comprador.id === profile?.id 
                              ? transacao.vendedor.name 
                              : transacao.comprador.name
                            }
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/chat/${transacao.id}`)}
                      >
                        Ver Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
