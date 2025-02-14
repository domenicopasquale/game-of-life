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

# Imposta l'ambiente di produzione
ENV RAILS_ENV=production \
    NODE_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

# Copia Gemfile e Gemfile.lock
COPY Gemfile* ./

# Installa le gemme
RUN bundle config set --local without 'development test' && \
    bundle install

# Copia il resto dell'applicazione
COPY . .

# Espone la porta 3000
EXPOSE 3000

# Script di entrypoint per gestire il database
COPY bin/docker-entrypoint /usr/bin/
RUN chmod +x /usr/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

# Avvia l'applicazione
CMD ["rails", "server", "-b", "0.0.0.0"]
