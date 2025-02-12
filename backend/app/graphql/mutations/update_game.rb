module Mutations
  class UpdateGame < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :width, Integer, required: false
    argument :height, Integer, required: false
    argument :speed, Integer, required: false
    argument :pattern, String, required: false

    type Types::GameType

    def resolve(id:, **attributes)
      check_authentication!

      game = current_user.games.find(id)
      game.update!(attributes)
      game
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Game not found"
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
    end
  end
end 