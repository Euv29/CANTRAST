import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CANTRAST - Troca Segura de Divisas',
  description: 'Plataforma segura para troca de divisas entre pessoas com verificação de identidade e sistema de reputação.',
  keywords: ['troca de divisas', 'câmbio', 'Angola', 'USD', 'EUR', 'segurança'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="pt" className={inter.variable}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              {/* Logo CANTRAST */}
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">C</span>
                </div>
                <span className="hidden font-bold sm:inline-block">CANTRAST</span>
              </Link>

              {/* Navegação */}
              <SignedIn>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/feed" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Feed
                  </Link>
                  <Link href="/oferta/nova" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Nova Oferta
                  </Link>
                  <Link href="/perfil" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Perfil
                  </Link>
                </nav>
              </SignedIn>

              {/* Auth na direita */}
              <div className="flex flex-1 items-center justify-end space-x-4">
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </SignedIn>

                <SignedOut>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/feed" className="transition-colors hover:text-foreground/80 text-foreground/60">
                      Ver ofertas
                    </Link>
                  </nav>
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                    >
                      Criar conta
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/40 py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-screen-2xl px-4">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © 2025 CANTRAST. Todos os direitos reservados.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <a href="/termos" className="hover:text-primary transition-colors">
                  Termos
                </a>
                <a href="/privacidade" className="hover:text-primary transition-colors">
                  Privacidade
                </a>
                <a href="/suporte" className="hover:text-primary transition-colors">
                  Suporte
                </a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}