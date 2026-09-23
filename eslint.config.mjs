import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
    ...nextVitals,
    {
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
            '@next/next/no-html-link-for-pages': 'warn',
        },
    },
    globalIgnores(['.next/**', '.vinext/**', '.wrangler/**', 'dist/**', 'out/**']),
]);
