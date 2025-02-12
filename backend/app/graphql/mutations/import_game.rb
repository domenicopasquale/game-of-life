module Mutations
  class ImportGame < BaseMutation
    argument :file_content, String, required: true
    argument :name, String, required: true

    field :game, Types::GameType, null: true
    field :errors, [String], null: false

    def resolve(file_content:, name:)
      check_authentication!
      
      rows = file_content.split("\n").map do |row| 
        row.strip.split(',').map { |cell| cell.to_i == 1 }
      end
      
      raise GraphQL::ExecutionError, "Invalid file format" unless valid_format?(rows)
      
      game = current_user.games.create!(
        name: name,
        width: rows.first.length,
        height: rows.length,
        speed: 500,
        initial_state: rows  # Assicuriamoci che sia un array di array di booleani
      )

      {
        game: game,
        errors: []
      }
    rescue => e
      {
        game: nil,
        errors: [e.message]
      }
    end

    private

    def valid_format?(rows)
      return false if rows.empty?
      width = rows.first.length
      rows.all? { |row| row.length == width }
    end
  end
end 