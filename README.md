# GraphQL Introspection & Schema Retrieval (JSON & SDL)

## API to fetch entire schema of any (public) GraphQL API and return it as JSON or SDL

#### Try it

This will fetch the full JSON schema of Uniswap's GraphQL API and return it as JSON

[`https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`](https://introspect.lagon.dev/json/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3)

### 🔗 <https://introspect.lagon.dev>

## Usage

```sh
curl --location --silent --request 'GET' \
  'https://introspect.lagon.dev/<format>/<introspection-url>'
```

* `<format>` can be `json` or `sdl`
* `<introspection-url>` is the URL of the GraphQL API you want to fetch the schema of

### Try in Browser

```sh
https://introspect.lagon.dev/<introspection-url>
# or
https://introspect.lagon.dev/json/<introspection-url>
# or
https://introspect.lagon.dev/sdl/<introspection-url>
```

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
* **SpaceX** (unoffical): <https://api.spacex.land/graphql/>
* **GraphQL Pokemon**: <https://graphqlpokemon.favware.tech/v7>
* A bunch more here <https://github.com/graphql-kit/graphql-apis>
