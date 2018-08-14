import React, { Fragment } from 'react'
import { OngoingAuctions } from 'types'
import { DefaultTokenObject } from 'api/types'
import { Action } from 'redux'
import { AuctionStatus } from 'globals'

export interface MenuAuctionProps {
  claimable: any;
  name?: string;
  ongoingAuctions: OngoingAuctions;
  claimSellerFundsFromSeveral(
    sell: Partial<DefaultTokenObject>, buy: Partial<DefaultTokenObject>, indicesWithSellerBalance?: number,
  ): any;
  push({}): Action;
}

export const MenuAuctions: React.SFC<MenuAuctionProps> = ({
  claimable,
  name = 'Your Auctions',
  ongoingAuctions,
  claimSellerFundsFromSeveral,
  push,
}) => (
    <div className="menuAuctions"><img src={require('assets/auction.svg')} />
      <strong className={claimable ? 'claimable' : null}>{name}</strong>
      {claimable &&
      <span>
        <span>CLAIM</span>
        <img src={require('assets/claim.svg')}/>
      </span>}
      <div>
        {ongoingAuctions.length ?
          <table>
            <thead>
              <tr>
                <th>Auction</th>
                <th>Status</th>
                <th>Deposited</th>
                <th>Claim Tokens</th>
              </tr>
            </thead>
            <tbody>
              {ongoingAuctions.map(
                (auction, i) => {
                  return (
                    <Fragment
                      key={`${auction.sell.address}-${auction.buy.address}-${i}`}
                    >
                      {auction.current && auction.current.dirRunning && auction.current.participatesNormal && (
                        <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.current.index}`)}>
                          <td className="sectionLink">{auction.sell.symbol}/{auction.buy.symbol}</td>
                          <td>{auction.current.statusDir.status === AuctionStatus.INIT ? 'NOT STARTED' : 'ONGOING'}</td>
                          <td>
                            <p>{auction.current.balanceNormal.toString()} {auction.sell.symbol}</p>
                          </td>
                          <td>claim in approx XXX</td>
                        </tr>
                      )}
                      {auction.next && auction.next.participatesNormal && (
                        <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.next.index}`)}>
                          <td className="sectionLink">{auction.sell.symbol}/{auction.buy.symbol}</td>
                          <td>NOT STARTED</td>
                          <td>
                            <p>{auction.next.balanceNormal.toString()} {auction.sell.symbol}</p>
                          </td>
                          <td>claim in approx XXX</td>
                        </tr>
                      )}
                      {auction.past && auction.past.participatedNormal && (
                        <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.past.indicesNormal.last()}`)}>
                          <td className="sectionLink">{auction.sell.symbol}/{auction.buy.symbol}</td>
                          <td>ENDED</td>
                          <td>
                            <p>{auction.past.balanceNormal.toString()} {auction.sell.symbol}</p>
                          </td>
                          {auction.past.claimableNormal &&
                            <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}>
                              {auction.past.claimableBalanceNormal} {auction.buy.symbol} <img src={require('assets/claim.svg')} />
                            </td>
                          }
                        </tr>
                      )}
                      {auction.current && auction.current.oppRunning && auction.current.participatesInverse && (
                        <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.current.index}`)}>
                          <td className="sectionLink">{auction.buy.symbol}/{auction.sell.symbol}</td>
                          <td>{auction.current.statusOpp.status === AuctionStatus.INIT ? 'NOT STARTED' : 'ONGOING'}</td>
                          <td>
                            <p>{auction.current.balanceInverse.toString()} {auction.buy.symbol}</p>
                          </td>
                          <td>claim in approx XXX</td>
                        </tr>
                      )}
                      {auction.next && auction.next.participatesInverse && (
                        <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.next.index}`)}>
                          <td className="sectionLink">{auction.buy.symbol}/{auction.sell.symbol}</td>
                          <td>NOT STARTED</td>
                          <td>
                            <p>{auction.next.balanceInverse.toString()} {auction.buy.symbol}</p>
                          </td>
                          <td>claim in approx XXX</td>
                        </tr>
                      )}
                      {auction.past && auction.past.participatedInverse && (
                        <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.past.indicesInverse.last()}`)}>
                          <td className="sectionLink">{auction.buy.symbol}/{auction.sell.symbol}</td>
                          <td>ENDED</td>
                          <td>
                            <p>{auction.past.balanceInverse.toString()} {auction.buy.symbol}</p>
                          </td>
                          {auction.past.claimableInverse &&
                            <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}>
                              {auction.past.claimableBalanceInverse} {auction.sell.symbol} <img src={require('assets/claim.svg')} />
                            </td>
                          }
                        </tr>
                      )}
                    </ Fragment>
                  )

                  // if (auction.balancePerIndex.length && auction.balancePerIndexInverse.length) {
                  //   return (
                  //     <Fragment
                  //       key={`${auction.sell.address}-${auction.buy.address}-${i}`}
                  //     >
                  //       <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`)}>
                  //         <td className="sectionLink">{`${auction.sell.symbol}/${auction.buy.symbol}`}</td>
                  //         <td>
                  //           {auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}
                  //         </td>
                  //         {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                  //       </tr>
                  //       <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`)}>
                  //         <td className="sectionLink">{`${auction.buy.symbol}/${auction.sell.symbol}`}</td>
                  //         <td>
                  //           {auction.balancePerIndexInverse.last() &&
                  //             <p>
                  //               {`${auction.balancePerIndexInverse.last()} ${auction.buy.symbol}`}
                  //             </p>}
                  //         </td>
                  //         {auction.claimInverse && <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}><img src={require('assets/claim.svg')} /></td>}
                  //       </tr>
                  //     </ Fragment>
                  //   )
                  // }
                  // // IF NORMAL === FALSE but INVERSE === TRUE
                  // if (!auction.balancePerIndex.length && auction.balancePerIndexInverse.length) {
                  //   return (
                  //     <tr
                  //       key={`${auction.buy.address}-${auction.sell.address}-${i}`}
                  //       onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.indicesWithSellerBalanceInverse.last()}`)}
                  //     >
                  //       <td className="sectionLink">{`${auction.buy.symbol}/${auction.sell.symbol}`}</td>
                  //       <td>
                  //         {auction.balancePerIndexInverse.last() &&
                  //           <p>
                  //             {`${auction.balancePerIndexInverse.last()} ${auction.buy.symbol}`}
                  //           </p>}
                  //       </td>
                  //       {auction.claimInverse && <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}><img src={require('assets/claim.svg')} /></td>}
                  //     </tr>
                  //   )
                  // }
                  // // IF NORMAL === TRUE but INVERSE === FALSE
                  // return (
                  //   <tr
                  //     key={`${auction.sell.address}-${auction.buy.address}-${i}`}
                  //     onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.indicesWithSellerBalance.last()}`)}
                  //   >
                  //     <td className="sectionLink">{`${auction.sell.symbol}/${auction.buy.symbol}`}</td>
                  //     <td>{auction.balancePerIndex.last() && <p>{`${auction.balancePerIndex.last()} ${auction.sell.symbol}`}</p>}</td>
                  //     {auction.claim && <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}><img src={require('assets/claim.svg')} /></td>}
                  //   </tr>
                  // )
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
