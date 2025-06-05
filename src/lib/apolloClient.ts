'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({
    uri: 'https://intellihack5-backend-27mgf.ondigitalocean.app/disaster-management-codelabs-ba2/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        },
    });

    return forward(operation);
});


const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
