# frozen_string_literal: true

module Types
  class BaseObject < GraphQL::Schema::Object
    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField

    def check_authentication!
      unless context[:current_user]
        raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
      end
    end

    def current_user
      context[:current_user]
    end
  end
end
