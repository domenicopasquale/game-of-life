module Mutations
  class CreateUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    type Types::UserType

    def resolve(email:, password:, password_confirmation:)
      User.create!(
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
    end
  end
end 