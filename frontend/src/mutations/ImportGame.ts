import { gql } from '@apollo/client';

export const IMPORT_GAME = gql`
  mutation ImportGame($name: String!, $file_content: String!) {
    importGame(input: {
      name: $name,
      fileContent: $file_content
    }) {
      game {
        id
        name
        width
        height
        initial_state
      }
      errors
    }
  }
`; 