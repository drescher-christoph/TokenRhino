// src/graphql/client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/119639/token-rhino-v-1/version/latest',
  cache: new InMemoryCache(),
});

export default client;