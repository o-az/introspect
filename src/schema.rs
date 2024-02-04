use axum::http::StatusCode;
use axum::{
    body::{Body, Bytes},
    extract::State,
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use reqwest::{
    header::{HeaderMap, HeaderName, HeaderValue},
    Client,
};
use serde_json::json;

pub async fn schema_handler(
    State(url): State<String>,
    State(format): State<String>,
    State(headers): State<HeaderMap>,
) -> impl IntoResponse {
    let introspection_options = json!({
        "descriptions": true,
        "directiveIsRepeatable": true,
        "schemaDescription": true
    });
    let introspection_query = json!({
        "query": "query IntrospectionQuery($introspectionOptions: IntrospectionOptions) { __schema { ...FullSchema } } fragment FullSchema on __Schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name } } } }",
        "variables": {
            "introspectionOptions": introspection_options
        }
    });
    let client = Client::new();
    let response = client
        .post(&url)
        .headers(headers)
        .json(&introspection_query)
        .send()
        .await
        .unwrap();
    let status = response.status();
    let body = response.bytes().await.unwrap();
    if !status.is_success() {
        return (status, body);
    }
    let body = body.to_vec();
    let body = String::from_utf8(body).unwrap();
    match format.as_str() {
        "sdl" => {
            let schema = json_schema_to_sdl(&body);
            (StatusCode::OK, schema)
        }
        "json" => (StatusCode::OK, body),
        _ => (StatusCode::OK, body),
    }
}

fn json_schema_to_sdl(json_schema: &str) -> String {
    let schema: serde_json::Value = serde_json::from_str(json_schema).unwrap();
    let schema = schema.get("data").unwrap().get("__schema").unwrap();
    let query_type = schema.get("queryType").unwrap().get("name").unwrap();
    let mutation_type = schema.get("mutationType").unwrap().get("name").unwrap();
    let subscription_type = schema.get("subscriptionType").unwrap().get("name").unwrap();
    let types = schema.get("types").unwrap();
    let directives = schema.get("directives").unwrap();
    let sdl = format!(
        "schema {{
  query: {}
  mutation: {}
  subscription: {}
}}
{}
{}
",
        query_type, mutation_type, subscription_type, types, directives
    );
    sdl
}
