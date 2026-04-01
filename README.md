# Everyone Love Anime 🎌

Rede social full stack para fãs de anime e mangá, com publicação de posts, curtidas, comentários, autenticação via JWT e upload de imagens com Cloudinary.

<img border="0" data-original-height="1080" data-original-width="1920" height="600" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiQ6MJo-jwEUUb6SynoMifISX6JVSHPn2EFuai3eWqif19CnffLAzoAQDtzakd60I-P1VfyVoaicGYcqQw6DYDkgvyjTWotpx0f7Epodmmu4-1F3xFwAA4_lU1TaP0fBvbJJOnVI2kuGZ_rmY4A5BNp3he2pwPdIaunB3jOvtJd5FKvqEnyEEqYv03pn1O/s1851/1.jpg" width="1280" />

## ✨ Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Criação de posts com título, conteúdo e imagem opcional
- Feed com busca por título, conteúdo ou autor
- Curtidas e comentários em posts
- Perfil do usuário com foto via Cloudinary
- Visualização de posts por usuário
- Backend e frontend containerizados com Docker

## 🧱 Stack do projeto

### Backend

- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Cors
- PostgreSQL
- Cloudinary
- Python Dotenv

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Lucide React

## 📁 Estrutura

```text
everyone_love_anime/
├── backend/
│   ├── controllers/        # Regras de negócio
│   ├── models/             # Modelos do banco
│   ├── routes/             # Rotas Flask
│   ├── services/           # Integrações externas
│   ├── app.py              # Inicialização da API
│   ├── config.py           # Configurações e variáveis de ambiente
│   ├── database.py         # Instância do SQLAlchemy
│   └── requirements.txt    # Dependências Python
├── frontend/
│   ├── src/
│   │   ├── Components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Cliente HTTP
│   │   └── App.tsx         # Rotas do frontend
│   └── package.json
├── docker-compose.yml
├── CLOUDINARY_SETUP.md
└── README.md
```

## 📋 Pré-requisitos

Para rodar localmente:

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ ou Docker

## ⚙️ Variáveis de ambiente

### Backend

Copie [backend/.env.example](backend/.env.example) para `backend/.env` e ajuste os valores.

Exemplo:

```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
DATABASE_URL=postgresql://admin:admin@localhost:5435/everyone_love_anime_db
JWT_SECRET_KEY=sua_chave_secreta_super_segura_aqui
```

### Frontend

Crie `frontend/.env` com:

```env
VITE_API_URL=http://127.0.0.1:5001
```

> O frontend usa `VITE_API_URL` como base da API.

## 🚀 Como rodar localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd everyone_love_anime
```

### 2. Suba o banco de dados

#### Opção A — Docker

```bash
docker compose up -d db
```

O PostgreSQL ficará disponível em `localhost:5435`.

#### Opção B — PostgreSQL local

Crie um banco chamado `everyone_love_anime_db` e ajuste a `DATABASE_URL` conforme necessário.

### 3. Inicie o backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

API disponível em:

- `http://127.0.0.1:5001`

### 4. Inicie o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:

- `http://127.0.0.1:5174`

## 🐳 Como rodar com Docker

Para subir toda a stack:

```bash
docker compose up --build
```

Serviços expostos:

- Frontend: `http://127.0.0.1:5175`
- Backend: `http://127.0.0.1:5001`
- PostgreSQL: `localhost:5435`

## 🧪 Scripts úteis

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
python app.py
```

## 🔐 Endpoints principais da API

### Autenticação

- `POST /registrar` — cria um novo usuário
- `POST /login` — autentica e retorna token JWT
- `POST /logout` — encerra a sessão no cliente
- `GET /me` — retorna o usuário autenticado
- `PUT /profile` — atualiza o perfil do usuário autenticado
- `GET /users` — lista usuários
- `GET /user/<user_id>` — busca um usuário por id

### Posts

- `GET /posts` — lista posts do feed
- `POST /post` — cria um novo post
- `GET /user/<user_id>/posts` — lista posts de um usuário

### Comentários

- `GET /post/<post_id>/comentarios` — lista comentários do post
- `POST /post/<post_id>/criar-comentario` — cria comentário
- `GET /comentario/<comment_id>` — detalha comentário
- `PUT /comentario/<comment_id>` — atualiza comentário
- `DELETE /comentario/<comment_id>` — remove comentário

### Curtidas

- `POST /post/<post_id>/like` — curte ou descurte um post

## ☁️ Cloudinary

O projeto usa Cloudinary para:

- foto de perfil
- imagens de posts

Consulte [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) para o passo a passo de configuração.

## 🖥️ Rotas do frontend

- `/` — feed principal
- `/login` — login
- `/registrar` — cadastro
- `/criar` — criação de post
- `/perfil` — perfil do usuário autenticado
- `/profile/:userId` — perfil público de outro usuário

## 📝 Observações

- O backend cria as tabelas automaticamente ao iniciar.
- O token JWT é enviado no header `Authorization: Bearer <token>`.
- O frontend salva o token no `localStorage`.
- O CORS já está configurado para origens locais e alguns hosts específicos.

## 📄 Licença

Projeto de uso educacional.
