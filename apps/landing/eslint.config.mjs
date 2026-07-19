import nextConfig from 'eslint-config-next'
import js from '@eslint/js'

export default [js.configs.recommended, ...nextConfig]
