# 🎨 Design System – CANTRAST

## 🧱 1. Fundamentos

### 🎨 Cores

| Uso              | Cor         | Hex           |
| ---------------- | ----------- | ------------- |
| Primária         | Azul-escuro | `#233D4D`     |
| Secundária       | Laranja     | `#FE7F2D`     |
| Fundo claro      | Branco      | `#FFFFFF`     |
| Fundo escuro     | `Slate-900` | `#0F172A`     |
| Texto principal  | `#111827`   | Escuro neutro |
| Texto secundário | `#6B7280`   | Cinza         |
| Erro             | Vermelho    | `#DC2626`     |
| Sucesso          | Verde       | `#16A34A`     |

### 🖋️ Tipografia

* **Fonte principal**: `Inter, sans-serif`
* **Tamanhos**:

  * `text-sm`: detalhes, placeholders
  * `text-base`: corpo de texto padrão
  * `text-xl`: títulos de seções
  * `text-3xl+`: hero/títulos principais

---

## 🧩 2. Componentes UI Reutilizáveis

### ✅ Buttons

| Tipo        | Estilo Tailwind                                                            |
| ----------- | -------------------------------------------------------------------------- |
| Primário    | `bg-[#FE7F2D] text-white hover:bg-orange-600 rounded-2xl px-4 py-2 shadow` |
| Secundário  | `border border-[#FE7F2D] text-[#FE7F2D] rounded-2xl px-4 py-2`             |
| Ghost       | `text-gray-500 hover:text-[#FE7F2D]`                                       |
| Confirmação | `bg-green-600 text-white hover:bg-green-700`                               |
| Erro        | `bg-red-600 text-white hover:bg-red-700`                                   |

---

### 🧾 Inputs

| Tipo        | Estilo Tailwind                                                                    |
| ----------- | ---------------------------------------------------------------------------------- |
| Text/email  | `border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]` |
| File upload | `border-dashed border-2 rounded-xl p-4 text-center`                                |
| Número      | `appearance-none text-right`                                                       |

---

### 📄 Cards

| Uso       | Estilo                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------- |
| Oferta    | `rounded-xl bg-white shadow p-4 flex justify-between items-center hover:ring-2 ring-[#FE7F2D]` |
| Transação | `bg-slate-50 border-l-4 border-[#FE7F2D] p-3 rounded`                                          |
| Perfil    | `bg-white p-4 shadow rounded-xl w-full text-center`                                            |

---

### 🗂️ Outros

* **Modal** – confirmação de envio/recebimento
* **Toast** – feedback visual (erro, sucesso)
* **Stars** – avaliação visual com estrelas (1–5)
* **Stepper** – para verificação (BI → Selfie → E-mail)

---

## 📱 3. Views necessárias + Interação do Usuário

---

### 1. `/auth/signin` – Login/Cadastro

* **Campos**: email, senha, botão "Entrar"
* **Link**: Criar conta → `/verificacao`
* **Feedback**: erro/sucesso

---

### 2. `/verificacao` – Validação da identidade

* Stepper com 3 passos:

  1. Upload do **BI**

     * Input tipo file
     * Mostra leitura do OCR (feedback visual)
  2. Selfie (FaceIO)

     * Integração com FaceIO no frontend
     * Validação visual
  3. Validação do número de telefone e e‑mail

     * Código OTP no email ou WhatsApp (opcional)

---

### 3. `/feed` – Ver todas as ofertas

* Filtros:

  * Quero/Vendo
  * Moeda
  * Câmbio mínimo/máximo
* Cards:

  * Avatar + Nome
  * Moeda, Quantia, Câmbio
  * Reputação visual (estrelas)
  * Botão "Ver detalhes"

---

### 4. `/oferta/nova` – Criar nova oferta

* Campo: “Tenho” ou “Quero”
* Quantia da moeda
* Tipo da moeda (USD, EUR, ZAR, etc.)
* Câmbio desejado (ex: 1 USD = 890 Kz)
* Botão “Publicar Oferta”

---

### 5. `/oferta/[id]` – Detalhes de uma oferta

* Info do dono (nome, reputação, quantia)
* Botão “Fazer proposta”
* Área para escrever mensagem
* Lista de propostas recebidas (caso a oferta seja tua)
* Escolher proposta → abre o chat

---

### 6. `/chat/[transacaoId]` – Chat de transação

* Chat com mensagens em tempo real
* Upload de comprovante (imagem)
* Botão “Já transferi”
* Se FasmaPay validar → libera botão “Recebi”
* Quando ambos confirmam → troca finalizada

---

### 7. `/perfil` – Perfil do usuário

* Avatar + nome
* Média de estrelas
* Quantidade de transações
* Histórico de avaliações recebidas
* Botão para editar perfil (opcional)

---

### 8. `/minhas-ofertas` (extra)

* Lista de tuas ofertas
* Editar ou cancelar oferta
* Ver propostas recebidas

---

## 🧭 4. Navegação

* 🏠 **Feed**
* ➕ **Nova Oferta**
* 👤 **Perfil**
* 💬 **Chat**
* ⚙️ (Config/Logout)

Fixar essa nav no bottom (mobile) ou lateral (desktop).

---

## 🧪 5. Interações e Estados

* **Carregamento com spinner**
* **Validações inline nos forms**
* **Notificações toast**
* **Modal para confirmações sensíveis**
* **Estados vazios (sem ofertas, sem mensagens, etc.)**

---

## ✅ Extras para UX

* Feedback visual forte em cada passo (check, warning, erro)
* Chat com scroll automático pra última mensagem
* Histórico de transações acessível e legível
* Reputação clara e transparente com histórico público

---