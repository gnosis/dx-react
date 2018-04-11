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
                  <tr key={`${auction.sell.name}-${auction.buy.name}-${i}`}>
                    <td>{`${auction.sell.name}/${auction.buy.name}`}</td>
                    <td>{`${auction.indices[auction.indices.length - 1]}`}</td>
                    <td>{`${auction.balancePerIndex[auction.balancePerIndex.length - 1] || 'N/A'} ${auction.sell.name}`}</td>
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
