# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end

    field :grid, Types::GridType, null: true do
      description "Get a specific grid by ID"
      argument :id, ID, required: true

      def authorized?
        return true if context[:current_user]
        raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
      end
    end

    field :grids, [Types::GridType], null: false do
      description "Get all grids for current user"

      def authorized?
        return true if context[:current_user]
        raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
      end
    end

    def grid(id:)
      context[:current_user].grids.find_by(id: id)
    end

    def grids
      context[:current_user].grids
    end

    field :my_games, [Types::GameType], null: false, requires_authentication: true do
      description "Get all games for current user"
      argument :limit, Integer, required: false, default_value: 50
    end

    def my_games(limit:)
      context[:current_user]
        .games
        .order(created_at: :desc)
        .limit(limit)
    end

    field :games, [Types::GameType], null: false do
      def authorized?
        return true if context[:current_user]
        raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
      end
    end

    def games
      context[:current_user].games.order(created_at: :desc)
    end
  end
end
