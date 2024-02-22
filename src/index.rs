use axum::response::Html;

pub async fn index_handler() -> Html<&'static str> {
    Html(
"<pre>
Missing a valid introspection URL path parameter.
The introspection URL should be the URL of a GraphQL endpoint.
If you want a JSON GraphQL schema, the format is: 
    https://introspect.lagon.dev/json/<introspection-url>

If you want an SDL GraphQL schema, the format is: 
    https://introspect.lagon.dev/sdl/<introspection-url>

If you want a GraphQL Playground, the format is:
    https://introspect.lagon.dev/playground/<introspection-url>

If no format provided, default is JSON.
Example URL: https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
Source code: https://github.com/o-az/introspect
</pre>"
    )
}
