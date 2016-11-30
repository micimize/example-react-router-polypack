import React from 'react'
import { match, Router } from 'react-router'
import { render as renderReact } from 'react-dom'
import { createHistory } from 'history'

const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`


export function render({ routes, rootAppId = 'app'}){
    renderReact(
      <Router routes={routes} history={createHistory()} />,
      document.getElementById(rootAppId)
    )
}

// calling `match` is simply for side effects of
// loading route/component code for the initial location
export default function renderRouter({routes, rootAppId = 'app'}){
  match({ routes, location }, _ => { render({routes, rootAppId}) })
}
