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
    end

    field :grids, [Types::GridType], null: false do
      description "Get all grids for current user"
    end

    def grid(id:)
      return nil unless context[:current_user]
      context[:current_user].grids.find_by(id: id)
    end

    def grids
      return [] unless context[:current_user]
      context[:current_user].grids
    end
  end
end
