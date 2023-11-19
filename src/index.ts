import { fetchJsonSchema, jsonSchemaToSDL } from '#/graphql/schema.ts'
import { isURL, formatMessages, LANDING_MESSAGE } from '#/utilities.ts'

/**
 * Route Options
 *
 * Route: <base-url>/<introspection-url> -> JSON schema
 * Route: <base-url>/json/<introspection-url> -> JSON schema
 * Route: <base-url>/sdl/<introspection-url> -> SDL schema
 * Route: <base-url>/playground/<introspection-url> -> GraphQL Playground
 *
 * Headers
 *
 * If you need to pass an API key in headers, pass as:
 * { "X-API-KEY-NAME": "<api-key-name>", "X-API-KEY-VALUE": "<api-key-value>" }
 * Example
 * { "X-API-KEY": "Authorization", "X-API-VALUE": "Bearer 1234567890" }
 */
export async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const [, ...pathParameters] = url.pathname.split('/')
    const requestedFormat = pathParameters.at(0).startsWith('http') ? 'json' : pathParameters.at(0) // default to json
    const introspectionURL = pathParameters.join('/').replace(`${requestedFormat}/`, '')

    if (!introspectionURL || !isURL(introspectionURL)) {
      return new Response(
        formatMessages(
          'Missing a valid introspection URL path parameter.',
          'The introspection URL should be the URL of a GraphQL endpoint.',
          LANDING_MESSAGE
        ),
        { status: 400, headers: { 'Content-Type': 'text/plain' } }
      )
    }

    const apiKeyName = request.headers.get('X-API-KEY-NAME')
    const apiKeyValue = request.headers.get('X-API-KEY-VALUE')

    if (['playground', 'graphiql'].includes(requestedFormat)) {
      const { htmlPage } = await import('#/graphql/graphiql.html.ts')
      return new Response(
        htmlPage({
          endpoint: introspectionURL,
          headers: { [apiKeyName]: apiKeyValue }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    const jsonSchema = await fetchJsonSchema({
      url: introspectionURL,
      headers: { [apiKeyName]: apiKeyValue }
    })

    if (requestedFormat === 'sdl') {
      const sdlSchema = jsonSchemaToSDL(JSON.stringify(jsonSchema))

      return new Response(sdlSchema, {
        status: sdlSchema.startsWith('Encountered an error') ? 400 : 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    return new Response(JSON.stringify(jsonSchema), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : `Encountered an error: ${error}`
    console.error(message)

    return new Response(
      formatMessages(
        message,
        'The introspection URL should be the URL of a GraphQL endpoint.',
        LANDING_MESSAGE
      ),
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    )
  }
}
