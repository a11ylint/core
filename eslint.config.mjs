import { defineConfig } from '@pplancq/eslint-config';

export default defineConfig({
  enableVitest: true,
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
