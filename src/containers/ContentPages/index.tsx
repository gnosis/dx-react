import React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect, RouteProps } from 'react-router-dom'

import * as ContentPages from 'components/ContentPage'

import { bindActionCreators } from 'redux'

import { pushAndMoveToElement } from 'actions'

export interface ContentPageContainerProps extends RouteProps {
  match: {
    params: {
      contentPage: string,
    },
  };
  children?: JSX.Element;
  pushAndMoveToElement(id: string, url?: string): () => any;
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
    if (e.target.parentElement !== e.currentTarget) return
    e.currentTarget.classList.toggle('active')
  }

  render() {
    const { match: { params: { contentPage } }, pushAndMoveToElement } = this.props
    return (
      ContentPages[contentPage]
      ?
        <div
          className="contentPage"
          /* ref={c => this.outerDiv = c} */
          tabIndex={1}
        >
          {this.renderContentPage(contentPage, { handleClick: this.handleClick, handleSectionMove: pushAndMoveToElement })}
        </div>
      :
        <Redirect to="/404" />
    )
  }
}

const mapDispatch = (dispatch: Dispatch<any>) => ({
  // why use bindActionCreators?
  pushAndMoveToElement: bindActionCreators(pushAndMoveToElement, dispatch),
})

export default connect(undefined, mapDispatch)(ContentPageContainer)
