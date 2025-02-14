module Mutations
  class SignInUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :token, String, null: true
    field :user, Types::UserType, null: true

    def resolve(email:, password:)
      user = User.find_for_authentication(email: email)
      return { user: nil, token: nil } unless user

      if user.valid_password?(password)
        token = user.generate_jwt
        Rails.logger.info "Generated token for user #{user.id}"  # Logging temporaneo
        { user: user, token: token }
      else
        raise GraphQL::ExecutionError, "Invalid credentials"
      end
    end
  end
end 