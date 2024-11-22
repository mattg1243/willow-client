import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#e4f7eb' },
          100: { value: '#c0edcf' },
          200: { value: '#95e2ac' },
          300: { value: '#66d688' },
          400: { value: '#40cc6e' },
          500: { value: '#03b126' },
          600: { value: '#029f21' },
          700: { value: '#018d1d' },
          800: { value: '#017a18' },
          900: { value: '#005d12' },
        },
        secondary: {
          50: { value: '#f3f6ed' },
          100: { value: '#e1ead4' },
          200: { value: '#cbd9b2' },
          300: { value: '#b4c88d' },
          400: { value: '#9db96c' },
          500: { value: '#809c4d' },
          600: { value: '#6a833f' },
          700: { value: '#556932' },
          800: { value: '#3f5025' },
          900: { value: '#2b3718' },
        },
        tertiary: {
          50: { value: '#f5f1fb' },
          100: { value: '#e6dbf8' },
          200: { value: '#d4bef4' },
          300: { value: '#c29eec' },
          400: { value: '#a975df' },
          500: { value: '#8d4cc5' },
          600: { value: '#783fa8' },
          700: { value: '#62328b' },
          800: { value: '#4c256e' },
          900: { value: '#351a50' },
        },
        neutral: {
          50: { value: '#f5f5f5' },
          100: { value: '#e5e5e5' },
          200: { value: '#d4d4d4' },
          300: { value: '#a3a3a3' },
          400: { value: '#737373' },
          500: { value: '#525252' },
          600: { value: '#404040' },
          700: { value: '#262626' },
          800: { value: '#171717' },
          900: { value: '#0f0f0f' },
        },
        error: {
          50: { value: '#fee7e6' },
          100: { value: '#fdbcbc' },
          200: { value: '#fc8f8f' },
          300: { value: '#fb6060' },
          400: { value: '#fa3d3d' },
          500: { value: '#f31212' },
          600: { value: '#d10f0f' },
          700: { value: '#af0c0c' },
          800: { value: '#8c0909' },
          900: { value: '#690606' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
