import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'

function defaultHtmlTemplate(str, {title = 'My Universal App', rootAppId = 'app'} = {}) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>${title}</title>
    </head>
    <body>
      <div id="${rootAppId}">${str}</div>
      <script src="/dist/browser_${$ES.ENV.toLowerCase()}.js"></script>
    </body>
  </html>
  `
}

export function render(props={}) {
  return renderToString(<RoutingContext {...props}/>)
}

export function renderToTemplate(props={}, { template = defaultHtmlTemplate, ...templateOptions }) {
  return template(renderToString(<RoutingContext {...props}/>), templateOptions)
}

export default function requestRouter({
  routes,
  messages: { not_found = 'Not found' } = {},
  template = defaultHtmlTemplate,
  ...templateOptions
}){
  return (request, handler) => {
    match({ routes, location: request.url }, (error, redirectLocation, props) => {
      if (error){
        handler({ status: 500, payload: (template(error.message, templateOptions)) })

      } else if (redirectLocation) {
        handler({ redirect: true, status: 302, payload: redirectLocation.pathname + redirectLocation.search })

      } else if (props) {
        handler({ status: 200, payload: renderToTemplate(props, { template, ...templateOptions }) })

      } else {
         handler({ status: 404, payload: template(messages.not_found, templateOptions) })
      }
    })
  }
}
