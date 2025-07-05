import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
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
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>
          
          <SignIn 
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
            redirectUrl="/feed"
            signUpUrl="/auth/signup"
          />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/auth/signup" className="text-secondary hover:text-secondary/80 font-medium">
              Criar conta
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-12 bg-gradient-to-br from-primary to-primary/80">
        <div className="mx-auto max-w-xl text-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Troque divisas com segurança
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Sistema de verificação completo, reputação transparente e comprovantes validados automaticamente.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Verificação de identidade completa</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Sistema de reputação transparente</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Comprovantes validados automaticamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
