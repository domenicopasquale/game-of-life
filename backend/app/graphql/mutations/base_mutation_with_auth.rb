module Mutations
  class BaseMutationWithAuth < BaseMutation
    def ready?
      Rails.logger.info "Current user: #{context[:current_user]&.id}"  # Logging temporaneo
      return true if context[:current_user]
      
      raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
    end

    def current_user
      context[:current_user]
    end
  end
end 