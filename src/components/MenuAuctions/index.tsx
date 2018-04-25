import * as React from 'react'
import { OngoingAuctions } from 'types'

export interface MenuAuctionProps {
  name?: string,
  ongoingAuctions: OngoingAuctions
}

export const MenuAuctions: React.SFC<MenuAuctionProps> = ({
  name = 'YOUR AUCTIONS',
  ongoingAuctions,
}) => (
    <div className="menuAuctions"><img src={require('assets/auction.svg')} />
      {name}
      <div>
        {ongoingAuctions.length ?
          <table>
            <thead>
              <tr>
                <th>Auction</th>
                <th>Index</th>
                <th>Committed</th>
                <th>Claim Tokens</th>
              </tr>
            </thead>
            <tbody>
              {ongoingAuctions.map(
                (auction, i) =>
                  <tr key={`${auction.sell.symbol}-${auction.buy.symbol}-${i}`}>
                    <td>{`${auction.sell.symbol}/${auction.buy.symbol}`}</td>
                    <td>{`${auction.indices[auction.indices.length - 1]}`}</td>
                    <td>
                      <p>{`${auction.balancePerIndex[auction.balancePerIndex.length - 1] || 'N/A'} ${auction.sell.symbol}`}</p>
                      <p>{auction.balancePerIndexInverse.length > 0 && `${auction.balancePerIndexInverse[auction.balancePerIndexInverse.length - 1]} ${auction.buy.symbol}`}</p>
                    </td>
                    {auction.claim && <td><img src={require('assets/claim.svg')} /></td>}
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
