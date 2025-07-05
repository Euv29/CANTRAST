import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-12 bg-gradient-to-br from-secondary to-secondary/80">
        <div className="mx-auto max-w-xl text-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Junte-se ao CANTRAST
          </h1>
          <p className="text-xl opacity-90 mb-8">
            A plataforma mais segura para troca de divisas em Angola. Verificação completa, reputação transparente.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Cadastro gratuito e rápido</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Verificação de identidade segura</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Comece a trocar imediatamente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-primary">CANTRAST</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Criar nova conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Preencha seus dados para começar
            </p>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors',
                card: 'shadow-none border-0 bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-input hover:bg-accent hover:text-accent-foreground font-medium transition-colors',
                socialButtonsBlockButtonText: 'font-medium',
                dividerLine: 'bg-border',
                dividerText: 'text-muted-foreground text-sm',
                formFieldLabel: 'text-foreground font-medium',
                formFieldInput: 'border-input focus:border-secondary transition-colors',
                footerActionLink: 'text-secondary hover:text-secondary/80 font-medium',
                identityPreviewText: 'text-foreground',
                identityPreviewEditButton: 'text-secondary hover:text-secondary/80',
              },
            }}
            routing="hash"
            redirectUrl="/verificacao"
            signInUrl="/auth/signin"
          />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/auth/signin" className="text-secondary hover:text-secondary/80 font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
