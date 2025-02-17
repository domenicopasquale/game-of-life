module Mutations
  class CreateGame < BaseMutationWithAuth
    field :id, ID, null: true
    field :name, String, null: true
    field :width, Integer, null: true
    field :height, Integer, null: true
    field :speed, Integer, null: true

    argument :name, String, required: true
    argument :width, Integer, required: true
    argument :height, Integer, required: true
    argument :speed, Integer, required: true

    def resolve(name:, width:, height:, speed:)
      game = Game.new(
        user: current_user,
        name: name,
        width: width,
        height: height,
        speed: speed
      )

      if game.save
        {
          id: game.id,
          name: game.name,
          width: game.width,
          height: game.height,
          speed: game.speed
        }
      else
        raise GraphQL::ExecutionError.new(
          "Errore nel salvataggio del gioco: #{game.errors.full_messages.join(', ')}",
          extensions: {
            code: 'SAVE_ERROR',
            detailed_message: game.errors.full_messages
          }
        )
      end
    end
  end
end 