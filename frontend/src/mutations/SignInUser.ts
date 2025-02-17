import { gql } from '@apollo/client';

export const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`; 