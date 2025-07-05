import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VerificacaoPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-3xl font-bold text-primary">CANTRAST</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Verificação de Identidade
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Para garantir a segurança de todos os usuários, precisamos verificar sua identidade antes de você começar a usar a plataforma
            </p>
          </div>

          {/* Progress Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 - Active */}
            <div className="relative">
              <div className="bg-white border border-secondary shadow-lg rounded-xl p-8 transition-all hover:shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary-foreground font-bold text-lg">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Upload do BI</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Faça upload da foto do seu Bilhete de Identidade para verificação automática via OCR
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                      <span className="text-secondary font-medium">Pronto para começar</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3 px-4 rounded-lg transition-colors">
                    Fazer Upload do BI
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 - Pending */}
            <div className="relative">
              <div className="bg-white border border-muted shadow-sm rounded-xl p-8 opacity-60">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground font-bold text-lg">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Verificação Facial</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Confirme sua identidade com reconhecimento facial e detecção de vida
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
                      <span className="text-muted-foreground">Aguardando step 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Pending */}
            <div className="relative">
              <div className="bg-white border border-muted shadow-sm rounded-xl p-8 opacity-60">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground font-bold text-lg">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Confirmação do Telefone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Verifique seu número de telefone via código SMS
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
                      <span className="text-muted-foreground">Aguardando steps anteriores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Seus dados estão seguros</h3>
                <p className="text-sm text-blue-700">
                  Todas as informações são criptografadas e usadas exclusivamente para verificação de identidade. 
                  Não compartilhamos seus dados com terceiros e seguimos rigorosos padrões de segurança.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/feed" 
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium rounded-lg transition-colors"
            >
              Pular por agora
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors">
              Começar Verificação
            </button>
          </div>

          {/* Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? <Link href="/suporte" className="text-secondary hover:underline font-medium">Entre em contato</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
