import * as React from 'react'
import { OngoingAuctions } from 'types'

export interface MenuAuctionProps {
  name?: string,
  ongoingAuctions: OngoingAuctions
}

class MenuAuctions extends React.Component<MenuAuctionProps> {

  renderAuctions() {
    const { ongoingAuctions } = this.props

    return (
      <table>
        <thead>
          <tr>
            <th>Auction</th>
            <th>Comitted</th>
            <th>Claim Token</th>
          </tr>
        </thead>
        <tbody>
          {ongoingAuctions.map(auction =>
            <tr key={auction.id}>
              <td>{`${auction.sellToken}/${auction.buyToken}`}</td>
              <td>{`${auction.buyPrice} ${auction.sellToken}`}</td>
              {auction.claim && <td><img src={require('assets/claim.svg')} /></td>}
            </tr>,
          )}
        </tbody>
      </table>  
    )
  }

  renderNoAuctions() {
    return (
      <table>
        <thead>
          <tr> No Running Auctions </tr>
        </thead>
      </table>
    )
  }

  render() {
    const { name, ongoingAuctions } = this.props

    return (
      <div className="menuAuctions"><img src={require('assets/auction.svg')} />
        <strong>{name}</strong>
        <div>
          { ongoingAuctions ? this.renderAuctions() : this.renderNoAuctions() }
        </div>
      </div>
    )
  }
}

export default MenuAuctions
