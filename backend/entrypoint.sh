#!/bin/bash
set -e

# Rimuove un eventuale server.pid precedente
rm -f /app/tmp/pids/server.pid

# Aspetta che il database sia pronto
until nc -z -v -w30 $POSTGRES_HOST 5432
do
  echo "Waiting for postgres..."
  sleep 1
done
echo "PostgreSQL is up!"

# Esegue le migrazioni se necessario
bundle exec rails db:migrate

# Esegue il comando passato al container
exec "$@" 