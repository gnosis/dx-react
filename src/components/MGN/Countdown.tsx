import React from 'react'

interface CountdownProps {
  now: number;
  then: number;
}

const calcLeftDate = (then: number) => {
  const now = Date.now()
  const diff = Math.max(then - now, 0)
  if (diff === 0) return {}

  const date = new Date(diff)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds()

  return { hh, mm, ss }
}

const getDateString = ({ hh = 0, mm = 0, ss = 0 }) => {
  let str = ''
  // tslint:disable: prefer-template
  if (hh) str += hh + ' hours '
  if (str) str += String(mm).padStart(2, '0') + ' minutes '
  else if (mm) str += mm + ' minutes '
  if (str) str += String(ss).padStart(2, '0') + ' seconds'
  else if (ss) str += ss + ' seconds'

  return str
}

type CountdownState = {
  leftDate: ReturnType<typeof calcLeftDate>
  now: number,
}

class Countdown extends React.Component<CountdownProps, CountdownState> {
  interval: number = null
  state: CountdownState = {
    now: this.props.now,
    leftDate: calcLeftDate(this.props.then * 1000),
  }
  componentDidMount() {
    this.startInterval()
  }

  componentDidUpdate(prevProps: CountdownProps) {
    if (prevProps.now !== this.props.now) {
      window.clearInterval(this.interval)
      this.startInterval()
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  startInterval = () => {
    this.interval = window.setInterval(() => {
      this.setState({
        leftDate: calcLeftDate(this.props.then * 1000),
      })
    }, 1000)
  }

  render() {
    const { now, then } = this.props
    const leftBlockchain = Math.max(then - now, 0)
    if (leftBlockchain === 0) return <span />

    return <span>available in {getDateString(this.state.leftDate)}</span>
  }
}

export default Countdown
