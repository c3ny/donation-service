# Donation Service - Sangue Solidário

Um microsserviço desenvolvido em **NestJS** para gerenciar doações no sistema Sangue Solidário, seguindo os princípios da **Arquitetura Hexagonal (Ports and Adapters)** e **Clean Architecture**.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Configuração e Instalação](#configuração-e-instalação)
- [API Endpoints](#api-endpoints)
- [Modelo de Dados](#modelo-de-dados)
- [Padrões de Design](#padrões-de-design)
- [Testes](#testes)
- [Docker](#docker)

## 🎯 Visão Geral

O **Donation Service** é um microsserviço responsável por gerenciar o ciclo de vida das doações de sangue na plataforma Sangue Solidário. O serviço permite criar novas doações e atualizar seus status, mantendo um controle completo do processo de doação.

### Principais Características:

- **Arquitetura Hexagonal**: Separação clara entre domínio, aplicação e infraestrutura
- **Clean Architecture**: Inversão de dependências e baixo acoplamento
- **Domain-Driven Design (DDD)**: Modelagem focada no domínio de negócio
- **SOLID Principles**: Código limpo e manutenível
- **Result Pattern**: Tratamento de erros funcional
- **MongoDB**: Persistência de dados NoSQL
- **Docker**: Containerização para desenvolvimento e produção

## 🏗️ Arquitetura

O projeto segue a **Arquitetura Hexagonal** (Ports and Adapters), organizando o código em camadas bem definidas:

```
src/
├── application/           # Camada de Aplicação
│   ├── core/             # Núcleo da aplicação
│   │   ├── domain/       # Entidades de domínio
│   │   ├── errors/       # Enums de erros
│   │   └── service/      # Serviços da aplicação
│   └── ports/            # Interfaces (Contratos)
│       ├── in/           # Casos de uso (entrada)
│       └── out/          # Portas de saída (repositórios)
├── adapters/             # Camada de Adaptadores
│   ├── in/              # Adaptadores de entrada (Controllers)
│   └── out/             # Adaptadores de saída (Repositories)
├── types/               # Tipos e interfaces globais
└── constants/           # Constantes da aplicação
```

### Fluxo de Dados:

1. **Controller** (Adapter In) → recebe requisições HTTP
2. **Service** (Application) → orquestra os casos de uso
3. **Use Case** (Port In) → implementa regras de negócio
4. **Repository** (Adapter Out) → persiste dados no MongoDB

## 🛠️ Tecnologias Utilizadas

### Core

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **NestJS** - Framework backend escalável

### Banco de Dados

- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### Desenvolvimento

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Jest** - Framework de testes

### Produção

- **dotenv** - Gerenciamento de variáveis de ambiente
- **RxJS** - Programação reativa

## 📁 Estrutura do Projeto

### Camada de Domínio

```typescript
// Domain Entity
export class Donation {
  id: string;
  status: DonationStatus;
  content: string;
  startDate: DateType;
  finishDate?: DateType;
}

// Domain Enums
export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
```

### Camada de Aplicação

```typescript
// Use Cases (Ports In)
- CreateDonationUseCase: Criar nova doação
- UpdateStatusUseCase: Atualizar status da doação

// Repository Port (Port Out)
- DonationRepositoryPort: Interface para persistência

// Application Service
- DonationService: Orquestração dos casos de uso
```

### Camada de Adaptadores

```typescript
// Controller (Adapter In)
- DonationController: Endpoints REST

// Repository (Adapter Out)
- DonationRepository: Implementação MongoDB
```

## ⚡ Funcionalidades

### 1. Criar Doação

- **Endpoint**: `POST /donations`
- **Descrição**: Cria uma nova doação no sistema
- **Status Inicial**: `PENDING`

### 2. Atualizar Status da Doação

- **Endpoint**: `PUT /donations/:id/status`
- **Descrição**: Atualiza o status de uma doação existente
- **Status Disponíveis**: `PENDING`, `APPROVED`, `COMPLETED`, `CANCELED`

### 3. Buscar Doação por ID

- **Funcionalidade**: Implementada no repositório para suporte aos casos de uso
- **Validação**: Retorna erro `DonationNotFound` se não encontrada

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- MongoDB (via Docker)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
```

### Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd donation-service

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run start:dev

# Execute em modo debug
npm run start:debug
```

### Instalação com Docker

```bash
# Execute com Docker Compose
docker-compose up --build

# Execute em background
docker-compose up -d --build
```

## 📡 API Endpoints

### Criar Doação

```http
POST /donations
Content-Type: application/json

{
  "content": "Doação de sangue tipo O+",
  "startDate": "2024-01-15T10:00:00Z",
  "status": "PENDING",
  "userId": "user123"
}
```

**Resposta de Sucesso:**

```json
{
  "isSuccess": true,
  "value": {
    "id": "65a1b2c3d4e5f6789012345",
    "content": "Doação de sangue tipo O+",
    "startDate": "2024-01-15T10:00:00Z",
    "status": "PENDING",
    "userId": "user123"
  }
}
```

### Atualizar Status

```http
PUT /donations/65a1b2c3d4e5f6789012345/status
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Resposta de Sucesso:**

```json
{
  "isSuccess": true,
  "value": {
    "id": "65a1b2c3d4e5f6789012345",
    "content": "Doação de sangue tipo O+",
    "startDate": "2024-01-15T10:00:00Z",
    "status": "APPROVED",
    "userId": "user123"
  }
}
```

**Resposta de Erro:**

```json
{
  "isSuccess": false,
  "error": "DonationNotFound"
}
```

## 🗄️ Modelo de Dados

### Entidade Donation (MongoDB)

```typescript
{
  _id: ObjectId,           // ID único do MongoDB
  id: string,              // ID da aplicação
  status: DonationStatus,  // Status da doação
  content: string,         // Descrição da doação
  startDate: Date,         // Data de início
  finishDate?: Date,       // Data de finalização (opcional)
  userId: string           // ID do usuário doador
}
```

### Estados da Doação

- **PENDING**: Doação criada, aguardando aprovação
- **APPROVED**: Doação aprovada, pronta para execução
- **COMPLETED**: Doação realizada com sucesso
- **CANCELED**: Doação cancelada

## 🎨 Padrões de Design

### 1. Hexagonal Architecture

- **Separação de responsabilidades** entre domínio, aplicação e infraestrutura
- **Inversão de dependências** através de interfaces (ports)
- **Testabilidade** facilitada pela arquitetura

### 2. Repository Pattern

- **Abstração** da camada de persistência
- **Interface** `DonationRepositoryPort` define o contrato
- **Implementação** `DonationRepository` para MongoDB

### 3. Use Case Pattern

- **Casos de uso** específicos para cada operação de negócio
- **Single Responsibility Principle** aplicado
- **Reutilização** através do `DonationService`

### 4. Result Pattern

```typescript
// Sucesso
Result<T> = { isSuccess: true, value: T };

// Erro
Result<T> = { isSuccess: false, error: ErrorsEnum };

// Sucesso Parcial
Result<T> = { isSuccess: true, value: T, isPartialSuccess: true };
```

### 5. Dependency Injection

- **NestJS Container** para injeção de dependências
- **Symbols** para identificação de providers
- **Interface Segregation** através de ports

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes com coverage
npm run test:cov

# Testes end-to-end
npm run test:e2e
```

### Estrutura de Testes

```
test/
├── app.e2e-spec.ts      # Testes end-to-end
└── jest-e2e.json        # Configuração Jest E2E

src/
└── **/*.spec.ts          # Testes unitários
```

## 🐳 Docker

### Desenvolvimento

```bash
# Build da imagem
docker build -t donation-service:1.0.0 .

# Executar container
docker run -p 3000:3000 donation-service:1.0.0
```

### Docker Compose

```yaml
services:
  donation-service:
    build: .
    ports:
      - '3000:3000'
      - '9229:9229' # Debug port
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - ./node_modules:/app/node_modules

  mongo_donation_service:
    image: mongo
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
```

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Execução com hot reload
npm run start:debug      # Execução com debug

# Build e Produção
npm run build           # Build do projeto
npm run start:prod      # Execução em produção

# Qualidade de Código
npm run lint            # ESLint
npm run format          # Prettier

# Testes
npm run test           # Testes unitários
npm run test:e2e       # Testes end-to-end
npm run test:cov       # Coverage report
```

## 🔧 Configurações Adicionais

### TypeScript

- **Target**: ES2023
- **Decorators**: Habilitados para NestJS
- **Strict Mode**: Configurado para qualidade de código

### ESLint

- **Prettier Integration**: Formatação automática
- **TypeScript Rules**: Regras específicas para TS
- **NestJS Best Practices**: Configurações recomendadas

### Jest

- **Coverage**: Relatórios de cobertura
- **TypeScript Support**: Através do ts-jest
- **E2E Testing**: Configuração separada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença UNLICENSED - veja o arquivo [package.json](package.json) para detalhes.

---

**Projeto desenvolvido para o sistema Sangue Solidário - FATEC**
