module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  moduleNameMapper: {
    '^ngx-avatars$': '<rootDir>/projects/ngx-avatars/src/public-api.ts'
  },
  testMatch: ['**/?(*.)+(spec).ts'],
  detectOpenHandles: true
};
