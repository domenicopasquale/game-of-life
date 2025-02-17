module Mutations
  class ImportGame < BaseMutationWithAuth
    field :game, Types::GameType, null: true
    field :errors, [String], null: true

    argument :file_content, String, required: true
    argument :name, String, required: true

    def resolve(file_content:, name:)
      # Parse il contenuto del file CSV
      rows = file_content.split("\n").map { |row| row.split(',').map(&:strip) }
      
      width = rows.first&.length || 0
      height = rows.length
      
      # Converti la griglia in array di booleani
      initial_state = rows.map do |row|
        row.map { |cell| cell.to_i == 1 }
      end

      game = Game.new(
        user: current_user,
        name: name,
        width: width,
        height: height,
        speed: 500, # Valore di default
        initial_state: initial_state
      )

      if game.save
        {
          game: game,
          errors: []
        }
      else
        {
          game: nil,
          errors: game.errors.full_messages
        }
      end
    rescue StandardError => e
      {
        game: nil,
        errors: [e.message]
      }
    end
  end
end 