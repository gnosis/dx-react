import { connect } from 'react-redux'
import TokenPicker from 'components/TokenPicker'
import { continueToOrder } from 'actions'


export default connect(null, { continueToOrder })(TokenPicker)
