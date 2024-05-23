import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  ApolloClientOptions,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { createClient } from 'graphql-ws';

const uri = 'https://roi-stats.hasura.app/v1/graphql';
const wsUri = 'wss://roi-stats.hasura.app/v1/graphql';

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUri,
    connectionParams: () => {
      return {
        headers: {
          'x-hasura-admin-secret': `q3yvCRsf17unG1axhcS3sbkg02TnPmAmOUW2ettTZALPXF05GQktm3wr99mXz3rU`,
        },
      };
    },
  })
);

const httpLink = new HttpLink({
  uri,
  headers: {
    'x-hasura-admin-secret': `q3yvCRsf17unG1axhcS3sbkg02TnPmAmOUW2ettTZALPXF05GQktm3wr99mXz3rU`,
  },
});

export function createApollo(): ApolloClientOptions<any> {
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const link = {
    link: splitLink,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  };

  return link;
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
    },
  ],
})
export class GraphQLModule {}

// httpLink.create({
//   uri,
//   headers: new HttpHeaders().append(
//     'x-hasura-admin-secret',
//     `q3yvCRsf17unG1axhcS3sbkg02TnPmAmOUW2ettTZALPXF05GQktm3wr99mXz3rU`
//   ),
// })
