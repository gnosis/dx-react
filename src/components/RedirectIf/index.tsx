import React from 'react'
import { Redirect, withRouter, RedirectProps, RouteComponentProps } from 'react-router'

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

// export const RedirectToDisclaimer = RedirectIfFactory({
//   to: {pathname: '/disclaimer', state},
//   condition: ({ disclaimer_accepted }) => disclaimer_accepted,
// })()


export interface RedirectToDosclaimerProps extends RouteComponentProps<any> {
  disclaimer_accepted: boolean,
}
const ToDosclaimer: React.SFC<RedirectToDosclaimerProps> = ({ disclaimer_accepted, location }) =>
  disclaimer_accepted ? null :
  <Redirect to={{ pathname: '/disclaimer', state: { from: location } }}/>

export const RedirectToDisclaimer = withRouter(ToDosclaimer)

export default RedirectIfFactory
