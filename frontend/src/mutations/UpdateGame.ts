import { gql } from '@apollo/client';

export const UPDATE_GAME_SPEED = gql`
  mutation UpdateGameSpeed($id: ID!, $speed: Int!) {
    updateGame(input: {
      id: $id,
      speed: $speed
    }) {
      success
      game {
        id
        speed
      }
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($input: UpdateGameInput!) {
    updateGame(input: $input) {
      success
      game {
        id
        name
        initial_state
      }
    }
  }
`;