import { fetchJsonSchema, jsonSchemaToSDL } from '#/graphql/schema.ts'
import { isURL, formatMessages, LANDING_MESSAGE } from '#/utilities.ts'

/**
 * Route Options
 *
 * Route: <base-url>/<introspection-url> -> JSON schema
 * Route: <base-url>/json/<introspection-url> -> JSON schema
 * Route: <base-url>/sdl/<introspection-url> -> SDL schema
 * Route: <base-url>/playground/<introspection-url> -> GraphQL Playground
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

    if (['playground', 'graphiql'].includes(requestedFormat)) {
      const { htmlPage } = await import('#/graphql/graphiql.html.ts')
      return new Response(htmlPage({ endpoint: introspectionURL }), {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    const jsonSchema = await fetchJsonSchema({ url: introspectionURL })

    if (requestedFormat === 'sdl') {
      const sdlSchema = jsonSchemaToSDL(JSON.stringify(jsonSchema))

      return new Response(sdlSchema, {
        status: sdlSchema.startsWith('Encountered an error') ? 400 : 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    return new Response(JSON.stringify(jsonSchema), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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
