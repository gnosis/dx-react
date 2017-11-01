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
      <strong>{name}</strong>
      <div>
        {ongoingAuctions.length ? 
          <table>
            <thead>
              <tr>
                <th>Auction</th>
                <th>Comitted</th>
                <th>Claim Token</th>
              </tr>
            </thead>
            <tbody>
              {ongoingAuctions.map(
                auction =>
                  <tr key={auction.id}>
                    <td>{`${auction.sellToken}/${auction.buyToken}`}</td>
                    <td>{`${auction.buyPrice} ${auction.sellToken}`}</td>
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
