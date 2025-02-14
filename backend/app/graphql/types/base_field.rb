# frozen_string_literal: true

module Types
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    def initialize(*args, requires_authentication: false, **kwargs, &block)
      super(*args, **kwargs, &block)
      @requires_authentication = requires_authentication
    end

    def authorized?(obj, args, ctx)
      return true unless @requires_authentication
      return true if ctx[:current_user]
      
      raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
    end
  end
end
