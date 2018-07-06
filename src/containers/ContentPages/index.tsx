import React from 'react'
import { Redirect } from 'react-router-dom'

import * as ContentPages from 'components/ContentPage'

export interface ContentPageContainerProps {
  match: {
    params: {
      contentPage: string,
    },
  },
  children?: JSX.Element
}

interface EventTarget {
  target: {
    parentElement: HTMLElement;
  }
  currentTarget: HTMLElement;
}

class ContentPageContainer extends React.Component<ContentPageContainerProps> {
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
    const { match: { params: { contentPage } } } = this.props
    return (
      ContentPages[contentPage]
      ?
        <div 
          className="contentPage" 
          /* ref={c => this.outerDiv = c} */
          tabIndex={1} 
        > 
          {this.renderContentPage(contentPage, { handleClick: this.handleClick })}
        </div>
      :
        <Redirect to="/404" />
    )
  }
}

export default ContentPageContainer
