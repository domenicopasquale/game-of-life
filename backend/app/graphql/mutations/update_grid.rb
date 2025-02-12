module Mutations
  class UpdateGrid < BaseMutationWithAuth
    argument :id, ID, required: true
    argument :cells, [[Boolean]], required: true

    type Types::GridType

    def resolve(id:, cells:)
      authenticate_user!
      
      grid = Grid.find_by(id: id, user: current_user)
      raise GraphQL::ExecutionError, "Grid not found" unless grid
      
      grid.update!(cells: cells)
      grid
    end
  end
end 