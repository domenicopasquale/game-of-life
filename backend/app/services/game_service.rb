class GameService
  def self.calculate_next_state(current_state)
    height = current_state.length
    width = current_state[0].length
    next_state = Array.new(height) { Array.new(width, false) }

    height.times do |i|
      width.times do |j|
        neighbors = count_neighbors(current_state, i, j, height, width)
        next_state[i][j] = if current_state[i][j]
          neighbors.between?(2, 3)
        else
          neighbors == 3
        end
      end
    end

    next_state
  end

  private

  def self.count_neighbors(grid, x, y, height, width)
    (-1..1).sum do |i|
      (-1..1).sum do |j|
        next 0 if i == 0 && j == 0
        new_x = (x + i + height) % height
        new_y = (y + j + width) % width
        grid[new_x][new_y] ? 1 : 0
      end
    end
  end
end 