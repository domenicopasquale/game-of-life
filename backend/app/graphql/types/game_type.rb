module Types
  class GameType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :width, Integer, null: false
    field :height, Integer, null: false
    field :speed, Integer, null: false
    field :pattern, String
    field :initial_state, [[Boolean]], null: true, camelize: false
    field :user_id, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :user, Types::UserType, null: false

    def user
      Loaders::RecordLoader.for(User).load(object.user_id)
    end
  end
end 