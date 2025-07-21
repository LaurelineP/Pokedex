import { defineConfig } from 'vitest/config';

process.loadEnvFile();

export default defineConfig({
  test: {
    // Automatically load .env files
    env: process.env
  },
});