import {
  printSchema,
  buildClientSchema,
  getIntrospectionQuery,
  type IntrospectionOptions,
} from 'graphql'
import type { Json } from '#/types.ts'

export function jsonSchemaToSDL(jsonString: string) {
  const json = JSON.parse(jsonString)
  const schema = buildClientSchema(json.data)
  return printSchema(schema)
}

export async function fetchJsonSchema({
  url,
  minimal = true,
}: {
  url: string
  minimal?: boolean
}): Promise<Json> {
  const introspectionOptions = {
    descriptions: !minimal,
    directiveIsRepeatable: !minimal,
    schemaDescription: !minimal,
  } satisfies IntrospectionOptions
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query: getIntrospectionQuery(introspectionOptions),
        variable: {},
      }),
    })

    if (!response.ok) throw new Error(`Failed to fetch from ${url}: ${response.statusText}`)

    return await response.json()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `Encoutered an error: ${error}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }
}

// TODO
function removeGraphQLComments(schema: string) {
  // Single-line comments start with a '#' symbol.
  const singleLineCommentRegex = /^#.*/gm
  // Multi-line comments are enclosed in triple double quotes.
  const multiLineCommentRegex = /"""\s*([^""]|("[^"]")|(""[^"]))*"""/g
  // Remove the comments
  return (
    schema
      .replaceAll(singleLineCommentRegex, '')
      .replaceAll(multiLineCommentRegex, '')
      // Remove empty lines
      .replaceAll(/^\s*$(?:\r\n?|\n)/gm, '')
  )
}
