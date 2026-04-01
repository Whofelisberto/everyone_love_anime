# Everyone Love Anime 🎌

Plataforma social para compartilhar posts, comentários e interagir com outros fãs de anime/mangá.

<img border="0" data-original-height="1080" data-original-width="1920" height="600" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiQ6MJo-jwEUUb6SynoMifISX6JVSHPn2EFuai3eWqif19CnffLAzoAQDtzakd60I-P1VfyVoaicGYcqQw6DYDkgvyjTWotpx0f7Epodmmu4-1F3xFwAA4_lU1TaP0fBvbJJOnVI2kuGZ_rmY4A5BNp3he2pwPdIaunB3jOvtJd5FKvqEnyEEqYv03pn1O/s1851/1.jpg" width="1280" />

## 🛠️ Tecnologias

### Backend
- **Flask** - Framework web Python
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM para Python
- **JWT** - Autenticação com tokens
- **Cloudinary** - Armazenamento de imagens

### Frontend
- **React** - Biblioteca JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **Axios** - Api

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 16+
- PostgreSQL 14+
- Docker (opcional)

## 🚀 Configuração e Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd everyone_love_anime
```

### 2. Configure o banco de dados

#### Opção A: Usando Docker (recomendado)
```bash
docker-compose up -d
```

#### Opção B: PostgreSQL local
Crie um banco de dados chamado `everyone_love_anime_db` com as credenciais padrão:
- Usuário: `admin`
- Senha: `admin`
- Porta: `5432`

### 3. Configure o Backend

```bash
cd backend

# Crie um ambiente virtual
python -m venv venv

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Edite o arquivo .env com suas credenciais do Cloudinary
```

### 4. Configure o Frontend

```bash
cd frontend

# Instale as dependências
npm install
```

## ▶️ Executando o Projeto

### Backend
```bash
cd backend
python app.py
```
O servidor estará disponível em: `http://127.0.0.1:5000`

### Frontend
```bash
cd frontend
npm run dev
```
A aplicação estará disponível em: `http://localhost:5173`

## 📂 Estrutura do Projeto

```
everyone_love_anime/
├── backend/
│   ├── controllers/        # Lógica de negócio
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Definição de rotas
│   ├── services/          # Serviços (Cloudinary, etc)
│   ├── app.py            # Ponto de entrada
│   ├── config.py         # Configurações
│   ├── database.py       # Configuração do banco
│   └── requirements.txt  # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── Components/   # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Configuração da API
│   │   └── App.tsx      # Componente principal
│   └── package.json     # Dependências Node
│
└── docker-compose.yml   # Configuração do Docker

```

## 🔑 Variáveis de Ambiente

Edite o arquivo `backend/.env` com suas configurações:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Database
DATABASE_URL=postgresql://admin:admin@localhost:5432/everyone_love_anime_db

# JWT
JWT_SECRET_KEY=sua_chave_secreta_aqui
```

## 🔐 Endpoints da API

### Autenticação
- `POST /registrar` - Registrar novo usuário
- `POST /login` - Fazer login
- `GET /me` - Obter usuário atual (autenticado)
- `PUT /profile` - Atualizar perfil (autenticado)

### Posts
- `GET /posts` - Listar todos os posts
- `POST /post` - Criar post (autenticado)
- `GET /user/<user_id>/posts` - Posts de um usuário

### Comentários
- `GET /post/<post_id>/comentarios` - Comentários de um post
- `POST /post/<post_id>/criar-comentario` - Criar comentário (autenticado)
- `PUT /comentario/<comment_id>` - Atualizar comentário (autenticado)
- `DELETE /comentario/<comment_id>` - Deletar comentário (autenticado)

### Likes
- `POST /post/<post_id>/like` - Curtir/Descurtir post (autenticado)

## 📝 Melhorias Implementadas

✅ Relacionamentos bidirecionais nos modelos
✅ Configuração `SQLALCHEMY_TRACK_MODIFICATIONS = False`
✅ Organização de imports no `app.py`
✅ Arquivo `.env.example` para referência
✅ `.gitignore` completo na raiz
✅ Warnings do Tailwind CSS corrigidos

## 📄 Licença

Este projeto é de código aberto e está disponível para uso educacional.
