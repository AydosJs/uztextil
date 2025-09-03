import { defineConfig } from 'orval';

export default defineConfig({
    uztextil: {
        input: {
            target: 'https://texttile.dclinics.uz/swagger/?format=openapi',
        },
        output: {
            mode: 'tags-split',
            target: './src/lib/api',
            schemas: './src/lib/api/model',
            client: 'react-query',
            override: {
                query: {
                    useQuery: true,
                    useInfinite: true,
                    useInfiniteQueryParam: 'pageParam',
                },
                mutator: {
                    path: './src/lib/api-client.ts',
                    name: 'customInstance',
                },
            },
        },
    },
    uztextilRedocs: {
        input: {
            target: 'https://texttile.dclinics.uz/swagger.json',
        },
        output: {
            mode: 'tags-split',
            target: './src/lib/api-redocs',
            schemas: './src/lib/api-redocs/model',
            client: 'react-query',
            override: {
                query: {
                    useQuery: true,
                    useInfinite: true,
                    useInfiniteQueryParam: 'pageParam',
                },
                mutator: {
                    path: './src/lib/api-client.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});
