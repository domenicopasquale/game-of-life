Rails.application.config.to_prepare do
  # Assicuriamoci che GraphQL sia configurato correttamente in produzione
  BackendSchema.middleware << GraphQL::Schema::TimeoutMiddleware.new(max_seconds: 10) do |err, query|
    Rails.logger.error("GraphQL timeout: #{err.message}")
  end

  if Rails.env.production?
    BackendSchema.rescue_from(StandardError) do |err, obj, args, ctx, field|
      Rails.logger.error("GraphQL error: #{err.message}")
      Rails.logger.error(err.backtrace.join("\n"))
      # Ritorna un errore generico al client
      raise GraphQL::ExecutionError.new("An error occurred processing your request")
    end
  end
end 