# Introspect

### ⚡ Serverless Function deployed to serve you entire schema as `JSON` or [`SDL`](https://sdk.vercel.ai/s/2x7agG8) of any `GraphQL` API

#### Deployed on [Lagon](https://lagon.app/) - [Open Source JS Runtime](https://github.com/lagonapp/lagon)

### Try it

Get the full `GraphQL` schema of Uniswap's API, formatted as `SDL`:

[`https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`](https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3)

As `JSON`:

[`https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`](https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3)

#### 🔗 <https://introspect.lagon.dev>

## When might I use this?

- To generate `TypeScript` types from a `GraphQL` API using [`graphql-codegen`](https://the-guild.dev/graphql/codegen)
- To use a third party `GraphQL` API that doesn't have a playground or `schema.json` available
- To see the full schema of a `GraphQL` API

⚠️ _**Note** that if the provider disables introspection, this won't work. Usually introspection is enabled for public APIs. See example at the end of this doc._

## Usage

```sh
curl --location --silent --request 'GET' \
  'https://introspect.lagon.dev/<format>/<introspection-url>'
```

- `<format>` can be `json` or `sdl`
- `<introspection-url>` is the URL of the `GraphQL` API you want to fetch the schema of

### Try in Browser - SpaceX API

[`https://introspect.lagon.dev/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/https://spacex-production.up.railway.app)

or

[`https://introspect.lagon.dev/json/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/json/https://spacex-production.up.railway.app)

or get the `SDL`

[`https://introspect.lagon.dev/sdl/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/sdl/https://spacex-production.up.railway.app)

By default API will return schema as `JSON`

### Examples

Fetch Uniswap `GraphQL` API schema as `JSON`:

```sh
curl --location --silent \
  'https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
```

Fetch Uniswap `GraphQL` API schema as `SDL` and save to `schema.graphql` file:

```sh
curl --output schema.graphql 'https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
```

### Popular public `GraphQL` APIs

- **Uniswap v3**: <https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3>
- **GitLab**: <https://gitlab.com/api/graphql> (*quite large, so small chance function timesout*)
- **SpaceX** (unoffical): <https://spacex-production.up.railway.app>
- **GraphQL Pokemon**: <https://graphqlpokemon.favware.tech/v7>
- A bunch more here <https://github.com/graphql-kit/graphql-apis>

_____

❕if you want to run this yourself and you don't have access to **[Lagon Alpha](https://lagon.app/)**, install **<https://bun.sh>** and add the following a the bottom of **`./src/index.ts`**:

```ts
const port = 3000
Bun.serve({
  port,
  fetch: request => handler(request)
})

console.log(`Server ready at http://localhost:${port}`)
```
