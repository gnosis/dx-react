import { PropTypes } from 'react'

export const marketShape = PropTypes.shape({
  event: PropTypes.object,
  eventDescription: PropTypes.object,
  oracle: PropTypes.object,
  netOutcomeTokensSold: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.string,
})
