module Mutations
  class UpdateGame < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :width, Integer, required: false
    argument :height, Integer, required: false
    argument :speed, Integer, required: false
    argument :pattern, String, required: false
    argument :initial_state, [[Boolean]], required: false, camelize: false

    field :game, Types::GameType, null: true
    field :errors, [String], null: false

    def resolve(id:, name: nil, width: nil, height: nil, speed: nil, pattern: nil, initial_state: nil)
      check_authentication!

      game = current_user.games.find(id)
      
      if game.user != context[:current_user]
        return { game: nil, errors: ['Not authorized'] }
      end

      updates = {}
      updates[:name] = name if name
      updates[:width] = width if width
      updates[:height] = height if height
      updates[:speed] = speed if speed
      updates[:pattern] = pattern if pattern
      updates[:initial_state] = initial_state if initial_state

      if game.update(updates)
        { game: game, errors: [] }
      else
        { game: nil, errors: game.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Game not found"
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
    end
  end
end 