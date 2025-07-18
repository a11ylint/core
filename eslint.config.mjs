import { defineConfig } from '@pplancq/eslint-config';

export default defineConfig({
  enableVitest: true,
  unitTestFiles: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  enablePrettier: 'on',
  extendConfig: [
    {
      files: ['**/*.ts', '**/*.js'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
});
