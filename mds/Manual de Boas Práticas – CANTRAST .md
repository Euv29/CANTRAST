# 🧾 Manual de Boas Práticas – CANTRAST (Next.js + Prisma)

---

## 📁 1. Organização de Pastas e Arquivos

```bash
/cantrast
│
├── /app                      # (Next.js 13+ App Router)
│   ├── layout.tsx           # Layout global
│   ├── globals.css          # Tailwind + estilo base
│   ├── /auth                # Login, signup
│   ├── /verificacao         # Verificação BI, FaceIO
│   ├── /feed                # Página com todas as ofertas
│   ├── /oferta              # Nova oferta + detalhes [id]
│   ├── /chat                # Chat por transação
│   └── /perfil              # Perfil do usuário
│
├── /components              # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── CardOferta.tsx
│   ├── Modal.tsx
│   └── Stars.tsx
│
├── /lib                     # Helpers, utils, integração API
│   ├── prisma.ts            # Client do Prisma
│   ├── faceio.ts            # Config do FaceIO
│   ├── fasmapay.ts          # Verificação do comprovante
│   └── vision.ts            # OCR do Google Vision
│
├── /hooks                   # Hooks customizados
│   └── useAuth.ts
│
├── /styles                  # Arquivos de estilo
│   └── tailwind.config.ts
│
├── /prisma                  # Schema e seeds
│   └── schema.prisma
│
└── /pages/api               # API Routes
    ├── auth/[...nextauth].ts
    ├── verify-bi.ts
    ├── verify-face.ts
    ├── verify-payment.ts
```

---

## 📦 2. Nomeação de Variáveis e Funções

### ✅ Convenções

| Tipo               | Padrão                 | Exemplo                        |
| ------------------ | ---------------------- | ------------------------------ |
| Arquivo/folder     | kebab-case             | `card-oferta.tsx`              |
| Componentes        | PascalCase             | `CardOferta`                   |
| Variáveis          | camelCase              | `moedaSelecionada`             |
| Constantes         | UPPER\_SNAKE\_CASE     | `MAX_UPLOAD_SIZE`              |
| Funções            | camelCase (ação clara) | `handleSubmitOferta()`         |
| DB Models (Prisma) | PascalCase singular    | `User`, `Offer`, `Transaction` |

---

## 🧠 3. Padrões de Código e Lógica

### 🧼 Geral

* Cada componente com props tipadas (TypeScript).
* Separar **lógica** de **interface**:

  * Hooks para lógica (`useHandleVerificacao`)
  * Componentes para UI (`<Stepper />`)
* Usar `async/await`, nada de `.then()` encadeado.
* Validação de dados com Zod ou Yup nos formulários.

---

## 🗃️ 4. Schema do Banco (`/prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String     @id @default(cuid())
  name        String?
  email       String     @unique
  password    String
  phone       String?
  biNumber    String?
  faceId      String?
  reputation  Float      @default(0)
  createdAt   DateTime   @default(now())
  offers      Offer[]
  proposals   Proposal[]
  reviewsSent     Review[] @relation("De")
  reviewsReceived Review[] @relation("Para")
}

model Offer {
  id          String     @id @default(cuid())
  user        User       @relation(fields: [userId], references: [id])
  userId      String
  type        String     // 'vende' ou 'compra'
  moeda       String
  quantidade  Float
  cambio      Float
  createdAt   DateTime   @default(now())
  proposals   Proposal[]
}

model Proposal {
  id          String     @id @default(cuid())
  offer       Offer      @relation(fields: [offerId], references: [id])
  offerId     String
  user        User       @relation(fields: [userId], references: [id])
  userId      String
  mensagem    String
  createdAt   DateTime   @default(now())
  transaction Transaction?
}

model Transaction {
  id            String     @id @default(cuid())
  proposal      Proposal   @relation(fields: [proposalId], references: [id])
  proposalId    String
  comprovante   String?
  confirmadoPorAmbos Boolean @default(false)
  chatId        String?
  createdAt     DateTime   @default(now())
}

model Review {
  id       String   @id @default(cuid())
  de       User     @relation("De", fields: [deId], references: [id])
  deId     String
  para     User     @relation("Para", fields: [paraId], references: [id])
  paraId   String
  estrelas Int
  comentario String?
  createdAt DateTime @default(now())
}
```

---

## 🧩 5. Regras de UI e Componente

* Todo componente deve ser desacoplado e reutilizável.
* Props tipadas com interfaces:

  ```ts
  interface CardOfertaProps {
    moeda: string;
    quantidade: number;
    cambio: number;
    reputacao: number;
  }
  ```
* Usar `classnames()` ou `clsx()` pra estilos condicionais.
* Tailwind para tudo, nada de CSS manual.

---

## 🔒 6. Segurança e Autorização

* Proteger rotas com middleware do NextAuth.
* Verificação do `session.user` antes de publicar, propor, ou acessar chats.
* Sanitizar uploads e validar formatos nos endpoints de API.

---

## 🧪 7. Testes e Debug

* Prioriza testes manuais no MVP
* Console.log apenas no dev. Cria `lib/logger.ts` se precisar mais tarde.
* Cria dados fakes com `prisma/seed.ts`

---

## 📌 8. Convenções de Commits (opcional)

Usar [Conventional Commits](https://www.conventionalcommits.org):

```bash
feat: adicionar página de verificação facial
fix: corrigir bug na validação do BI
refactor: melhorar componente de botão
chore: atualizar dependências
```