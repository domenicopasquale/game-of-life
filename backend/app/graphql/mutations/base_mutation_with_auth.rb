module Mutations
  class BaseMutationWithAuth < BaseMutation
    def ready?
      return true if context[:current_user]
      
      raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
    end

    def current_user
      context[:current_user]
    end
  end
end 