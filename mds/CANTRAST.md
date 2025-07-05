# 📄 Resumo Completo – Projeto CANTRAST

## 🧠 Visão Geral

**CANTRAST** é uma plataforma simples e segura para troca de divisas entre pessoas. O foco principal é garantir **credibilidade** e **segurança** nas trocas de moeda, permitindo que os usuários escolham o parceiro com mais reputação e o câmbio mais favorável.

---

## 🎯 Objetivo

* Criar um **MVP funcional, leve e fácil de desenvolver**
* Utilizar **tecnologias grátis e acessíveis**
* Garantir **validação de identidade, comprovantes e reputação**
* Rodar em **Next.js** fullstack

---

## 👤 Fluxo do Usuário

1. **Login e verificação**

   * Cria conta com e-mail
   * Verifica:

     * Número de telefone (+244)
     * E-mail válido
     * BI (upload + leitura OCR)
     * Selfie (via FaceIO)

2. **Publicar uma oferta**

   * Escolhe se quer:

     * *Vender moeda estrangeira por Kz* ou
     * *Trocar Kz por moeda estrangeira*
   * Define quantia e taxa de câmbio
   * Oferta vai pro feed

3. **Receber propostas**

   * Outros usuários mandam propostas de troca
   * Usuário analisa **reputação** e **taxa oferecida**
   * Escolhe a melhor proposta

4. **Troca e confirmação**

   * Abre um chat com o parceiro
   * Quem envia Kz manda comprovante
   * Backend valida com FasmaPay
   * Confirmações mútuas de recebimento e envio
   * Troca concluída

5. **Avaliação**

   * Ambos avaliam com 1 a 5 estrelas
   * Sistema atualiza reputação de cada um

---

## 📊 Sistema de Reputação

* ⭐ Avaliação de 1 a 5 estrelas após transações
* ⏱️ Tempo de resposta (enviar/confirmar)
* ✅ N.º de transações bem-sucedidas
* 🧩 Sistema calcula uma **pontuação total de credibilidade**

---

## 🛠️ Tecnologias Usadas

| Tecnologia                 | Finalidade                        |
| -------------------------- | --------------------------------- |
| **Next.js**                | Frontend + Backend (API Routes)   |
| **TailwindCSS**            | Estilização rápida                |
| **NextAuth.js**            | Autenticação de usuário           |
| **Prisma**                 | ORM para banco de dados           |
| **Supabase**               | Banco (PostgreSQL) + Realtime     |
| **Firebase RT** (opcional) | Chat em tempo real                |
| **FaceIO**                 | Verificação facial (free tier)    |
| **Google Vision API**      | OCR para leitura do BI            |
| **FasmaPay API**           | Verificação de comprovantes de Kz |
| **Vercel**                 | Hospedagem gratuita do app        |

---

## 🧩 Estrutura de Rotas (Next.js)

| Página              | Finalidade                               |
| ------------------- | ---------------------------------------- |
| `/auth/signin`      | Login e criação de conta                 |
| `/verificacao`      | Upload de BI, selfie e validações        |
| `/feed`             | Ver todas as ofertas publicadas          |
| `/oferta/nova`      | Criar nova oferta de câmbio              |
| `/oferta/[id]`      | Detalhes da oferta + propostas recebidas |
| `/chat/[transacao]` | Conversa direta + envio de comprovantes  |
| `/perfil`           | Dados, reputação e histórico do usuário  |

---

## 🧬 Estrutura de Dados (Prisma)

* **User**: dados do utilizador, BI, face, reputação
* **Offer**: moeda, quantidade, taxa, tipo (compra/venda)
* **Proposal**: resposta a uma oferta com mensagem e dados
* **Transaction**: controle da troca com status e comprovantes
* **Review**: avaliações com estrelas e comentários

---

## 🔐 Segurança e Confiança

* **FaceIO** impede criação de contas fake
* **Google Vision** evita BI falsos
* **FasmaPay** valida comprovantes bancários reais
* **Sistema de reputação** torna a plataforma confiável
* **Confirmações mútuas** garantem que a troca só acontece se ambos confirmarem o pagamento/recebimento

---

## 🚀 MVP – O Essencial para Lançar

✅ Login e cadastro
✅ Verificação de identidade
✅ Publicação e visualização de ofertas
✅ Propostas de troca
✅ Escolha com base em reputação
✅ Chat + envio de comprovante
✅ Validação FasmaPay
✅ Confirmações de troca
✅ Sistema de avaliação e reputação

---

## 🛠️ Status de Prontidão

🔹 **Stack escolhida**: Next.js ✅
🔹 **Processo de troca definido** ✅
🔹 **Tecnologias externas mapeadas** ✅
🔹 **Banco de dados modelado (Prisma)** ✅
