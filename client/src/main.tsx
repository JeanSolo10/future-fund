import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';

import { App } from './App.tsx';
import { ApolloProvider } from '@apollo/client/react';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';

const link = ApolloLink.from([
  new RemoveTypenameFromVariablesLink(),
  new HttpLink({
    uri: `${import.meta.env.VITE_SERVER_URL}`,
  }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
