# ⚙️ Manual de Stacks e Dependências – CANTRAST

---

## 🔧 1. STACK PRINCIPAL

| Camada          | Tecnologia                      | Motivo da Escolha                            |
| --------------- | ------------------------------- | -------------------------------------------- |
| **Frontend**    | Next.js + Tailwind              | Fullstack + UI rápida e clean                |
| **Backend**     | Next.js API Routes              | Sem necessidade de backend separado          |
| **DB**          | Supabase (PostgreSQL)           | Grátis, rápido e fácil integração com Prisma |
| **ORM**         | Prisma                          | Tipado, seguro e flexível                    |
| **Auth**        | NextAuth.js                     | JWT + Social/email login                     |
| **Realtime**    | Supabase Realtime / Firebase RT | Para chat de transação                       |
| **OCR**         | Google Vision API               | Para leitura do BI                           |
| **Facial**      | FaceIO                          | Reconhecimento facial gratuito               |
| **Comprovante** | FasmaPay API                    | Verificação de comprovativos (Kz)            |
| **Deploy**      | Vercel                          | CI/CD automáticos e hosting grátis           |

---

## 📦 2. DEPENDÊNCIAS NPM

### 🧱 Base do Projeto

```bash
npm install next react react-dom typescript
```

### 🎨 UI e Estilo

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

* Tailwind + config responsiva e minimalista
* Usa `clsx` para estilos condicionais:

```bash
npm install clsx
```

### 🔐 Autenticação

```bash
npm install next-auth
```

### 🧬 Banco de Dados

```bash
npm install prisma @prisma/client
npx prisma init
```

* Usa o banco do Supabase:

```env
DATABASE_URL="postgresql://<usuario>:<senha>@<host>:<porta>/<db>"
```

### ✅ Validação de Dados

```bash
npm install zod
```

* Para validações seguras nas rotas e formulários.

---

### 💬 Realtime (Chat)

#### Opção 1: Supabase Realtime (recomendado)

```bash
npm install @supabase/supabase-js
```

#### Opção 2: Firebase (se preferir)

```bash
npm install firebase
```

---

### 📸 FaceIO (Biometria facial)

* Instalação via script no `<head>`:

```html
<script src="https://cdn.faceio.net/fio.js"></script>
```

* Integração JS no client (sem npm).

---

### 🧾 Google Vision API (OCR)

* Instalação:

```bash
npm install @google-cloud/vision
```

* Requer uma **service account key** JSON.

---

### 💳 FasmaPay API

* Integração via `fetch` ou `axios`:

```bash
npm install axios
```

* Exemplo de chamada:

```ts
axios.post('https://pay.fasma.ao/api/check-comprovante', { ... })
```

---

### 💡 Utilitários extras

| Lib               | Uso                              |
| ----------------- | -------------------------------- |
| `uuid`            | Gerar identificadores únicos     |
| `date-fns`        | Manipulação de datas             |
| `bcryptjs`        | Hash de dados sensíveis (ex: BI) |
| `react-hook-form` | Forms eficientes e validáveis    |
| `react-icons`     | Ícones para UI                   |
| `react-toastify`  | Notificações visuais             |

```bash
npm install uuid date-fns bcryptjs react-hook-form react-icons react-toastify
```

---

## 🧪 Dev e Code Quality

```bash
npm install -D eslint prettier eslint-config-next
```

* Padrões automáticos e linting para manter o código limpo.

---

## 🛠️ 3. FERRAMENTAS EXTERNAS RECOMENDADAS

| Ferramenta                  | Propósito                         |
| --------------------------- | --------------------------------- |
| **Vercel**                  | Deploy automático com GitHub      |
| **Supabase**                | Banco de dados + autenticação     |
| **Google Cloud**            | API Vision (OCR do BI)            |
| **FaceIO**                  | Reconhecimento facial             |
| **FasmaPay**                | Verificação de comprovantes reais |
| **Sentry** (opcional)       | Monitoramento de erros            |
| **Logtail / Supabase Logs** | Logs e auditoria                  |

---

## 📋 Checklist de Setup

* [x] Criar projeto Next.js com Tailwind
* [x] Conectar Prisma ao Supabase
* [x] Configurar NextAuth
* [x] Criar `.env.local` com segredos
* [x] Iniciar modelos no `schema.prisma`
* [x] Instalar dependências do OCR e FaceIO
* [x] Criar componentes base: `Button`, `Input`, `CardOferta`, `Stars`
* [x] Configurar deploy contínuo na Vercel

---

## 🔐 .env.local (exemplo)

```env
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/db
NEXTAUTH_SECRET=chave-ultra-secreta
FACEIO_PUBLIC_KEY=xxx
GOOGLE_CLOUD_VISION_KEY_FILE=./credentials.json
FASMAPAY_SECRET_KEY=xxx
```