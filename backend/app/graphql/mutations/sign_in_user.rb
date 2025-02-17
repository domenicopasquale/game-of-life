module Mutations
  class SignInUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :token, String, null: true
    field :user, Types::UserType, null: true

    def resolve(email:, password:)
      user = User.find_for_authentication(email: email)
      
      if user&.valid_password?(password)
        {
          token: user.generate_jwt,
          user: user
        }
      else
        raise GraphQL::ExecutionError.new(
          "Invalid credentials",
          extensions: {
            code: 'AUTHENTICATION_ERROR',
            detailed_message: 'Incorrect email or password'
          }
        )
      end
    end
  end
end 