import React from 'react'

import * as ContentPages from 'components/ContentPage'
import { Redirect } from 'react-router-dom'

export interface ContentPageContainerProps {
  match: {
      params: {
        contentPage: string,
      },
      url?: string,
    },
  children?: JSX.Element
}

const renderContentPage = (name: string) => {
  const Component = ContentPages[name]
  return <Component />
}

const ContentPageContainer = ({ match: { params: { contentPage } } }: ContentPageContainerProps) =>
    ContentPages[contentPage]
    ?
    <div className="contentPage"> {renderContentPage(contentPage)}</div>
    :
    <Redirect to="/404" />


export default ContentPageContainer
