import React from 'react'
import { Redirect, RedirectProps, RouteComponentProps } from 'react-router'

import { Balance } from 'types'

interface RedirectHomeProps {
  sellAmount?: Balance
}

interface RedirectFactoryProps {
  to: RedirectProps['to'],
  condition: (props: any) => boolean
}

/**
 * A HOC that redirects to given path if condition(props) is true
 * @param Component - React component to wrap around
 */
const RedirectIfFactory = ({ to, condition }: RedirectFactoryProps) =>
  (Component: React.ClassType<any, any, any> = (): null => null) => (props: RedirectHomeProps) =>
    condition(props) ? <Component {...props}/> : <Redirect to={to} />

// we assume that sellAmount should be set prior to reaching /wallet page
export const RedirectHomeHOC = RedirectIfFactory({
  to: '/',
  condition: ({ sellAmount }) => !sellAmount || sellAmount !== '0',
})

export const RedirectHomeIfNoAccountHOC = RedirectIfFactory({
  to: '/',
  condition: ({ currentAccount }) => currentAccount !== undefined,
})

export interface RedirectToDisclaimerProps extends RouteComponentProps<any> {
  disclaimer_accepted: boolean,
}
export const RedirectToDisclaimer: React.SFC<RedirectToDisclaimerProps> = ({ disclaimer_accepted, location }) =>
  (disclaimer_accepted || location.pathname === '/disclaimer' || location.pathname === '/cookies' || location.pathname === '/privacy' || location.pathname === '/content/HowItWorks') ? null :
  <Redirect to={{ pathname: '/disclaimer', state: { from: location } }}/>

export default RedirectIfFactory
