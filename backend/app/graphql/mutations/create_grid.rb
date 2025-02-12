module Mutations
  class CreateGrid < BaseMutationWithAuth
    argument :width, Integer, required: true
    argument :height, Integer, required: true
    argument :cells, [[Boolean]], required: true

    type Types::GridType

    def resolve(width:, height:, cells:)
      authenticate_user!
      
      Grid.create!(
        width: width,
        height: height,
        cells: cells,
        user: current_user
      )
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
    end
  end
end 