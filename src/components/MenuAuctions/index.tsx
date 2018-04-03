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
                <th>Claim Token</th>
              </tr>
            </thead>
            <tbody>
              {ongoingAuctions.map(
                auction =>
                  <tr key={`${auction.sell}-${auction.buy}-${auction.index}`}>
                    <td>{`${auction.sell}/${auction.buy}`}</td>
                    <td>{`${auction.index}`}</td>
                    <td>{`${auction.price} ${auction.sell}`}</td>
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
