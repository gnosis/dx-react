import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import moment from 'moment'

import { RESOLUTION_TIME } from 'utils/constants'

class Countdown extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.updateDuration, 1000)
    this.updateDuration()
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  @autobind
  updateDuration() {
    const { til = moment(), target, format = RESOLUTION_TIME.RELATIVE_LONG_FORMAT } = this.props

    const duration = moment.duration(moment.utc(target).diff(til))
    this.setState({ output: duration.format(format) })
  }

  render() {
    return (
      <span>{this.state.output}</span>
    )
  }
}

Countdown.propTypes = {
  til: PropTypes.instanceOf(moment),
  target: PropTypes.string,
  format: PropTypes.string,
}

export default Countdown
