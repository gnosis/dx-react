import React from 'react'
import PropTypes from 'prop-types'

import { values } from 'lodash'

import { OUTCOME_TYPES } from 'utils/constants'

import SectionDescription from 'components/SectionDescription'
import SectionEventOptions from 'components/SectionEventOptions'
import SectionOutcomeSelection from 'components/SectionOutcomeSelection'

import SectionOutcomeCategorical from 'components/SectionOutcomeCategorical'
import SectionOutcomeScalar from 'components/SectionOutcomeScalar'

const OracleCentralized = ({ selectedOutcomeType, ...props }) => {
  const renderOutcomeType = () => {
    const outcomeSections = {
      [OUTCOME_TYPES.CATEGORICAL]: <SectionOutcomeCategorical {...props} />,
      [OUTCOME_TYPES.SCALAR]: <SectionOutcomeScalar {...props} />,
    }

    return outcomeSections[selectedOutcomeType]
  }


  return (
    <div className="oracleCentralized">
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionDescription
            canEditTitle
            canEditDescription
            canEditResolutionDate
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionEventOptions />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionOutcomeSelection />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          {renderOutcomeType()}
        </div>
      </div>
    </div>
  )
}

OracleCentralized.propTypes = {
  selectedOutcomeType: PropTypes.oneOf(values(OUTCOME_TYPES)),
}

export default OracleCentralized
