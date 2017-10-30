import * as React from 'react'

interface MenuAuctionProps {
  name?: string,
  ongoingAuctions: [auctionObject]
}

interface auctionObject {
  id: number,
  sellToken: string,
  buyToken: string,
  buyPrice: number,
  claim: boolean
}

export const MenuAuction: React.SFC<MenuAuctionProps | any> = ({
  name = 'YOUR AUCTIONS',
  ongoingAuctions,
}) => (
  <div className="menuAuctions"><img src={require('assets/auction.svg')} />
    <strong>{ name }</strong>
    <div>
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
            (auction: auctionObject) => 
              <tr key={ auction.id }>
                <td>{ `${ auction.sellToken }/${ auction.buyToken }` }</td>
                <td>{ `${auction.buyPrice} ${auction.sellToken}` }</td>
                { auction.claim && <td><img src={ require('assets/claim.svg') } /></td> }
              </tr>,
          )}
        </tbody>  
      </table>
    </div>
  </div>
)

export default MenuAuction
