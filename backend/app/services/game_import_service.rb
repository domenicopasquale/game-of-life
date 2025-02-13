class GameImportService
  class << self
    def import(content, name:, user:)
      rows = parse_content(content)
      validate_format!(rows)

      Game.create!(
        name: name,
        width: rows.first.length,
        height: rows.length,
        speed: 500,
        initial_state: rows,
        user: user
      )
    end

    private

    def parse_content(content)
      content.split("\n").map do |row|
        row.strip.split(',').map { |cell| cell.to_i == 1 }
      end
    end

    def validate_format!(rows)
      raise ArgumentError, "Empty content" if rows.empty?
      
      width = rows.first.length
      unless rows.all? { |row| row.length == width }
        raise ArgumentError, "Inconsistent row lengths"
      end

      unless rows.all? { |row| row.all? { |cell| [true, false].include?(cell) } }
        raise ArgumentError, "Invalid cell values"
      end
    end
  end
end 