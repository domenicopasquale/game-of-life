module Middlewares
  class Authentication
    def call(parent_type, parent_object, field_definition, field_args, query_context)
      if field_definition.metadata[:authenticate]
        unless query_context[:current_user]
          raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
        end
      end
      yield
    end
  end
end 