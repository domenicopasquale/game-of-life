module Mutations
  class ImportGame < BaseMutationWithAuth
    field :game, Types::GameType, null: true
    field :errors, [String], null: true

    argument :name, String, required: true
    argument :file_content, String, required: true

    def resolve(name:, file_content:)
      # Debug del contenuto del file
      Rails.logger.debug "Raw file content: #{file_content.inspect}"
      
      # Rimuovi spazi extra e dividi in righe
      rows = file_content.strip.split("\n").map(&:strip)
      size = rows.length

      # Validazione: controlla che tutte le righe abbiano la stessa lunghezza
      unless rows.all? { |row| row.length == size }
        return {
          game: nil,
          errors: ["Invalid matrix format: all rows must have the same length (#{size} characters)"]
        }
      end

      # Validazione: controlla che ci siano solo caratteri validi
      unless rows.all? { |row| row.match?(/^[.*]+$/) }
        return {
          game: nil,
          errors: ["Invalid characters in matrix: only . and * are allowed"]
        }
      end
      
      # Crea una matrice size x size
      initial_state = Array.new(size) { Array.new(size, false) }
      
      # Riempi la matrice
      rows.each_with_index do |row, i|
        Rails.logger.debug "Processing row #{i}: #{row.inspect}"
        row.each_char.with_index do |cell, j|
          Rails.logger.debug "Cell at (#{i},#{j}): #{cell.inspect} -> #{(cell == '*').inspect}"
          initial_state[i][j] = (cell == '*')
        end
      end
      
      Rails.logger.debug "Final initial_state: #{initial_state.inspect}"

      game = Game.new(
        user: current_user,
        name: name,
        width: size,
        height: size,
        speed: 500,
        initial_state: initial_state
      )

      Rails.logger.debug "Game initial_state before save: #{game.initial_state.inspect}"

      if game.save
        Rails.logger.debug "Game saved successfully. ID: #{game.id}"
        Rails.logger.debug "Game initial_state after save: #{game.initial_state.inspect}"
        {
          game: game,
          errors: []
        }
      else
        Rails.logger.error "Game save failed: #{game.errors.full_messages}"
        {
          game: nil,
          errors: game.errors.full_messages
        }
      end
    rescue StandardError => e
      Rails.logger.error "Import error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      {
        game: nil,
        errors: [e.message]
      }
    end
  end
end 