export const BASE_URL = process.env.BASE_URL ?? 'https://introspect.lagon.dev'

export const EXAMPLE_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

export const LANDING_MESSAGE = /* md */ `
If you want a JSON GraphQL schema, the format is: 
  ${BASE_URL}/json/<introspection-url>

If you want an SDL GraphQL schema, the format is: 
  ${BASE_URL}/sdl/<introspection-url>

If you want a GraphQL Playground, the format is:
  ${BASE_URL}/playground/<introspection-url>

If no format provided, default is JSON.

Example URL: ${BASE_URL}/sdl/${EXAMPLE_GRAPHQL_URL}

Source code: https://github.com/o-az/introspect
`

export function isURL(str: string) {
  return !!new URL(str)
}

export function formatMessages(...messages: string[]) {
  return messages.join('\n\n')
}
