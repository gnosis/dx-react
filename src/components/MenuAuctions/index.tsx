import React, { Fragment } from 'react'
import { OngoingAuctions } from 'types'
import { Link } from 'react-router-dom'
import { DefaultTokenObject } from 'api/types'

export interface MenuAuctionProps {
  name?: string;
  ongoingAuctions: OngoingAuctions;
  claimSellerFundsFromSeveral(
    sell: Partial<DefaultTokenObject>, buy: Partial<DefaultTokenObject>, indicesWithSellerBalance?: number,
  ): any;
}

/* const calculateAuctionLink = ({ sell, buy, indicesWithSellerBalance, indicesWithSellerBalanceInverse }: AuctionObject) => {
  if (!indicesWithSellerBalance.length && indicesWithSellerBalanceInverse.length) {
    return `/auction/${buy.symbol}-${sell.symbol}-${indicesWithSellerBalanceInverse[indicesWithSellerBalanceInverse.length - 1]}`
  }
  return `/auction/${sell.symbol}-${buy.symbol}-${indicesWithSellerBalance[indicesWithSellerBalance.length - 1]}`
} */

export const MenuAuctions: React.SFC<MenuAuctionProps> = ({
  name = 'YOUR AUCTIONS',
  ongoingAuctions,
  claimSellerFundsFromSeveral,
}) => (
    <div className="menuAuctions"><img src={require('assets/auction.svg')} />
      {name}
      <div>
        {ongoingAuctions.length ?
          <table>
            <thead>
              <tr>
                <th>Auction</th>
                <th>Committed</th>
                <th>Claim Tokens</th>
              </tr>
            </thead>
            <tbody>
              {ongoingAuctions.map(
                (auction, i) => {
                  if (auction.balancePerIndex.length && auction.balancePerIndexInverse.length) {
                    return (
                      <Fragment key={`${auction.sell.address}-${auction.buy.address}-${i}`}>
                        <tr>
                          <td>
                            <Link to={`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`}>
                              {`${auction.sell.symbol}/${auction.buy.symbol}`}
                            </ Link>
                          </td>
                          <td>
                            {auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}
                          </td>
                          {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                        </tr>
                        <tr>
                          <td>
                            <Link to={`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`}>
                              {`${auction.buy.symbol}/${auction.sell.symbol}`}
                            </ Link>
                          </td>
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
                      <tr key={`${auction.buy.address}-${auction.sell.address}-${i}`}>
                        <td>
                          <Link to={`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`}>
                            {`${auction.buy.symbol}/${auction.sell.symbol}`}
                          </ Link>
                        </td>
                        <td>
                          {auction.balancePerIndexInverse.last() && 
                            <p>
                              {`${auction.balancePerIndexInverse.last()} ${auction.sell.symbol}`}
                            </p>}
                        </td>
                        {auction.claimInverse && <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}><img src={require('assets/claim.svg')} /></td>}
                      </tr>
                    )
                  }
                  // IF NORMAL === TRUE but INVERSE === FALSE
                  return (
                    <tr key={`${auction.sell.address}-${auction.buy.address}-${i}`}>
                      <td>
                        <Link to={`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`}>
                          {`${auction.sell.symbol}/${auction.buy.symbol}`}
                        </ Link>
                      </td>
                      <td>
                        {auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}
                      </td>
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

export default MenuAuctions
