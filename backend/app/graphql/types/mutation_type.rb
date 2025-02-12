# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end

    field :create_grid, mutation: Mutations::CreateGrid
    field :update_grid, mutation: Mutations::UpdateGrid
    field :next_generation, mutation: Mutations::NextGeneration
    field :create_user, mutation: Mutations::CreateUser
    field :sign_in_user, mutation: Mutations::SignInUser
  end
end
