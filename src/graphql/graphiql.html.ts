// https://github.com/graphql/graphiql/blob/main/examples/graphiql-cdn/index.html
export function htmlPage({
  endpoint,
  headers
}: {
  endpoint: string
  headers?: HeadersInit
}) {
  const [item] = Object.values(headers)
  headers = item === null ? {} : headers
  return /* html */ `
<!--
 *  Copyright (c) 2021 GraphQL Contributors
 *  All rights reserved.
-->
<!doctype html>
<html lang="en">
  <head>
    <title>GraphiQL</title>
    <style>
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      *::-webkit-scrollbar {
        height: 0.3rem;
        width: 0rem;
      }
      *::-webkit-scrollbar-track {
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
      }
      *::-webkit-scrollbar-thumb {
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
      }
      @supports (scrollbar-gutter: stable) {
        html {
          overflow-y: auto;
          scrollbar-gutter: stable;
        }
      }
      #graphiql {
        height: 100vh;
      }
    </style>
    <script crossorigin src="https://unpkg.com/react/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/graphiql/graphiql.min.js" type="application/javascript"></script>
    <link
      rel="shortcut icon"
      href="https://raw.githubusercontent.com/graphql/graphql-playground/main/packages/graphql-playground-electron/static/icons/icon.ico"
    />
    <link
      rel="favicon"
      href="https://raw.githubusercontent.com/graphql/graphql-playground/main/packages/graphql-playground-electron/static/icons/icon.ico"
    />
    <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
    <script src="https://unpkg.com/@graphiql/plugin-explorer/dist/index.umd.js" crossorigin></script>
    <link rel="stylesheet" href="https://unpkg.com/@graphiql/plugin-explorer/dist/style.css" />
  </head>
  <body>
    <main id="graphiql">Loading...</main>
    <script>
      const root = ReactDOM.createRoot(document.querySelector('main#graphiql'))
      const fetcher = GraphiQL.createFetcher({
        url: '${endpoint}',
        headers: ${JSON.stringify(headers)}
      })
      const explorerPlugin = GraphiQLPluginExplorer.explorerPlugin()
      root.render(
        React.createElement(GraphiQL, {
          fetcher,
          defaultEditorToolsVisibility: true,
          plugins: [explorerPlugin],
        })
      )
    </script>
  </body>
</html>`
}
