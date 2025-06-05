'use client';

import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from '@apollo/client';
import {getToken} from "@/utils/auth";

// GraphQL endpoint
const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://intellihack5-backend-27mgf.ondigitalocean.app/disaster-management-codelabs-ba2/graphql',
});

// Auth middleware
const authLink = new ApolloLink((operation, forward) => {
    const token = getToken();

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    }));

    return forward(operation);
});

// Apollo Client
const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
