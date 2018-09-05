import React, { Component } from 'react'
import ReactGA from 'react-ga'

interface WithTrackerHOCProps extends Window {}

export default function withTracker(WrappedComponent: React.SFC | React.ComponentClass, options = {}) {
  const trackPage = (page: string) => {
    ReactGA.set({
      page,
      ...options,
    })
    ReactGA.pageview(page)
  }

  return class extends Component<WithTrackerHOCProps> {
    componentDidMount() {
      const page = this.props.location.pathname + this.props.location.hash
      trackPage(page)
    }

    componentWillReceiveProps(nextProps: any) {
      const currentPage = this.props.location.pathname + this.props.location.hash
      const nextPage = nextProps.location.pathname + nextProps.location.hash

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
