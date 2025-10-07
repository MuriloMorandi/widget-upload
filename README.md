# W#idget Upload

Widget de upload de arquivos/imagens usando **React**, **Fastify** e **Pulumi**, com backend usando Cloudflare R2.

---

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura / Tecnologias](#arquitetura--tecnologias)
- [Funcionalidades](#funcionalidades)
- [Instalação e Uso](#instalação-e-uso)
  - [Pré-requisitos](#pré-requisitos)
  - [Configurando Ambiente](#configurando-ambiente)
  - [Rodando localmente](#rodando-localmente)
  - [Rodando os teste](#rodando-os-testes)

---

## Visão Geral

Este projeto provê um widget/componentes para upload de arquivos ou imagens, com:

- Frontend em React para permitir seleção de arquivos, pré-visualização (se aplicável) e envio.
- Backend em Fastify para receber os uploads via HTTP, tratar validações e gravar nos storage.
- Armazenamento usando **Cloudflare R2** para armazenar os arquivos.
- Infraestrutura como código com **Pulumi**, para provisionar recursos necessários automaticamente.

---

## Arquitetura / Tecnologias

| Camada         | Tecnologia    | Função principal                                                             |
| -------------- | ------------- | ---------------------------------------------------------------------------- |
| Frontend       | React         | Interface de upload, UX, validações no cliente                               |
| Backend / API  | Fastify       | Pontos de entrada para upload, tratamento, segurança, integração com storage |
| Armazenamento  | Cloudflare R2 | Armazenar os arquivos enviados                                               |
| Infraestrutura | Pulumi        | Provisionamento automatizado de recursos (Buckets, configurações, etc.)      |

---

## Funcionalidades

- Selecionar arquivos para upload
- Validação básica de tipo de arquivo / tamanho
- Upload seguro para bucket R2
- Geração de URL de acesso ou retorno do caminho do arquivo após upload
- Infraestrutura automatizada com Pulumi

---

## Instalação e Uso

### Pré-requisitos

Antes de começar, certifique-se de ter:

- Node.js instalado (versão recomendada: **22.16** ou superior)
- [pnpm](https://pnpm.io/)
- Conta Cloudflare com R2 habilitado
- Pulumi instalado e configurado com credenciais (para provisionar infraestrutura)
- Docker

### Configurando Ambiente

1. Clonar este repositório:

   ```bash
   git clone https://github.com/MuriloMorandi/widget-upload.git
   cd widget-upload
   ```

2. Instale dependências (frontend e backend):

   ```bash
   cd web
   pnpm install

   cd ../server
   pnpm install
   ```

3. Configure variáveis de ambiente necessárias:

   Crie o `.env` com base no `server/.env.example` adicionando suas credenciais ee configurações

   ```
   #/server/.env.example
   PORT=3333
   NODE_ENV=dev

   DATABASE_URL="postgresql://docker:docker@localhost:5432/upload"

   CLOUDFLARE_ACCOUNT_ID=""
   CLOUDFLARE_ACCESS_KEY_ID=""
   CLOUDFLARE_SECRET_ACCESS_KEY=""
   CLOUDFLARE_BUCKET=""
   CLOUDFLARE_PUBLIC_URL="http://localhost:3333"
   ```

4. Inicie os serviços localmente no Docker

   ```bash
   # inicializar o container docker
   cd server
   docker compose up -d

   # Roda as migrations do banco de dados
   pnpm db:migrate
   ```

### Rodando localmente

1. Rode frontend e backend separadamente:

   ```bash
   # backend
   cd server
   pnpm run dev

   # frontend
   cd web
   pnpm start
   ```

### Rodando os testes

1. Rodando os testes

   ```bash
   # backend
   cd server
   pnpm run test

   ```
