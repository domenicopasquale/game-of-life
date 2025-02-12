module Mutations
  class BaseMutationWithAuth < BaseMutation
    def current_user
      context[:current_user]
    end

    def authenticate_user!
      raise GraphQL::ExecutionError, "You need to authenticate to perform this action" unless current_user
    end
  end
end 