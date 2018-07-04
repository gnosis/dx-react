import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'

import * as ContentPages from 'components/ContentPage'
import { handleKeyDown } from 'utils/helpers'

export interface ContentPageContainerProps {
  match: {
    params: {
      contentPage: string,
    },
    url?: string,
  },
  push: (url: string) => any,
  children?: JSX.Element
}

class ContentPageContainer extends React.Component<ContentPageContainerProps> {
  outerDiv: HTMLElement
  
  componentDidMount() {
    this.outerDiv && this.outerDiv.focus()
  }

  renderContentPage = (name: string) => {
    const Component = ContentPages[name]
    return <Component />
  }

  render() {
    const { match: { params: { contentPage } }, push: goTo } = this.props
    return (
      ContentPages[contentPage]
      ?
        <div 
          className="contentPage" 
          ref={c => this.outerDiv = c}
          tabIndex={1} 
          onKeyDown={(e) => handleKeyDown(e, () => goTo('/'), 'Escape')}
        > 
          {this.renderContentPage(contentPage)}
        </div>
      :
        <Redirect to="/404" />
    )
  }
}

export default connect(undefined, { push })(ContentPageContainer as any)
