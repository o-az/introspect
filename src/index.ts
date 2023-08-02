import { fetchJsonSchema, jsonSchemaToSDL } from '#/converter'
import { isURL, errorMessage, ERROR_MESSAGE } from '#/utilities'

/**
 * Route Options
 *
 * Route: <base-url>/<introspection-url> -> JSON schema
 * Route: <base-url>/json/<introspection-url> -> JSON schema
 * Route: <base-url>/sdl/<introspection-url> -> SDL schema
 */
export async function handler(request: Request): Promise<Response> {
  try {

    const url = new URL(request.url)
    const [, ...pathParameters] = url.pathname.split('/')
    const requestedFormat = pathParameters.at(0) === 'sdl' ? 'sdl' : 'json' // default to json
    const introspectionURL = pathParameters.join('/').replace(`${requestedFormat}/`, '')

    if (!introspectionURL || !isURL(introspectionURL)) {
      return new Response(
        errorMessage(
          'Missing introspection URL path parameter.',
          'The introspection URL should be the URL of a GraphQL endpoint.',
          ERROR_MESSAGE
        ),
        { status: 400, headers: { 'Content-Type': 'text/plain' } }
      )
    }

    const jsonSchema = await fetchJsonSchema(introspectionURL)

    if (requestedFormat === 'json') {
      return new Response(JSON.stringify(jsonSchema), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const sdlSchema = jsonSchemaToSDL(JSON.stringify(jsonSchema))

    return new Response(sdlSchema, {
      status: sdlSchema.startsWith('Encountered an error') ? 400 : 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : `Encountered an error: ${error}`
    console.error(message)

    return new Response(
      errorMessage(message, 'The introspection URL should be the URL of a GraphQL endpoint.', ERROR_MESSAGE),
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    )
  }
}

