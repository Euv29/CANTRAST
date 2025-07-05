import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SignedOut>
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              �️ A plataforma mais segura de Angola
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Troque divisas com total{' '}
                <span className="text-primary">segurança</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Plataforma verificada para troca de divisas em Angola. 
                Conecte-se com pessoas confiáveis e faça negócios seguros.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link 
                href="/auth/signup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Começar agora
              </Link>
              <Link 
                href="/feed"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Ver ofertas
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Verificação obrigatória</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Comprovantes validados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span>Sistema anti-fraude</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Como funciona
              </h2>
              <p className="text-muted-foreground">
                Simples, rápido e 100% seguro
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Verificar identidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastre-se e verifique sua identidade com BI e reconhecimento facial
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Encontrar ofertas</h3>
                  <p className="text-sm text-muted-foreground">
                    Navegue pelas ofertas ou publique a sua. Compare taxas e escolha o melhor parceiro
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Trocar com segurança</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat seguro, comprovantes validados e confirmação mútua
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Por que escolher CANTRAST?
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Verificação completa</h3>
                  <p className="text-sm text-muted-foreground">
                    Verificação de BI, reconhecimento facial e validação de telefone
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Sistema de reputação</h3>
                  <p className="text-sm text-muted-foreground">
                    Avalie e seja avaliado. Escolha os melhores parceiros
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Comprovantes validados</h3>
                  <p className="text-sm text-muted-foreground">
                    Verificação automática com integração FasmaPay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50 px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground">
              Junte-se a centenas de angolanos que já trocam divisas com segurança
            </p>
            <Link 
              href="/auth/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Criar conta gratuita
            </Link>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        {/* Dashboard para usuários logados */}
        <section className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Welcome Badge */}
            <div className="inline-flex items-center rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              ✅ Conta verificada
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Bem-vindo de volta!
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Pronto para fazer negócios? Explore as ofertas ou crie a sua própria
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link 
                href="/feed"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explorar ofertas
              </Link>
              <Link 
                href="/oferta/nova"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Criar oferta
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">5.0</div>
                <p className="text-xs text-muted-foreground">Avaliação</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">42</div>
                <p className="text-xs text-muted-foreground">Transações</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <p className="text-xs text-muted-foreground">Sucesso</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <Link href="/perfil" className="rounded-lg border bg-card p-4 text-center hover:bg-accent transition-colors">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-xs font-medium">Perfil</p>
              </Link>
              
              <Link href="/chat" className="rounded-lg border bg-card p-4 text-center hover:bg-accent transition-colors">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-xs font-medium">Chat</p>
              </Link>

              <Link href="/verificacao" className="rounded-lg border bg-card p-4 text-center hover:bg-accent transition-colors">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium">Status</p>
              </Link>
            </div>
          </div>
        </section>
      </SignedIn>
    </div>
  )
}

