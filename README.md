# Introspect

### ⚡ Serverless Function deployed to serve you entire schema as JSON or SDL of any (public) GraphQL API

#### Deployed on [Lagon](https://lagon.app/) - [Open Source JS Runtime](https://github.com/lagonapp/lagon)

### Try it

This will fetch the full JSON schema of Uniswap's GraphQL API and return it as JSON

[`https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`](https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3)

#### 🔗 <https://introspect.lagon.dev>

## Usage

```sh
curl --location --silent --request 'GET' \
  'https://introspect.lagon.dev/<format>/<introspection-url>'
```

* `<format>` can be `json` or `sdl`
* `<introspection-url>` is the URL of the GraphQL API you want to fetch the schema of

### Try in Browser

[`https://introspect.lagon.dev/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/https://spacex-production.up.railway.app)

or

[`https://introspect.lagon.dev/json/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/json/https://spacex-production.up.railway.app)

or get the SDL

[`https://introspect.lagon.dev/sdl/https://spacex-production.up.railway.app`](https://introspect.lagon.dev/sdl/https://spacex-production.up.railway.app)

By default the API will return the schema as JSON

### Examples

Fetch `JSON` schema of Uniswap's GraphQL API:

```sh
curl --location --silent --request 'GET' \
  'https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
```

Fetch `SDL` schema of Uniswap's GraphQL API:

```sh
curl --location --silent --request 'GET' \
  'https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
```

### Popular public GraphQL APIs

* **Uniswap v3**: <https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3>
* **GitLab**: <https://gitlab.com/api/graphql> (*quite large, so small chance function timesout*)
* **SpaceX** (unoffical): <https://spacex-production.up.railway.app>
* **GraphQL Pokemon**: <https://graphqlpokemon.favware.tech/v7>
* A bunch more here <https://github.com/graphql-kit/graphql-apis>

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
