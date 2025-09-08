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
                    useInfinite: false,
                },
                mutator: {
                    path: './src/lib/api-client.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});
