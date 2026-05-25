module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '@_constants': '<rootDir>/src/constants/index.ts',
        '@_utils/(.*)': '<rootDir>/src/utils/$1',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    setupFiles: ['<rootDir>/__tests__/setup.ts'],
};