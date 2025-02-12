# frozen_string_literal: true

module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

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
