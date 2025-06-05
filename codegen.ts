import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'https://intellihack5-backend-27mgf.ondigitalocean.app/disaster-management-codelabs-ba2/graphql',
    documents: ['src/lib/graphql/**/*.graphql', 'src/pages/**/*.tsx'],
    generates: {
        'src/lib/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
        },
    },
};

export default config;
