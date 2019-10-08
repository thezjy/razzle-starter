import { ApolloProvider } from '@apollo/react-hooks'
import { getDataFromTree } from '@apollo/react-ssr'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import express from 'express'
import fetch from 'node-fetch'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { default as BrowserApp } from './App'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        fetch,
        uri: 'https://48p1r2roz4.sse.codesandbox.io',
      }),
      cache: new InMemoryCache(),
    })

    const context = {}
    const App = (
      <ApolloProvider client={client}>
        <StaticRouter context={context} location={req.url}>
          <BrowserApp />
        </StaticRouter>
      </ApolloProvider>
    )

    const content = await getDataFromTree(App)
    const state = client.extract()

    res.status(200)
    res.send(`<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
          <div id="root">${content}</div>
          <script>
          window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};
          </script>
    </body>
</html>`)
    res.end()
  })

export default server
