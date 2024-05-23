import {ApolloClient, HttpLink, InMemoryCache,} from '@apollo/client/core';

const HASURA_URL = 'https://roi-stats.hasura.app/v1/graphql';

const httpLink = new HttpLink({
  uri: HASURA_URL,
  headers: {
    'x-hasura-admin-secret': `q3yvCRsf17unG1axhcS3sbkg02TnPmAmOUW2ettTZALPXF05GQktm3wr99mXz3rU`,
  },
});

const apollo = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({addTypename: false}),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
    }
  })

export default apollo;