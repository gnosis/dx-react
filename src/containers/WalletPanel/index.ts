import { connect } from 'react-redux'
import WalletPanel, { WalletPanelProps } from 'components/WalletPanel'
import { getTokenAllowance, openModal } from 'actions'

export default connect<WalletPanelProps>(undefined, { getTokenAllowance, openModal })(WalletPanel)
