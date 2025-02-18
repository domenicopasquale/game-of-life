import { gql } from '@apollo/client';

export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $initial_state: [[Boolean!]!]!) {
    updateGame(input: {
      id: $id
      initial_state: $initial_state
    }) {
      game {
        id
        name
        initial_state
      }
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($name: String!, $width: Int!, $height: Int!, $speed: Int!) {
    createGame(input: {
      name: $name
      width: $width
      height: $height
      speed: $speed
    }) {
      id
      name
      width
      height
      speed
    }
  }
`;

export const IMPORT_GAME = gql`
  mutation ImportGame($name: String!, $fileContent: String!) {
    importGame(input: {
      name: $name,
      fileContent: $fileContent
    }) {
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

export const UPDATE_GAME_SPEED = gql`
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

export const SAVE_GAME_STATE = gql`
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

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(input: { id: $id }) {
      success
    }
  }
`;

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