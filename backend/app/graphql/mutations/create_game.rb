module Mutations
  class CreateGame < BaseMutation
    argument :name, String, required: true
    argument :width, Integer, required: true
    argument :height, Integer, required: true
    argument :speed, Integer, required: true
    argument :pattern, String, required: false

    type Types::GameType

    def resolve(name:, width:, height:, speed:, pattern: nil)
      check_authentication!

      current_user.games.create!(
        name: name,
        width: width,
        height: height,
        speed: speed,
        pattern: pattern
      )
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
    end
  end
end 