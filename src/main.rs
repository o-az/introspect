use axum::{
    extract::Path,
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::{get, MethodRouter},
    Router,
};

use tracing_subscriber::layer::SubscriberExt;

use log::{info, warn};

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    tracing_subscriber::registry().with(
        tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "introspect_app=debug".into()),
    );
    env_logger::init();

    let app = Router::new()
        .route("/", get(index_handler))
        .route("/:format/:url", get(introspect_handler));
    let app = app.fallback(handler_404);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3443")
        .await
        .unwrap();
    println!("Listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}

async fn index_handler() -> Html<&'static str> {
    Html(
        "
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
        "
    )
}

// https://introspect.lagon.dev/sdl/https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
// /:format/:url
async fn introspect_handler(Path((format, url)): Path<(String, String)>) -> String {
    info!("format: {}", format);
    info!("url: {}", url);

    let parts = url.split("/").collect::<Vec<&str>>();

    format!("your parts are: {:?}", parts)
}
