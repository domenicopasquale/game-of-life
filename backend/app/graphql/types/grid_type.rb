module Types
  class GridType < Types::BaseObject
    field :id, ID, null: false
    field :cells, [[Boolean]], null: false
    field :width, Integer, null: false
    field :height, Integer, null: false
    field :user_id, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end 