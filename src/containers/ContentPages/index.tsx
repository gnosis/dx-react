import React from 'react'
import { Redirect, RouteProps } from 'react-router-dom'

import * as ContentPages from 'components/ContentPage'
import { State } from 'types'
import { connect } from 'react-redux'

export interface ContentPageContainerProps extends RouteProps {
  match?: {
    params?: {
      contentPage?: string,
    },
  };
  network?: string;
}

interface EventTarget {
  target: {
    parentElement: HTMLElement;
  }
  currentTarget: HTMLElement;
}

export const grabElementID = (id: string) => document.getElementById(id)

class ContentPageContainer extends React.Component<ContentPageContainerProps> {
  outerDiv: HTMLElement

  componentDidMount() {
    // scroll to element if needed on initial visit
    this.scrollToHash()
  }

  componentDidUpdate(prevProps: ContentPageContainerProps) {
    const { hash, pathname } = this.props.location
    const { hash: prevHash, pathname: prevPathname } = prevProps.location

    if (hash === prevHash && pathname === prevPathname) return
    // on path change, check if need to scroll to an element
    this.scrollToHash()
  }

  scrollToHash(hash = this.props.location.hash) {
    if (hash) {
      const elem = document.querySelector(hash)
      if (elem) {
        const { classList } = elem
        // only apply .active to .drawer
        if (classList.contains('drawer')) classList.add('active')
        elem.scrollIntoView()
      }
    }
  }

  renderContentPage = (name: string, props?: any) => {
    const Component = ContentPages[name]
    return <Component {...props}/>
  }

  handleClick = (e: EventTarget) => {
    if (e.target === e.currentTarget || e.target === e.currentTarget.firstChild) {
      e.currentTarget.classList.toggle('active')
    }
  }

  render() {
    const { match: { params: { contentPage } }, network } = this.props
    return (
      ContentPages[contentPage]
      ?
        <div
          className="contentPage"
          /* ref={c => this.outerDiv = c} */
          tabIndex={1}
        >
          {this.renderContentPage(contentPage, { handleClick: this.handleClick, network })}
        </div>
      :
        <Redirect to="/404" />
    )
  }
}

const mapStateToProps = ({ blockchain: { network } }: State) => ({
  network,
})

export default connect<ContentPageContainerProps>(mapStateToProps)(ContentPageContainer)
