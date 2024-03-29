mod graphiql;
mod index;

use axum::{http::StatusCode, response::IntoResponse, routing::get, Router};
use log::{info, warn};
use tracing_subscriber::layer::SubscriberExt;

use graphiql::graphiql_handler;
use index::index_handler;

pub type CapturedParams = (String, String);

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    tracing_subscriber::registry().with(
        tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "introspect_app=debug".into()),
    );
    env_logger::init();
    let app = Router::new()
        .route("/", get(index_handler))
        .route("/graphiql/*endpoint", get(graphiql_handler));
    let app = app.fallback(handler_404);

    // port has to be $PORT for railway app to work
    let port = std::env::var("PORT").unwrap_or_else(|_| "3443".to_string());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    println!("Listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}
