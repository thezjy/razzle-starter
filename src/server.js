import { ApolloProvider } from '@apollo/react-hooks'
import express from 'express'
import fetch from 'node-fetch'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { default as BrowserApp } from './App'
import { getDataFromTree } from '@apollo/react-ssr'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
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

    getDataFromTree(App).then(() => {
      const content = renderToString(App)
      console.info('content', content)
      const initialState = client.extract()
      console.info('initialState', initialState)

      const markup = <Html content={content} state={initialState} />

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
          <div id="root">${markup}</div>
    </body>
</html>`)
      res.end()
    })
  })

function Html({ content, state }) {
  return (
    <html>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }}
        />
      </body>
    </html>
  )
}

export default server
