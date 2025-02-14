# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.2.2
FROM ruby:3.2.2-slim

# Installa le dipendenze essenziali
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Crea e imposta la directory di lavoro
WORKDIR /app

# Copia Gemfile e Gemfile.lock
COPY Gemfile* ./

# Installa le gemme
RUN bundle install

# Copia il resto dell'applicazione
COPY . .

# Precompila gli assets
RUN rails assets:precompile

# Espone la porta 3000
EXPOSE 3000

# Script di entrypoint per gestire il database
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Avvia l'applicazione
CMD ["rails", "server", "-b", "0.0.0.0"]
