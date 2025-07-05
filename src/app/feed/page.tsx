import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FeedPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Feed de Ofertas
              </h1>
              <p className="text-muted-foreground">
                Explore as melhores ofertas de câmbio disponíveis
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/verificacao"
                className="inline-flex items-center justify-center px-4 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Verificar Identidade
              </Link>
              <Link
                href="/oferta/nova"
                className="inline-flex items-center justify-center px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nova Oferta
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Filtros</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select className="w-full border border-input rounded-md px-3 py-2 text-sm">
                  <option>Todos</option>
                  <option>Vendo USD</option>
                  <option>Comprando USD</option>
                  <option>Vendo EUR</option>
                  <option>Comprando EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Moeda</label>
                <select className="w-full border border-input rounded-md px-3 py-2 text-sm">
                  <option>Todas</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>ZAR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantia Min.</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Taxa Max.</label>
                <input 
                  type="number" 
                  placeholder="900"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid gap-6">
            {/* Placeholder Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Usuário Demo</h3>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verificado
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <p className="font-medium">Vendo USD</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantia:</span>
                          <p className="font-medium">$1,000</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Taxa:</span>
                          <p className="font-medium text-secondary">890 Kz/USD</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Publicado:</span>
                          <p className="font-medium">2h atrás</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/oferta/${i}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors text-sm"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}

            {/* Empty State */}
            <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg bg-white">
              <div className="mx-auto max-w-md">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Nenhuma oferta disponível
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Seja o primeiro a criar uma oferta de câmbio ou aguarde novas ofertas aparecerem.
                </p>
                <Link
                  href="/oferta/nova"
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Criar Primeira Oferta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
