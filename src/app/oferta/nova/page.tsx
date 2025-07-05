'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface NovaOfertaForm {
  titulo: string
  descricao: string
  categoria: string
  tipo: 'COMPRA' | 'VENDA'
  valorMin: string
  valorMax: string
  localizacao: string
}

const CATEGORIAS = [
  'Eletrônicos',
  'Veículos',
  'Imóveis',
  'Móveis',
  'Roupas',
  'Livros',
  'Esportes',
  'Ferramentas',
  'Casa e Jardim',
  'Beleza',
  'Serviços',
  'Outros'
]

export default function NovaOfertaPage() {
  const router = useRouter()
  const { user } = useUser()
  
  const [formData, setFormData] = useState<NovaOfertaForm>({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: 'VENDA',
    valorMin: '',
    valorMax: '',
    localizacao: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<NovaOfertaForm>>({})

  const handleInputChange = (field: keyof NovaOfertaForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<NovaOfertaForm> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório'
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }
    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }
    if (!formData.valorMin) {
      newErrors.valorMin = 'Valor mínimo é obrigatório'
    } else if (parseFloat(formData.valorMin) <= 0) {
      newErrors.valorMin = 'Valor deve ser maior que zero'
    }
    if (formData.valorMax && parseFloat(formData.valorMax) < parseFloat(formData.valorMin)) {
      newErrors.valorMax = 'Valor máximo deve ser maior que o mínimo'
    }
    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || submitting) return

    setSubmitting(true)
    try {
      const payload = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        categoria: formData.categoria,
        tipo: formData.tipo,
        valorMin: parseFloat(formData.valorMin),
        valorMax: formData.valorMax ? parseFloat(formData.valorMax) : undefined,
        localizacao: formData.localizacao.trim()
      }

      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/oferta/${data.data.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar oferta')
      }
    } catch (error) {
      console.error('Erro ao criar oferta:', error)
      alert('Erro ao criar oferta')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para criar ofertas.
          </p>
          <Button onClick={() => router.push('/auth/signin')}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Criar Nova Oferta
          </h1>
          <p className="text-gray-600 mt-2">
            Preencha os dados abaixo para publicar sua oferta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Oferta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo da Oferta */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Tipo da Oferta
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('tipo', 'VENDA')}
                  className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
                    formData.tipo === 'VENDA'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Venda</div>
                  <div className="text-sm text-gray-500">Estou vendendo</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('tipo', 'COMPRA')}
                  className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
                    formData.tipo === 'COMPRA'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Compra</div>
                  <div className="text-sm text-gray-500">Estou procurando</div>
                </button>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Título *
              </label>
              <Input
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ex: iPhone 13 Pro 256GB"
                maxLength={100}
              />
              {errors.titulo && (
                <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIAS.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição *
              </label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva detalhadamente o item ou serviço..."
                rows={4}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.descricao && (
                  <p className="text-red-500 text-sm">{errors.descricao}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.descricao.length}/1000
                </p>
              </div>
            </div>

            {/* Valores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.tipo === 'COMPRA' ? 'Orçamento Mínimo *' : 'Preço Mínimo *'} (AOA)
                </label>
                <Input
                  type="number"
                  value={formData.valorMin}
                  onChange={(e) => handleInputChange('valorMin', e.target.value)}
                  placeholder="0"
                  min={0}
                  step={100}
                />
                {errors.valorMin && (
                  <p className="text-red-500 text-sm mt-1">{errors.valorMin}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.tipo === 'COMPRA' ? 'Orçamento Máximo' : 'Preço Máximo'} (AOA)
                </label>
                <Input
                  type="number"
                  value={formData.valorMax}
                  onChange={(e) => handleInputChange('valorMax', e.target.value)}
                  placeholder="Opcional"
                  min={0}
                  step={100}
                />
                {errors.valorMax && (
                  <p className="text-red-500 text-sm mt-1">{errors.valorMax}</p>
                )}
              </div>
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Localização *
              </label>
              <Input
                value={formData.localizacao}
                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                placeholder="Ex: Luanda, Maianga"
                maxLength={100}
              />
              {errors.localizacao && (
                <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex space-x-4 pt-6">
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Criando...' : 'Criar Oferta'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {formData.titulo && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview da Oferta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{formData.titulo}</h3>
                  <Badge variant={formData.tipo === 'COMPRA' ? 'default' : 'secondary'}>
                    {formData.tipo}
                  </Badge>
                </div>
                {formData.categoria && (
                  <Badge variant="outline" className="mb-2">
                    {formData.categoria}
                  </Badge>
                )}
                {formData.descricao && (
                  <p className="text-gray-700 mb-2">{formData.descricao}</p>
                )}
                <div className="flex justify-between items-center">
                  {formData.valorMin && (
                    <p className="font-bold text-blue-600">
                      {formData.valorMax 
                        ? `${parseInt(formData.valorMin).toLocaleString()} - ${parseInt(formData.valorMax).toLocaleString()} AOA`
                        : `${parseInt(formData.valorMin).toLocaleString()} AOA`
                      }
                    </p>
                  )}
                  {formData.localizacao && (
                    <p className="text-sm text-gray-500">
                      📍 {formData.localizacao}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
