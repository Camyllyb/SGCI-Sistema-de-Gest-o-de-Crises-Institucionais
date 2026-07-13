<div align="center">

<img src="frontend/public/favicon.svg" width="92" alt="Logo SGCI" />

# SGCI

### Sistema de Gestão de Crises Institucionais

*Plataforma web para registrar, acompanhar e coordenar a resposta a crises em instituições — com um centro de monitoramento executivo para a gestão e uma área simples e segura para os usuários.*

<br/>

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Quarkus](https://img.shields.io/badge/Quarkus-3.37-4695EB?style=for-the-badge&logo=quarkus&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![JWT](https://img.shields.io/badge/Auth-JWT%20em%20cookie%20HttpOnly-2f9e41?style=flat-square)
![Flyway](https://img.shields.io/badge/Schema-Flyway%20(V1–V10)-CC0200?style=flat-square)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-2f9e41?style=flat-square)

</div>

---

## 📌 Sobre o projeto

O **SGCI** é um sistema web full-stack para **gestão de crises institucionais**. Ele permite que uma instituição
(com seus campi, departamentos e cenários) **registre ocorrências**, **acompanhe a linha do tempo de cada crise**,
**evolua o status** até o encerramento e **gere relatórios finais** — tudo com controle de acesso por perfil e
rastreabilidade completa via auditoria automática.

Existem **dois perfis de acesso**:

- **👑 Administrador** — visão executiva e gestão completa (monitoramento, usuários, cadastros, relatórios, auditoria).
- **👤 Usuário (comum)** — fluxo enxuto e seguro: cadastra e acompanha **as próprias crises** e gerencia a própria conta.

---

## ✨ Funcionalidades

### 👑 Área do Administrador
- **Centro de Monitoramento** — painel executivo com:
  - KPIs (total, em andamento, críticas, resolvidas, tempo médio de resolução e taxa de resolução);
  - **gráficos** de evolução mensal, distribuição por status, por categoria e por departamento;
  - painel de **alertas** (crises críticas, sem responsável, usuários inativos, relatórios pendentes);
  - **ações rápidas**, **últimas atividades** (a partir da auditoria) e **tabela de crises** com busca, filtros, ordenação e paginação.
- **Gestão de usuários** — CRUD completo, cargo/instituição, envio de **senha temporária por e-mail** e reset de senha.
- **Cadastros de referência** — instituições, campi, departamentos, tipos de crise e cenários.
- **Relatórios** e **auditoria** completa do sistema (todas as ações de escrita são registradas).
- **Fluxo de status da crise** — `ABERTA → EM_ANDAMENTO → RESOLVIDA → ENCERRADA` (encerrada é terminal).

### 👤 Área do Usuário
- **Cadastro de crises** com validação visual, feedback e prevenção de envio duplicado.
- **"Minhas Crises"** — vê e acompanha **somente as próprias** ocorrências (busca, filtros, ordenação e paginação).
- **Detalhe da crise** somente-leitura, com **linha do tempo** das ações.
- **Meu Perfil** e **gestão da própria senha**.

### 🔐 Segurança & Autenticação
- **Login por JWT** entregue em **cookie HttpOnly** (inacessível ao JavaScript → proteção contra XSS).
- **Primeiro acesso obrigatório**: modal bloqueante que força a troca da senha temporária.
- **Recuperação de senha** ("Esqueci minha senha") com token de uso único (SHA-256, expira em 30 min) enviado por e-mail.
- **Autorização por perfil** (`@RolesAllowed`) no backend + **guards** e diretiva `*appRole` no frontend.
- **Posse de dados**: o usuário comum só acessa as crises que ele mesmo criou; página de **Acesso Negado** para rotas restritas.
- **Política de senha** mínima (8+ caracteres, com letras e números) e hash **BCrypt**.

### 🎨 Experiência (UX)
- Design system próprio em SCSS, responsivo (desktop/notebook/tablet).
- Toasts, modais, skeleton loading, estados de vazio/erro/sucesso e microinterações.
- Sidebar recolhível com tooltips, breadcrumbs, busca global e central de notificações.

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Papel |
|---|---|
| **Java 21** | Linguagem (records, switch expressions) |
| **Quarkus 3.37** | Framework REST (JAX-RS) |
| **Hibernate ORM + Panache** | Persistência (repositórios ativos) |
| **PostgreSQL 16** | Banco de dados relacional |
| **Flyway** | Versionamento do schema (migrações V1–V10) |
| **SmallRye JWT** | Emissão/verificação de JWT em cookie |
| **Elytron / BcryptUtil** | Hash de senha (BCrypt) |
| **Hibernate Validator** | Bean Validation nos DTOs |
| **Quarkus Mailer (SMTP)** | E-mails transacionais |

### Frontend
| Tecnologia | Papel |
|---|---|
| **Angular 20** | SPA 100% standalone (sem NgModules) |
| **TypeScript 5.9** | Linguagem |
| **Signals** | Estado reativo (`signal`/`computed`/`effect`) |
| **RxJS 7** | Observables (HTTP e navegação) |
| **SCSS** | Design system próprio (sem Material/Bootstrap) |
| **SVG/CSS** | Gráficos do dashboard (sem biblioteca externa) |

---

## 🏗️ Arquitetura

Aplicação stateless em camadas — o frontend Angular consome a API REST do Quarkus, que persiste no PostgreSQL:

```
Usuário/Navegador
      │
      ▼
Frontend — Angular 20 SPA (:4200)        signals · guards · services · interceptor · *appRole
      │  HTTP/JSON · cookie JWT HttpOnly (withCredentials)
      ▼
Backend — Quarkus API (:8080)
   Controller (JAX-RS)  →  Service (BO)  →  Repository (DAO/Panache)  →  Entity (Hibernate)
      │  interceptadores transversais: Segurança JWT · AuditoriaLogFilter · ExceptionMappers
      ▼
PostgreSQL 16 (:5433)                     schema versionado por Flyway (V1–V10)
```

> 📊 O **diagrama completo do fluxo do sistema** está em [`docs/SGCI-documentacao.html`](docs/SGCI-documentacao.html) (Seção 2).

---

## 📁 Estrutura do projeto

```
SGCI/
├─ src/main/java/br/com/crisismanagement/   # Backend Quarkus
│  ├─ controllers/   # Endpoints REST (JAX-RS)
│  ├─ services/      # Regras de negócio (BO) + e-mail
│  ├─ repositories/  # Acesso a dados (DAO / Panache)
│  ├─ entities/      # Entidades + enums de domínio
│  ├─ dto/           # Records de entrada/saída (Request/Response)
│  ├─ security/      # Cookie JWT + filtro de auditoria
│  ├─ exceptions/    # Exception mappers
│  └─ config/        # DataSeeder (usuários iniciais)
├─ src/main/resources/
│  ├─ application.properties
│  └─ db/migration/  # Migrações Flyway V1..V10
├─ frontend/                                 # Frontend Angular
│  └─ src/app/
│     ├─ core/       # guards, interceptor, services, componentes (toast/modal/charts)
│     ├─ layouts/    # casca autenticada (sidebar + header)
│     └─ features/   # auth, dashboard, crises, usuarios, relatorios, perfil, cadastros...
└─ docs/                                      # Documentação técnica (HTML + PDF)
```

---

## 🚀 Como executar

### Pré-requisitos
- **JDK 21**, **Node.js 20+** e **Docker** (para o PostgreSQL).

### 1️⃣ Banco de dados (PostgreSQL via Docker)
```bash
docker run --name crisis-db \
  -e POSTGRES_DB=crisis_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 -d postgres:16
```
> As migrações do **Flyway** rodam automaticamente ao subir o backend e o `DataSeeder` cria os usuários iniciais.

### 2️⃣ Backend (Quarkus — porta 8080)
```bash
# Linux/macOS
./mvnw quarkus:dev
# Windows (PowerShell)
.\mvnw.cmd quarkus:dev
```

### 3️⃣ Frontend (Angular — porta 4200)
```bash
cd frontend
npm install
npm start        # ou: ng serve
```
Acesse **http://localhost:4200**.

### 🔑 Credenciais de acesso (ambiente local)
| Perfil | E-mail | Senha |
|---|---|---|
| 👑 Administrador | `admin@crisis.local` | `Admin@123` |
| 👤 Usuário comum | `usuario@crisis.local` | `Comum@123` |

### ✉️ E-mail (opcional)
Por padrão, `quarkus.mailer.mock=true` — os e-mails (senha temporária, recuperação) são apenas **logados no console**.
Para enviar de verdade, configure SMTP via variáveis de ambiente (arquivo `.env` na raiz): `MAIL_HOST`, `MAIL_PORT`,
`MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` e `MAIL_MOCK=false`.

---

## 🧭 Perfis e permissões

| Recurso | 👑 Administrador | 👤 Usuário comum |
|---|:---:|:---:|
| Login, perfil e troca de senha | ✅ | ✅ |
| Criar crises | ✅ | ✅ |
| Ver crises | Todas | Somente as próprias |
| Registrar ações / mudar status | ✅ | ❌ (somente leitura) |
| Relatórios | ✅ | ❌ |
| Cadastros, usuários e auditoria | ✅ | ❌ |
| Dashboard | Centro de Monitoramento | Home resumida |

---

## 📚 Documentação

A documentação técnica detalhada (com diagramas, fluxos e trechos de código comentados) está em [`docs/`](docs/):

| Documento | Conteúdo |
|---|---|
| [`SGCI-documentacao`](docs/SGCI-documentacao.html) | Visão geral do sistema + **diagrama de fluxo** |

*(Cada documento também está disponível em `.pdf`.)*

---

<div align="center">

Desenvolvido como **Trabalho de Conclusão de Curso** · Sistema de Gestão de Crises Institucionais 🛡️

</div>
