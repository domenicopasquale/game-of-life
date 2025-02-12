module Mutations
  class NextGeneration < BaseMutationWithAuth
    argument :id, ID, required: true
    
    type Types::GridType

    def resolve(id:)
      authenticate_user!
      
      grid = Grid.find_by(id: id, user: current_user)
      raise GraphQL::ExecutionError, "Grid not found" unless grid
      
      next_gen = calculate_next_generation(grid.cells)
      grid.update!(cells: next_gen)
      grid
    end

    private

    def calculate_next_generation(current_cells)
      height = current_cells.length
      width = current_cells[0].length
      next_gen = Array.new(height) { Array.new(width, false) }

      height.times do |i|
        width.times do |j|
          neighbors = count_neighbors(current_cells, i, j)
          cell = current_cells[i][j]

          next_gen[i][j] = if cell
            # Regola 1: Una cellula viva con meno di 2 vicini vivi muore
            # Regola 2: Una cellula viva con 2 o 3 vicini vivi sopravvive
            # Regola 3: Una cellula viva con più di 3 vicini vivi muore
            neighbors == 2 || neighbors == 3
          else
            # Regola 4: Una cellula morta con esattamente 3 vicini vivi diventa viva
            neighbors == 3
          end
        end
      end

      next_gen
    end

    def count_neighbors(grid, row, col)
      count = 0
      height = grid.length
      width = grid[0].length

      (-1..1).each do |i|
        (-1..1).each do |j|
          next if i == 0 && j == 0
          # Calcolo delle coordinate con wrapping
          r = (row + i) % height  # Se va oltre il bordo, torna dall'altro lato
          c = (col + j) % width   # Se va oltre il bordo, torna dall'altro lato
          count += 1 if grid[r][c]
        end
      end
      count
    end
  end
end 