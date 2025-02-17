import { gql } from '@apollo/client';

export const IMPORT_GAME = gql`
  mutation ImportGame($name: String!, $fileContent: String!) {
    importGame(input: { name: $name, fileContent: $fileContent }) {
      game {
        id
        name
        width
        height
        speed
        initial_state
      }
      errors
    }
  }
`; 