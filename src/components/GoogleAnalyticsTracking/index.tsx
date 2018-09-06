import ReactGA from 'react-ga'
import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'

interface TrackerProps extends RouteComponentProps<string> {}

export default withRouter(
  class GoogleAnalyticsTracking extends Component<TrackerProps> {
    trackPage = (page: string) => {
      ReactGA.set({
        page,
      })
      ReactGA.pageview(page)
    }
    componentDidMount() {
      const page = this.props.history.location.pathname + this.props.history.location.hash
      this.trackPage(page)
    }

    componentWillReceiveProps(nextProps: any) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) this.trackPage(nextPage)
    }

    render(): null { return null }
  })
