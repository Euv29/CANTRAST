# 📋 TODO - PROJETO CANTRAST

## 🚀 FASE 1: CONFIGURAÇÃO INICIAL E ESTRUTURA BASE

### 1.1 Setup do Projeto Base
- [x] **Estrutura de diretórios criada**
- [x] **Schema do Prisma definido**
- [x] **Configurações básicas criadas**

### 1.2 Instalação e Configuração
- [ ] **Instalar dependências essenciais**
  ```bash
  npm install @clerk/nextjs @clerk/themes
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
  npm install class-variance-authority clsx tailwind-merge
  npm install @hookform/resolvers react-hook-form zod
  npm install lucide-react @google-cloud/vision @supabase/supabase-js
  npm install axios bcryptjs uuid date-fns
  npm install tailwindcss-animate
  ```

- [ ] **Configurar ShadCN UI**
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button input card form dialog dropdown-menu tabs
  npx shadcn-ui@latest add badge avatar sheet toast
  ```

- [ ] **Configurar variáveis de ambiente**
  - [X] Copiar `.env.example` para `.env.local`
  - [X] Configurar chaves do Clerk
  - [ ] Configurar DATABASE_URL do Supabase
  - [ ] Configurar outras APIs

---

## 🔐 FASE 2: AUTENTICAÇÃO COM CLERK

### 2.1 Setup do Clerk
- [ ] **Criar conta no Clerk.com**
  - [ ] Criar nova aplicação
  - [ ] Configurar provedores (Google, Email)
  - [ ] Copiar chaves para `.env.local`

- [ ] **Configurar Clerk no projeto**
  - [ ] Implementar `middleware.ts`
  - [ ] Configurar `layout.tsx` com ClerkProvider
  - [ ] Criar páginas de auth customizadas

### 2.2 Páginas de Autenticação
- [ ] **Implementar `/auth/signin`**
  - [ ] Componente SignIn personalizado
  - [ ] Integração com Google OAuth
  - [ ] Redirecionamento após login

- [ ] **Implementar `/auth/signup`**
  - [ ] Componente SignUp personalizado
  - [ ] Coleta de dados básicos
  - [ ] Redirecionamento para verificação

### 2.3 Proteção de Rotas
- [ ] **Middleware de autenticação**
  - [ ] Proteger rotas privadas
  - [ ] Redirecionamentos automáticos
  - [ ] Handling de usuários não verificados

---

## 🔒 FASE 3: SISTEMA DE VERIFICAÇÃO

### 3.1 Verificação de BI (OCR)
- [ ] **Configurar Google Vision API**
  - [ ] Criar projeto no Google Cloud
  - [ ] Ativar Vision API
  - [ ] Baixar credenciais JSON

- [ ] **Implementar upload de BI**
  - [ ] Componente de upload de arquivo
  - [ ] Validação de formato (JPG, PNG)
  - [ ] Processamento com Google Vision
  - [ ] Extração do número do BI

- [ ] **API `/api/verify-bi`**
  - [ ] Upload seguro de arquivo
  - [ ] Processamento OCR
  - [ ] Armazenamento dos dados

### 3.2 Verificação Facial (FaceIO)
- [ ] **Configurar FaceIO**
  - [ ] Criar conta no FaceIO
  - [ ] Configurar aplicação
  - [ ] Implementar no frontend

- [ ] **Componente de verificação facial**
  - [ ] Integração com FaceIO SDK
  - [ ] Liveness detection
  - [ ] Armazenamento do Face ID

- [ ] **API `/api/verify-face`**
  - [ ] Validação do Face ID
  - [ ] Associação com usuário
  - [ ] Atualização do status

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

- [ ] **API `/api/offers`**
  - [ ] POST: Criar oferta
  - [ ] GET: Listar ofertas
  - [ ] PATCH: Atualizar oferta
  - [ ] DELETE: Remover oferta

### 4.2 Feed de Ofertas
- [ ] **Página `/feed`**
  - [ ] Listagem de ofertas ativas
  - [ ] Filtros (moeda, tipo, taxa)
  - [ ] Paginação
  - [ ] Cards de oferta com reputação

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
- [ ] **API `/api/proposals`**
  - [ ] POST: Criar proposta
  - [ ] GET: Listar propostas
  - [ ] PATCH: Aceitar/rejeitar proposta

- [ ] **Lógica de negociação**
  - [ ] Criação de transação ao aceitar
  - [ ] Notificações para ambas as partes
  - [ ] Status tracking

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
- [ ] **Sistema de upload**
  - [ ] Validação de arquivos
  - [ ] Storage seguro (Supabase Storage)
  - [ ] URLs temporárias

- [ ] **Verificação com FasmaPay**
  - [ ] Integração com API
  - [ ] Validação automática
  - [ ] Feedback visual

---

## ⭐ FASE 6: SISTEMA DE REPUTAÇÃO

### 6.1 Avaliações
- [ ] **API `/api/reviews`**
  - [ ] POST: Criar avaliação
  - [ ] GET: Listar avaliações
  - [ ] Cálculo de média

- [ ] **Componente de estrelas**
  - [ ] Visualização interativa
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
