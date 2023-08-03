interface EnvironmentVariables {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly PORT: string
  readonly BASE_URL: string
}

declare namespace NodeJS {
  type ProcessEnv = EnvironmentVariables
}
