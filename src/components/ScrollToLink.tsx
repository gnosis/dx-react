import React from 'react'

import { Link, LinkProps } from 'react-router-dom'

interface ScrollToLinkProps extends LinkProps {
  hash: string,
}

export default class ScrollToLink extends React.Component<ScrollToLinkProps> {

  handleScrollToHash = (e: any) => {
    e.preventDefault()

    const { children, hash, to } = this.props
    if (hash) {
        const elem = document.querySelector(hash)
        if (elem) elem.scrollIntoView()
      }
    return (<Link to={to}>{children}</Link>)
  }

  render() {
    const { children, hash, to } = this.props
    if (hash) return <Link onClick={this.handleScrollToHash} to={to}>{children}</Link>

    return <Link to={to} {...this.props}>{children}</Link>
  }
}
