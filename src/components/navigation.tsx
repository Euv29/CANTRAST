'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { isSignedIn, user } = useUser()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CANTRAST</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/feed" className="text-gray-600 hover:text-gray-900">
              Feed
            </Link>
            <Link href="/oferta/nova" className="text-gray-600 hover:text-gray-900">
              Nova Oferta
            </Link>
            {isSignedIn && (
              <Link href="/perfil" className="text-gray-600 hover:text-gray-900">
                Perfil
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Olá, {user?.firstName || 'Usuário'}
                </span>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
