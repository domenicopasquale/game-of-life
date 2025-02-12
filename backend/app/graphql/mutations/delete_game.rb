module Mutations
  class DeleteGame < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      check_authentication!

      game = current_user.games.find(id)
      if game.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: game.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Game not found"
    end
  end
end 