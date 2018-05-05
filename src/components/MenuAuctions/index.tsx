import * as React from 'react'
import { OngoingAuctions } from 'types'
import { Link } from 'react-router-dom'
import { DefaultTokenObject } from 'api/types'

export interface MenuAuctionProps {
  name?: string;
  ongoingAuctions: OngoingAuctions;
  claimSellerFundsFromSeveral(sell: Partial<DefaultTokenObject>, buy: Partial<DefaultTokenObject>, indices?: number): any;
}

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
                (auction, i) =>
                  <tr key={`${auction.sell.address}-${auction.buy.address}-${i}`}>
                    <td>
                      <Link to={`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indices[auction.indices.length - 1]}`}>
                        {`${auction.sell.symbol}/${auction.buy.symbol}`}
                      </ Link>
                    </td>
                    {/* <td>{`${auction.indices[auction.indices.length - 1]}`}</td> */}
                    <td>
                      <p>{`${auction.balancePerIndex[auction.balancePerIndex.length - 1] || 'N/A'} ${auction.sell.symbol}`}</p>
                      <p>{`${auction.balancePerIndexInverse[auction.balancePerIndexInverse.length - 1] || 0} ${auction.buy.symbol}`}</p>
                    </td>
                    {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                  </tr>,
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
