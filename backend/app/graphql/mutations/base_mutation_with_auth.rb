module Mutations
  class BaseMutationWithAuth < BaseMutation
    def ready?
      Rails.logger.tagged("BaseMutationWithAuth#ready?") do
        Rails.logger.info "=== Auth Check Started ==="
        Rails.logger.info "Current user: #{context[:current_user].inspect}"
        Rails.logger.info "Context keys: #{context.keys}"
        Rails.logger.info "Headers: #{context[:headers]}" if context[:headers]
        Rails.logger.info "Request: #{context[:request]&.inspect}"
        Rails.logger.info "Environment: #{Rails.env}"
        Rails.logger.info "Mutation Class: #{self.class.name}"
        Rails.logger.info "Arguments: #{arguments.inspect}" if respond_to?(:arguments)
        
        unless context[:current_user]
          Rails.logger.error "Authentication failed - No current user"
          raise GraphQL::ExecutionError.new(
            "Non sei autenticato per eseguire questa azione",
            extensions: { 
              code: 'UNAUTHENTICATED',
              detailed_message: 'Utente non trovato nel context'
            }
          )
        end
        
        Rails.logger.info "=== Auth Check Passed ==="
        Rails.logger.info "Authenticated User ID: #{context[:current_user].id}"
        true
      end
    rescue StandardError => e
      Rails.logger.tagged("BaseMutationWithAuth#ready?") do
        Rails.logger.error "Auth Error: #{e.class} - #{e.message}"
        Rails.logger.error "Backtrace:\n#{e.backtrace[0..5].join("\n")}"
        Rails.logger.error "Full context: #{context.to_h}"
        Rails.logger.error "Mutation Class: #{self.class.name}"
        Rails.logger.error "Arguments: #{arguments.inspect}" if respond_to?(:arguments)
        
        error_message = Rails.env.production? ? 
          "Si è verificato un errore durante l'elaborazione della richiesta" :
          "Errore: #{e.message}"
        
        raise GraphQL::ExecutionError.new(
          error_message,
          extensions: { 
            code: 'MUTATION_ERROR',
            type: e.class.name,
            detailed_message: e.message,
            mutation: self.class.name
          }
        )
      end
    end

    def current_user
      context[:current_user]
    end
  end
end 