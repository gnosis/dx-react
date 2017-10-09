import moment from 'moment'

export const setMomentRelativeTime = () => {
  moment.updateLocale('en', {
    relativeTime: {
      future: '%s',
      past: '%s ago',
      s: '< 59s',
      ss: '> %d s',
      m: '< 59m',
      mm: '> %d m',
      h: '< 1h',
      hh: '> %d h',
      d: '< 1d',
      dd: '< %d d',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    },
  })
  // Set new thresholds
  moment.relativeTimeThreshold('ss', 3)
  moment.relativeTimeThreshold('s', 59)
  moment.relativeTimeThreshold('m', 59)
  moment.relativeTimeThreshold('h', 20)
  moment.relativeTimeThreshold('d', 25)
  moment.relativeTimeThreshold('M', 10)
}
