import { gql } from '@apollo/client';

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      name
      width
      height
      speed
      initial_state
      createdAt
      updatedAt
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      name
      width
      height
      speed
      initial_state
    }
  }
`; 