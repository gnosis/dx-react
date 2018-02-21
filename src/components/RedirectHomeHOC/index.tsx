import React from 'react'
import { Redirect } from 'react-router'

import { Balance } from 'types'

interface RedirectHomeProps {
  sellAmount?: Balance
}

/**
 * A HOC that redirects to home if sellAmount prop is 0 or undefined
 * we assume that sellAmount should be set prior to reaching /wallet page
 * @param Component - React component to wrap around
 */
const RedirectHomeHOC = (Component: React.ClassType<any, any, any>) => (props: RedirectHomeProps) => {
  const { sellAmount } = props
  if (!sellAmount || sellAmount !== '0') return <Component {...props}/>

  console.log('No sellAmount specified, user likely went directly to /wallet page, redirecting to /')

  return <Redirect to="/"/>
}

export default RedirectHomeHOC
