module Mutations
  class CreateUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :token, String, null: true
    field :user, Types::UserType, null: true

    def resolve(email:, password:, password_confirmation:)
      user = User.new(
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )

      if user.save
        {
          token: user.generate_jwt,
          user: user
        }
      else
        raise GraphQL::ExecutionError.new(
          "Registration error",
          extensions: {
            code: 'REGISTRATION_ERROR',
            detailed_message: user.errors.full_messages.join(', ')
          }
        )
      end
    rescue ActiveRecord::RecordNotUnique
      raise GraphQL::ExecutionError.new(
        "Email already registered",
        extensions: {
          code: 'DUPLICATE_EMAIL',
          detailed_message: 'An account with this email already exists'
        }
      )
    end
  end
end 