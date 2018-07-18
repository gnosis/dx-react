import React from 'react'
import { Redirect } from 'react-router-dom'

import * as ContentPages from 'components/ContentPage'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

export interface ContentPageContainerProps {
  match: {
    params: {
      contentPage: string,
    },
  };
  children?: JSX.Element;
  push({}): () => any;
}

interface EventTarget {
  target: {
    parentElement: HTMLElement;
  }
  currentTarget: HTMLElement;
}

const grabElementID = (id: string) => document.getElementById(id)

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

  handleSectionMove = async (sectionID: string, outsidePage?: string) => {
    if (outsidePage) {
      await this.props.push(outsidePage)
    }

    if (!sectionID) return

    if (Array.from(grabElementID(sectionID).classList).some((className: string) => className === 'active')) {
      return grabElementID(sectionID).scrollIntoView()
    }

    grabElementID(sectionID).classList.toggle('active')
    return grabElementID(sectionID).scrollIntoView()
  }

  render() {
    const { match: { params: { contentPage } } } = this.props
    return (
      ContentPages[contentPage]
      ?
        <div
          className="contentPage"
          /* ref={c => this.outerDiv = c} */
          tabIndex={1}
        >
          {this.renderContentPage(contentPage, { handleClick: this.handleClick, handleSectionMove: this.handleSectionMove })}
        </div>
      :
        <Redirect to="/404" />
    )
  }
}

export default connect(undefined, { push })(ContentPageContainer)
