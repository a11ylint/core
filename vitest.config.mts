/* eslint-disable import/no-extraneous-dependencies */
import { loadEnv } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [viteTsconfigPaths()],
    test: {
      environment: 'jsdom',
      setupFiles: 'vitest.setup.ts',
      clearMocks: true,
      css: false,
      include: ['tests/**/*.{test,spec}.[jt]s?(x)'],
      reporters: ['default', 'junit', 'vitest-sonar-reporter'],
      outputFile: {
        'vitest-sonar-reporter': 'sonar-report.xml',
        junit: 'junit-report.xml',
      },
      poolOptions: {
        forks: {
          minForks: env.CI === 'true' ? 1 : undefined,
          maxForks: env.CI === 'true' ? 2 : undefined,
        },
      },
      coverage: {
        enabled: env.CI === 'true',
        reporter: [
          'text',
          'text-summary',
          ['html', { subdir: 'html-coverage' }],
          ['lcovonly', { file: 'lcov-coverage.info' }],
          ['cobertura', { file: 'cobertura-coverage.xml' }],
        ],
        provider: 'v8',
        watermarks: {
          statements: [50, 80],
          branches: [50, 80],
          functions: [50, 75],
          lines: [50, 80],
        },
        include: ['src/**/*.[jt]s?(x)'],
        exclude: ['src/**/*.d.[jt]s?(x)', 'src/**/*.types.[jt]s?(x)', 'src/**/index.[jt]s?(x)'],
      },
    },
  };
});
