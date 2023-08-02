import type { Json } from '#/types'
import { buildClientSchema, printSchema } from 'graphql'

export function jsonSchemaToSDL(jsonString: string) {
  const json = JSON.parse(jsonString)
  const schema = buildClientSchema(json.data)
  return printSchema(schema)
}

export async function fetchJsonSchema(url: string): Promise<Json> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query:
          'query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } }',
        variable: {}
      })
    })

    if (!response.ok) throw new Error(`Failed to fetch from ${url}: ${response.statusText}`)

    return await response.json()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `Encoutered an error: ${error}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }
}
