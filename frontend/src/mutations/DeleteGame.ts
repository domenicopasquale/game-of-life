import { gql } from '@apollo/client';

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(input: { id: $id }) {
      success
    }
  }
`; 