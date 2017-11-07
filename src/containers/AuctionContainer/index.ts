import { connect } from 'react-redux'

import { AuctionContainer, AuctionContainerProps } from 'components/AuctionContainer'

export default connect<AuctionContainerProps>(undefined)(AuctionContainer)
