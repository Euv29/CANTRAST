# 🔐 Manual para Criar Chaves de API – Projeto CANTRAST

---

## ✅ 1. **FACEIO** – Reconhecimento Facial

### 📍 O que é:

Serviço de verificação facial com liveness detection (grátis no plano starter).

### 🎯 Usado para:

Validar o rosto do utilizador durante o cadastro.

### 🔑 Como gerar a chave:

1. Acessa: [https://faceio.net](https://faceio.net)
2. Cria uma conta
3. Vai para o **Dashboard**
4. Clica em **Create new Application**
5. Dá um nome e URL (usa `http://localhost:3000` durante o dev)
6. Ele vai gerar:

   * `Public ID` → usado no front para iniciar o FaceIO
   * `Private Key` → (só se fores usar o backend avançado, opcional)

### 📁 Onde usar:

No cliente:

```ts
const faceio = new faceIO("YOUR_PUBLIC_ID")
```

---

## ✅ 2. **GOOGLE CLOUD VISION API** – OCR para BI

### 📍 O que é:

API do Google para ler texto de imagens (OCR), usada para extrair número do BI do upload.

### 🔑 Como gerar a chave:

1. Acessa: [https://console.cloud.google.com](https://console.cloud.google.com)
2. Cria um novo projeto: **CANTRAST**
3. Vai em **APIs e Serviços > Biblioteca**
4. Procura e ativa: **Cloud Vision API**
5. Vai em **APIs e Serviços > Credenciais**
6. Clica em **Criar credencial > Conta de serviço**

   * Dá um nome, cria e continua
7. Após criada, clica nela > **Chaves** > **Adicionar chave > JSON**
8. Baixa o arquivo `.json`

### 📁 Onde usar:

No backend (Next.js API route):

```ts
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./credentials.json",
})
```

> ⚠️ Coloca esse arquivo fora do repositório (no `.gitignore`)

---

## ✅ 3. **FASMAPAY API** – Verificação de Comprovantes

### 📍 O que é:

API angolana que valida se um comprovante de transferência Kz é real.

### 🔑 Como gerar a chave:

1. Vai para [https://pay.fasma.ao/](https://pay.fasma.ao/)
2. Cadastra-te ou entra em contacto com o suporte para acesso à API
3. Pede uma **API Key** (chave secreta)
4. Eles te entregam:

   * `API_KEY` ou `Bearer Token` para autenticar chamadas

### 📁 Onde usar:

```ts
const response = await axios.post(
  'https://pay.fasma.ao/api/comprovante',
  { comprovanteURL },
  {
    headers: {
      Authorization: `Bearer ${process.env.FASMAPAY_SECRET_KEY}`,
    }
  }
)
```

---

## ✅ 4. **SUPABASE** – DB + Realtime (chat)

### 📍 O que é:

Plataforma com banco PostgreSQL, auth, realtime e storage — tudo via API.

### 🔑 Como gerar a chave:

1. Vai em: [https://app.supabase.com](https://app.supabase.com)
2. Cria um novo projeto

   * Nome: `cantrast`
   * Senha de DB: guarda bem
3. Vai em **Project Settings > API**
4. Copia:

   * `SUPABASE_URL`
   * `ANON PUBLIC KEY` (para frontend)
   * `SERVICE ROLE KEY` (apenas se fores fazer server-to-server coisas sensíveis)

### 📁 Onde usar:

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## ✅ 5. **NEXTAUTH** – Autenticação segura

### 📍 O que é:

Lib para login com JWT e providers (e-mail, senha, GitHub, etc.)

### 🔑 Como configurar:

1. Vai gerar um `NEXTAUTH_SECRET` (uma string aleatória):

   ```bash
   openssl rand -base64 32
   ```

2. Adiciona no `.env.local`:

   ```env
   NEXTAUTH_SECRET=essa-string-aqui
   ```

3. Se usar login com e-mail:

   * Usa um provedor tipo Gmail (recomendado: Ethereal no dev)

---

## ✅ 6. **VERCEL** – Deploy automático

### 📍 O que é:

Plataforma de deploy com CI/CD automatizado para projetos Next.js

### 🔑 Como configurar:

1. Vai em: [https://vercel.com](https://vercel.com)
2. Conecta tua conta GitHub
3. Sobe o projeto pra um repositório
4. Vercel importa, instala dependências, e:

   * Permite adicionar todas as chaves `.env` no painel
5. Faz o deploy e tá online 🚀

---

## 📁 .env.local (exemplo final)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public_key_aqui

# Prisma
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/cantrast

# Auth
NEXTAUTH_SECRET=gerado_com_openssl

# FaceIO
NEXT_PUBLIC_FACEIO_PUBLIC_KEY=faceio_key_aqui

# Google Vision
GOOGLE_CLOUD_VISION_KEY_FILE=./credentials.json

# FasmaPay
FASMAPAY_SECRET_KEY=token_fornecido
```
