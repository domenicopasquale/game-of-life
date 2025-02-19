# Game of Life

Un'implementazione moderna del famoso "Game of Life" di Conway, realizzata con:

- Backend: Ruby on Rails + GraphQL
- Frontend: React + TypeScript

## 🎮 Il Gioco

Il Game of Life è un automa cellulare che simula l'evoluzione di una griglia di cellule basandosi su semplici regole. Ogni cellula può essere viva o morta, e il suo stato futuro dipende dal numero di cellule vive vicine.

## 🛠 Tecnologie Utilizzate

- **Backend**

  - Ruby on Rails
  - GraphQL
  - PostgreSQL
  - Devise (autenticazione)

- **Frontend**
  - React
  - Apollo Client (per GraphQL)
  - Tailwind CSS

## 🚀 Funzionalità

- Autenticazione utente
- Caricamento file di input per la configurazione iniziale
- Visualizzazione della griglia di gioco
- Simulazione in tempo reale
- Controlli per avviare/fermare la simulazione

## 📁 Struttura del Progetto

- `/backend` - API Ruby on Rails con GraphQL
- `/frontend` - Applicazione React + TypeScript

## 🌐 Utilizzo

1. Registra un nuovo account o accedi
2. Carica un file di configurazione iniziale o crea un nuovo gioco con configurazione personalizzata
3. Scegli un pattern se la griglia è vuota o crea un nuovo pattern
4. Premi "Start" per avviare la simulazione
5. Osserva l'evoluzione delle cellule
6. Usa i controlli per gestire la simulazione
