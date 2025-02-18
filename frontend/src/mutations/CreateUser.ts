import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    createUser(input: {
      email: $email,
      password: $password,
      passwordConfirmation: $passwordConfirmation
    }) {
      token
      user {
        id
        email
      }
    }
  }
`; 