import React, { Fragment } from 'react'
import { OngoingAuctions } from 'types'
import { DefaultTokenObject } from 'api/types'
import { RouterAction } from 'connected-react-router'

export interface MenuAuctionProps {
  claimable: any;
  name?: string;
  ongoingAuctions: OngoingAuctions;
  claimSellerFundsFromSeveral(
    sell: Partial<DefaultTokenObject>, buy: Partial<DefaultTokenObject>, indicesWithSellerBalance?: number,
  ): any;
  push({}): RouterAction;
}

export class MenuAuctions extends React.Component <MenuAuctionProps> {
  state = {
    open: false,
  }

  handleClick = () => {
    const windowSize = window.innerWidth
    if (windowSize > 736) return

    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    const {
      claimable,
      name = 'Your Auctions',
      ongoingAuctions,
      claimSellerFundsFromSeveral,
      push,
    } = this.props

    return (
      <div
        className="menuAuctions"
        tabIndex={1}
        onClick={this.handleClick}
        onBlur={() => this.setState({ open: false })}
      >
        <img src={require('assets/auction.svg')} />
        <strong className={claimable ? 'claimable' : null}>{name}</strong>
        {claimable &&
        <span>
          <span>CLAIM</span>
          <img src={require('assets/claim.svg')}/>
        </span>}
        <div className={this.state.open ? 'mobileOpen' : ''}>
          {ongoingAuctions.length ?
            <table>
              <thead>
                <tr>
                  <th>Auction</th>
                  <th>Deposited</th>
                  <th>Claim Tokens</th>
                </tr>
              </thead>
              <tbody>
                {ongoingAuctions.map(
                  (auction, i) => {
                    if (auction.balancePerIndex.length && auction.balancePerIndexInverse.length) {
                      return (
                        <Fragment
                          key={`${auction.sell.address}-${auction.buy.address}-${i}`}
                        >
                          <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`)}>
                            <td className="sectionLink">{`${auction.sell.symbol}/${auction.buy.symbol}`}</td>
                            <td>
                              {auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}
                            </td>
                            {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                          </tr>
                          <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`)}>
                            <td className="sectionLink">{`${auction.buy.symbol}/${auction.sell.symbol}`}</td>
                            <td>
                              {auction.balancePerIndexInverse.last() &&
                                <p>
                                  {`${auction.balancePerIndexInverse.last()} ${auction.buy.symbol}`}
                                </p>}
                            </td>
                            {auction.claimInverse && <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}><img src={require('assets/claim.svg')} /></td>}
                          </tr>
                        </ Fragment>
                      )
                    }
                    // IF NORMAL === FALSE but INVERSE === TRUE
                    if (!auction.balancePerIndex.length && auction.balancePerIndexInverse.length) {
                      return (
                        <tr
                          key={`${auction.buy.address}-${auction.sell.address}-${i}`}
                          onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`)}
                        >
                          <td className="sectionLink">{`${auction.buy.symbol}/${auction.sell.symbol}`}</td>
                          <td>
                            {auction.balancePerIndexInverse.last() &&
                              <p>
                                {`${auction.balancePerIndexInverse.last()} ${auction.buy.symbol}`}
                              </p>}
                          </td>
                          {auction.claimInverse && <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}><img src={require('assets/claim.svg')} /></td>}
                        </tr>
                      )
                    }
                    // IF NORMAL === TRUE but INVERSE === FALSE
                    return (
                      <tr
                        key={`${auction.sell.address}-${auction.buy.address}-${i}`}
                        onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`)}
                      >
                        <td className="sectionLink">{`${auction.sell.symbol}/${auction.buy.symbol}`}</td>
                        <td>{auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}</td>
                        {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                      </tr>
                    )
                  },
                )}
              </tbody>
            </table>
            : <table>
                <tbody>
                  <tr>
                    <td>NO AUCTIONS TO SHOW</td>
                  </tr>
                </tbody>
              </table>
          }
        </div>
      </div>
    )
  }
}

export default MenuAuctions
