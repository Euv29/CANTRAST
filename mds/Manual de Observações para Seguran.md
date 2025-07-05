# 🛡️ Manual de Observações para Segurança – CANTRAST

---

## 🔑 1. **Autenticação e Autorização**

### ✅ O que fazer:

* Usar **NextAuth.js** com **JWT** e proteção por `session.user`
* Proteger rotas com middleware:

  ```ts
  if (!session) return redirect('/auth/signin')
  ```
* Bloquear ações sensíveis (como publicar oferta ou avaliar) para:

  * Usuários não verificados (BI + Face)
  * Sessões expiradas ou inválidas

### ❌ O que evitar:

* Expor tokens ou credenciais no client
* Acessar APIs sem verificar se o user está logado

---

## 🧠 2. **Verificação de Identidade**

### ✅ O que fazer:

* Usar **FaceIO** com **liveness detection**
* Verificar formato de BI com **OCR via Google Vision API**
* Validar número de telefone com regex (`+244\d{9}`) e e-mail com domínio válido
* Armazenar os dados de verificação **criptografados no banco** (ex: número do BI, faceId)

```ts
import bcrypt from 'bcryptjs'
const hashedBi = await bcrypt.hash(biNumber, 10)
```

---

## 🧾 3. **Validação de Comprovantes**

### ✅ O que fazer:

* Sempre usar a **API oficial da FasmaPay** para verificar comprovantes
* Não aceitar apenas imagem como prova — usar verificação via API
* Exibir status “comprovante pendente” até a API validar

---

## 🔐 4. **Segurança no Frontend**

### ✅ O que fazer:

* Usar HTTPS sempre (automaticamente garantido pelo Vercel)
* Sanear todo input do usuário com libs como `DOMPurify` (para mensagens e inputs em chats)
* Proteger rotas client-side com checagem:

  ```ts
  if (!session || !user.verificado) return redirect('/verificacao')
  ```

---

## 🧰 5. **Proteção de API Routes**

### ✅ O que fazer:

* Em `pages/api/*`, validar a sessão em toda rota:

  ```ts
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })
  ```

* Validar os inputs (evitar SQL Injection ou payloads estranhos):

  * Usa **Zod** ou **Yup** para schema validation
  * Exemplo:

    ```ts
    const schema = z.object({
      moeda: z.string().min(3),
      quantidade: z.number().positive(),
    })
    ```

---

## 📦 6. **Banco de Dados e Prisma**

### ✅ O que fazer:

* Nunca expor a `DATABASE_URL` no client
* Usar **variáveis de ambiente**
* Ativar logs só em modo `development`
* Rodar migrações com controle de versionamento (`prisma migrate`)

---

## 📂 7. **Uploads de arquivos**

### ✅ O que fazer:

* Aceitar **somente imagens (JPEG, PNG)** com limites de tamanho (ex: 2MB)
* Usar UUID nos nomes dos arquivos
* Armazenar comprovantes e BIs com URLs **privadas** (e token de acesso com tempo de expiração)

---

## 🌐 8. **Rate limiting e proteção contra bots**

### ✅ O que fazer:

* Criar limite de chamadas às rotas críticas (login, API de ofertas)
* Implementar middleware simples de rate limiting por IP com cache (Ex: `lru-cache`, Redis)
* Usar CAPTCHA (opcional no MVP) em pontos como:

  * Criar conta
  * Publicar oferta

---

## 🔍 9. **Logs e Auditoria**

### ✅ O que fazer:

* Criar sistema simples de log com:

  * ID do usuário
  * Ação executada
  * IP, timestamp
* Guardar logs em banco (tabela `AuditLog`) ou ferramenta tipo Logtail / Supabase Logs

---

## 🧯 10. **Tratamento de Erros e Respostas**

### ✅ O que fazer:

* Nunca retornar mensagens como:

  * `"Erro no banco"` ou `"Exceção X"`
* Usar mensagens genéricas:

  * `"Algo deu errado, tenta novamente."`
* Monitorar erros com ferramentas tipo Sentry (opcional)

---

## 🚨 11. **Regras internas da plataforma (anti-golpe)**

* Nunca permitir que uma transação finalize sem ambos confirmarem
* Nunca liberar botões de envio/recebimento antes da verificação de comprovante
* Adicionar **termos de uso** e **aviso legal** sobre responsabilidade da troca
* Sistema de denúncia (reportar usuário)

---

## 📋 Checklist Final de Segurança

| Item                             | Status |
| -------------------------------- | ------ |
| Sessão protegida (NextAuth)      | ✅      |
| Verificação de identidade        | ✅      |
| Validação de comprovantes (API)  | ✅      |
| Uploads sanitizados              | ✅      |
| API protegida e validada         | ✅      |
| HTTPS em produção (Vercel)       | ✅      |
| Logs de ações sensíveis          | ✅      |
| Rate limiting básico             | ✅      |
| Reputação e avaliação integrada  | ✅      |
| Política de privacidade e termos | ✅      |

---