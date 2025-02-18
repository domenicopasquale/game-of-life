import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: 'include',
  fetchOptions: {
    timeout: 15000 // aumentiamo il timeout a 15 secondi
  }
});

const debugLink = onError(({ graphQLErrors, networkError, operation }) => {
  console.log(`Operation: ${operation.operationName}`);
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Aggiungiamo più dettagli sull'errore di rete
    console.error('Network error details:', {
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack
    });
  }
});

// Aggiungiamo un link per il timing delle operazioni
const timingLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now();
  return forward(operation).map(result => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Operation ${operation.operationName} took ${duration}ms`);
    return result;
  });
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Aggiungiamo un retry link per gestire i fallimenti di rete
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error
  }
});

export const client = new ApolloClient({
  link: from([debugLink, timingLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          games: {
            merge(incoming) {
              return incoming;
            },
            read(existing) {
              return existing || [];
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Aggiungiamo un listener globale per gli errori non catturati
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
}); 