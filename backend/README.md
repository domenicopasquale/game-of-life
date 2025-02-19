# Game of Life - Backend

Backend Ruby on Rails con GraphQL per il Game of Life.

### 🛠 Installazione

# Installa le gemme

```bash
bundle install
```

# Genera due chiavi diverse

```bash
rails secret

rails secret
```

# Crea un file .env nella root del backend con le chiavi generate:

```bash
FRONTEND_URL=http://localhost:5173
JWT_SECRET_KEY=prima_chiave_generata
SECRET_KEY_BASE=seconda_chiave_generata
RAILS_MAX_THREADS=5
JWT_EXPIRATION=24
```

# Crea e migra il database

```bash
rails db:create
rails db:migrate
```

### 🚀 Avvia il server

```bash
rails s -p 3001
```

Il server sarà disponibile all'indirizzo: `http://localhost:3001`

### ⚠️ Sicurezza

- File `.env` non deve essere committato
- Usa chiavi diverse in produzione
- Proteggi le chiavi segrete generate
