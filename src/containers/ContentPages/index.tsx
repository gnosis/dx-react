import React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

import * as ContentPages from 'components/ContentPage'

import { bindActionCreators } from 'redux'

import { pushAndMoveToElement } from 'actions'

export interface ContentPageContainerProps {
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

class ContentPageContainer extends React.Component<ContentPageContainerProps & any> {
  outerDiv: HTMLElement

  /* componentDidMount() {
    this.outerDiv && this.outerDiv.focus()
  } */

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
  pushAndMoveToElement: bindActionCreators(pushAndMoveToElement, dispatch),
})

export default connect(undefined, mapDispatch)(ContentPageContainer)
