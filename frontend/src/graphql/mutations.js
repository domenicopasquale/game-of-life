export const UPDATE_GAME_SPEED = `
  mutation UpdateGame($id: ID!, $speed: Int!) {
    updateGame(input: {
      id: $id
      speed: $speed
    }) {
      id
      speed
    }
  }
`;

export const SAVE_GAME_STATE = `
  mutation SaveGameState($input: UpdateGameInput!) {
    updateGame(input: $input) {
      game {
        id
        name
        initial_state
      }
      errors
    }
  }
`; 