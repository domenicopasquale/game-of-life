module Mutations
  class SignInUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    type Types::AuthTokenType

    def resolve(email:, password:)
      user = User.find_for_authentication(email: email)
      
      if user&.valid_password?(password)
        token = user.generate_jwt
        { token: token, user: user }
      else
        raise GraphQL::ExecutionError, "Invalid email or password"
      end
    end
  end
end 