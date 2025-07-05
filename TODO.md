# 📋 TODO - PROJETO CANTRAST

## 🚀 FASE 1: CONFIGURAÇÃO INICIAL E ESTRUTURA BASE

### 1.1 Setup do Projeto Base
- [x] **Estrutura de diretórios criada**
- [x] **Schema do Prisma definido**
- [x] **Configurações básicas criadas**

### 1.2 Instalação e Configuração
- [X] **Instalar dependências essenciais**
  ```bash
  npm install @clerk/nextjs @clerk/themes
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
  npm install class-variance-authority clsx tailwind-merge
  npm install @hookform/resolvers react-hook-form zod
  npm install lucide-react @google-cloud/vision @supabase/supabase-js
  npm install axios bcryptjs uuid date-fns
  npm install tailwindcss-animate
  ```

- [x] **Configurar ShadCN UI**
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button input card form dialog dropdown-menu tabs
  npx shadcn-ui@latest add badge avatar sheet toast
  ```

- [X] **Configurar variáveis de ambiente**
  - [X] Copiar `.env.example` para `.env.local`
  - [X] Configurar chaves do Clerk
  - [X] Configurar DATABASE_URL do Supabase
  - [X] Configurar outras APIs

---

## 🔐 FASE 2: AUTENTICAÇÃO COM CLERK

### 2.1 Setup do Clerk
- [x] **Criar conta no Clerk.com**
  - [x] Criar nova aplicação
  - [x] Configurar provedores (Google, Email)
  - [x] Copiar chaves para `.env.local`

- [x] **Configurar Clerk no projeto**
  - [x] Implementar `middleware.ts`
  - [x] Configurar `layout.tsx` com ClerkProvider
  - [x] Criar páginas de auth customizadas
  - [x] Melhorar UI das páginas de auth
  - [x] Corrigir redirecionamentos da landing page

### 2.2 Páginas de Autenticação
- [x] **Implementar `/auth/signin`**
  - [x] Componente SignIn personalizado
  - [x] Integração com Google OAuth
  - [x] Redirecionamento após login

- [x] **Implementar `/auth/signup`**
  - [x] Componente SignUp personalizado
  - [x] Coleta de dados básicos
  - [x] Redirecionamento para verificação

### 2.3 Proteção de Rotas
- [x] **Middleware de autenticação**
  - [x] Proteger rotas privadas
  - [x] Redirecionamentos automáticos
  - [x] Handling de usuários não verificados

---

## 🔒 FASE 3: SISTEMA DE VERIFICAÇÃO

### 3.1 Verificação de BI (OCR)
- [x] **Configurar Google Vision API**
  - [x] Implementar integração com Google Vision
  - [x] Criar função de extração de dados do BI
  - [x] Validação de formato do BI angolano

- [x] **Implementar upload de BI**
  - [x] Processamento com Google Vision
  - [x] Extração do número do BI
  - [x] Validação de formato (JPG, PNG)

- [x] **API `/api/verify-bi`**
  - [x] Upload seguro de arquivo
  - [x] Processamento OCR
  - [x] Armazenamento dos dados
  - [x] Validações completas com Zod

### 3.2 Verificação Facial (FaceIO)
- [x] **API `/api/verify-face`**
  - [x] Validação do Face ID
  - [x] Associação com usuário
  - [x] Atualização do status
  - [x] Verificação de unicidade

### 3.3 Página de Verificação
- [ ] **Implementar `/verificacao`**
  - [ ] Stepper component
  - [ ] Passo 1: Upload BI
  - [ ] Passo 2: Verificação facial
  - [ ] Passo 3: Confirmação telefone
  - [ ] Feedback visual de progresso

---

## 🏪 FASE 4: SISTEMA DE OFERTAS

### 4.1 Criar Ofertas
- [ ] **Página `/oferta/nova`**
  - [ ] Formulário de criação
  - [ ] Seleção de moedas
  - [ ] Definição de taxa
  - [ ] Validações com Zod

- [x] **API `/api/offers`**
  - [x] POST: Criar oferta
  - [x] GET: Listar ofertas
  - [x] PATCH: Atualizar oferta
  - [x] Validações completas
  - [x] Sistema de filtros e paginação

### 4.2 Feed de Ofertas
- [x] **Página `/feed`**
  - [x] Listagem de ofertas ativas
  - [x] Filtros (moeda, tipo, taxa)
  - [x] Interface responsiva

- [ ] **Componente `CardOferta`**
  - [ ] Design responsivo
  - [ ] Informações da oferta
  - [ ] Avatar e reputação do usuário
  - [ ] Botão "Ver detalhes"

### 4.3 Detalhes da Oferta
- [ ] **Página `/oferta/[id]`**
  - [ ] Informações completas
  - [ ] Perfil do ofertante
  - [ ] Formulário de proposta
  - [ ] Lista de propostas (se for o dono)

---

## 💬 FASE 5: SISTEMA DE PROPOSTAS E CHAT

### 5.1 Propostas
- [x] **API `/api/proposals`**
  - [x] POST: Criar proposta
  - [x] GET: Listar propostas
  - [x] PATCH: Aceitar/rejeitar proposta
  - [x] Validações completas

- [x] **Lógica de negociação**
  - [x] Criação de transação ao aceitar
  - [x] Status tracking completo

### 5.2 Chat de Transação
- [ ] **Configurar Supabase Realtime**
  - [ ] Setup de canais
  - [ ] Autenticação de usuários
  - [ ] Permissões de acesso

- [ ] **Página `/chat/[transacaoId]`**
  - [ ] Interface de chat em tempo real
  - [ ] Upload de comprovantes
  - [ ] Botões de confirmação
  - [ ] Histórico de mensagens

### 5.3 Upload de Comprovantes
- [x] **Sistema de upload**
  - [x] Validação de arquivos
  - [x] API de verificação de pagamentos

- [x] **Verificação com FasmaPay**
  - [x] Integração com API
  - [x] Validação automática
  - [x] Fallback para verificação manual

---

## ⭐ FASE 6: SISTEMA DE REPUTAÇÃO

### 6.1 Avaliações
- [x] **API `/api/reviews`**
  - [x] POST: Criar avaliação
  - [x] GET: Listar avaliações
  - [x] DELETE: Remover avaliação (24h)
  - [x] Cálculo automático de reputação

- [x] **Componente de estrelas**
  - [x] Sistema completo de rating
  - [x] Estatísticas de avaliações

---

## 🔥 FASE 7: APIS BACKEND IMPLEMENTADAS

### 7.1 APIs de Verificação
- [x] **`/api/verify-bi`** - Verificação de BI com Google Vision OCR
- [x] **`/api/verify-face`** - Verificação facial com FaceIO
- [x] **`/api/verify-payment`** - Verificação de comprovantes com FasmaPay

### 7.2 APIs de Negociação
- [x] **`/api/offers`** - CRUD completo de ofertas
- [x] **`/api/proposals`** - Sistema de propostas
- [x] **`/api/transactions`** - Gerenciamento de transações

### 7.3 APIs de Reputação
- [x] **`/api/reviews`** - Sistema de avaliações e reputação

### 7.4 Schema do Banco de Dados
- [x] **Prisma Schema atualizado** com todos os modelos necessários
- [x] **Relações complexas** entre User, Oferta, Proposta, Transacao, etc.
- [x] **Tipos e Enums** apropriados para o domínio
- [x] **Validações** e constraints adequadas

---

## 🛠️ PRÓXIMOS PASSOS CRÍTICOS

### 8.1 Regenerar Prisma Client
- [ ] **Executar `npx prisma generate`**
- [ ] **Resolver erros de compilação nas APIs**
- [ ] **Testar endpoints básicos**

### 8.2 Implementar Frontend
- [ ] **Conectar páginas existentes com as APIs**
- [ ] **Criar componentes para upload de BI**
- [ ] **Implementar FaceIO no frontend**
- [ ] **Criar formulários de oferta**

### 8.3 Configurar Integrações
- [ ] **Configurar Google Vision API**
- [ ] **Configurar FaceIO**
- [ ] **Configurar FasmaPay**
- [ ] **Configurar Supabase Realtime**

---
  - [ ] Comentários opcionais
  - [ ] Validação (apenas após transação)

### 6.2 Cálculo de Reputação
- [ ] **Algoritmo de reputação**
  - [ ] Média ponderada
  - [ ] Fator de confiabilidade
  - [ ] Penalidades por comportamento ruim

### 6.3 Perfil do Usuário
- [ ] **Página `/perfil`**
  - [ ] Dados pessoais
  - [ ] Histórico de transações
  - [ ] Avaliações recebidas
  - [ ] Estatísticas de atividade

---

## 🔧 FASE 7: CONFIGURAÇÕES E INTEGRAÇÃO

### 7.1 APIs Externas
- [ ] **Implementar `lib/vision.ts`**
  - [ ] Cliente Google Vision
  - [ ] Funções de OCR
  - [ ] Error handling

- [ ] **Implementar `lib/fasmapay.ts`**
  - [ ] Cliente FasmaPay
  - [ ] Verificação de comprovantes
  - [ ] Webhooks (se disponível)

- [ ] **Implementar `lib/supabase.ts`**
  - [ ] Cliente Supabase
  - [ ] Configuração Realtime
  - [ ] Storage functions

### 7.2 Hooks Customizados
- [ ] **Implementar `useAuth`**
  - [ ] Integration com Clerk
  - [ ] Status de verificação
  - [ ] User data management

- [ ] **Implementar `useOffers`**
  - [ ] CRUD operations
  - [ ] Caching com SWR/React Query
  - [ ] Filtering e sorting

- [ ] **Implementar `useVerification`**
  - [ ] Status tracking
  - [ ] Step management
  - [ ] Progress persistence

---

## 🎨 FASE 8: UI/UX E COMPONENTES

### 8.1 Componentes ShadCN
- [ ] **Configurar todos os componentes**
  - [ ] Button variants
  - [ ] Form components
  - [ ] Dialog modals
  - [ ] Toast notifications

### 8.2 Componentes Customizados
- [ ] **Implementar `Navigation`**
  - [ ] Menu responsivo
  - [ ] Links ativos
  - [ ] User button do Clerk

- [ ] **Implementar `Stepper`**
  - [ ] Progress indicator
  - [ ] Step validation
  - [ ] Navigation between steps

- [ ] **Implementar `Stars`**
  - [ ] Rating display
  - [ ] Interactive rating
  - [ ] Average calculation

### 8.3 Páginas de Estados
- [ ] **Estados vazios**
  - [ ] Sem ofertas
  - [ ] Sem mensagens
  - [ ] Sem avaliações

- [ ] **Estados de loading**
  - [ ] Skeletons
  - [ ] Spinners
  - [ ] Progress indicators

- [ ] **Estados de erro**
  - [ ] Error boundaries
  - [ ] Fallback components
  - [ ] Retry mechanisms

---

## 🚀 FASE 9: TESTES E OTIMIZAÇÃO

### 9.1 Testes de Funcionalidade
- [ ] **Fluxo completo de usuário**
  - [ ] Cadastro → Verificação → Ofertas → Chat → Avaliação
  - [ ] Diferentes cenários de erro
  - [ ] Edge cases

### 9.2 Performance
- [ ] **Otimizações do Next.js**
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Bundle analysis

- [ ] **Otimizações de banco**
  - [ ] Indexing appropriado
  - [ ] Query optimization
  - [ ] Connection pooling

### 9.3 Segurança
- [ ] **Validações finais**
  - [ ] Input sanitization
  - [ ] Rate limiting
  - [ ] CORS configuration
  - [ ] Headers de segurança

---

## 🌐 FASE 10: DEPLOY E PRODUÇÃO

### 10.1 Setup de Produção
- [ ] **Configurar Vercel**
  - [ ] Conectar repositório
  - [ ] Variables de ambiente
  - [ ] Custom domain

- [ ] **Database de produção**
  - [ ] Supabase production
  - [ ] Migrations
  - [ ] Backup strategy

### 10.2 Monitoramento
- [ ] **Error tracking**
  - [ ] Sentry integration
  - [ ] Error notifications
  - [ ] Performance monitoring

- [ ] **Analytics**
  - [ ] User analytics
  - [ ] Business metrics
  - [ ] Conversion tracking

---

## 📊 CRONOGRAMA SUGERIDO

| Fase | Duração | Prioridade | Status |
|------|---------|------------|--------|
| **Fase 1-2**: Setup + Auth | 3-5 dias | 🔴 Crítica | 🟡 Em Progresso |
| **Fase 3**: Verificação | 5-7 dias | 🔴 Crítica | ⏳ Pendente |
| **Fase 4**: Ofertas | 4-6 dias | 🟡 Alta | ⏳ Pendente |
| **Fase 5**: Chat + Propostas | 6-8 dias | 🟡 Alta | ⏳ Pendente |
| **Fase 6**: Reputação | 3-4 dias | 🟢 Média | ⏳ Pendente |
| **Fase 7**: Integrações | 4-5 dias | 🟡 Alta | ⏳ Pendente |
| **Fase 8**: UI/UX | 5-7 dias | 🟢 Média | ⏳ Pendente |
| **Fase 9**: Testes | 3-4 dias | 🟡 Alta | ⏳ Pendente |
| **Fase 10**: Deploy | 2-3 dias | 🔴 Crítica | ⏳ Pendente |

**Total estimado: 35-49 dias úteis**

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Instalar dependências** (comando fornecido na Fase 1.2)
2. **Configurar ShadCN UI** 
3. **Criar conta no Clerk e configurar autenticação**
4. **Configurar Supabase e rodar primeira migration**
5. **Implementar layout básico com Clerk**

---

## 📝 NOTAS DE DESENVOLVIMENTO

### Arquivos Criados ✅
- [x] Estrutura completa de diretórios
- [x] Schema do Prisma com modelos completos
- [x] Arquivos de configuração (tailwind.config.ts, components.json)
- [x] Arquivo .env.example
- [x] Middleware base
- [x] Páginas vazias (auth, feed, ofertas, chat, perfil)
- [x] Componentes base vazios
- [x] APIs routes vazias
- [x] Hooks customizados vazios
- [x] Libs de integração vazias

### Tecnologias Confirmadas
- **Frontend**: Next.js 13+ (App Router) + TypeScript
- **UI**: ShadCN/UI + TailwindCSS + Radix UI
- **Auth**: Clerk.com (Google OAuth + Email)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Realtime**: Supabase Realtime
- **OCR**: Google Cloud Vision API
- **Face Recognition**: FaceIO
- **Payment Verification**: FasmaPay API
- **Deployment**: Vercel

### Links Importantes
- [Clerk Documentation](https://clerk.com/docs)
- [ShadCN UI Components](https://ui.shadcn.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [FaceIO Documentation](https://faceio.net/getting-started)
- [Google Vision API](https://cloud.google.com/vision/docs)

---

**Última atualização: 5 de julho de 2025**
