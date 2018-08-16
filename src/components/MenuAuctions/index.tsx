import React, { Fragment } from 'react'
import { OngoingAuctions } from 'types'
import { DefaultTokenObject } from 'api/types'
import { Action } from 'redux'
import { AuctionStatus } from 'globals'
import { getTimingApproximations } from 'utils/timings'

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
                          <td>
                            claim {getTimingApproximations({
                              auctionStart: auction.auctionStart,
                              now: auction.now,
                              status: auction.current.statusDir.status,
                            }).claim}
                          </td>
                        </tr>
                      )}
                      {auction.next && auction.next.participatesNormal && (
                        <tr onClick={() => push(`/auction/${auction.sell.symbol}-${auction.buy.symbol}-${auction.next.index}`)}>
                          <td className="sectionLink">{auction.sell.symbol}/{auction.buy.symbol}</td>
                          <td>NOT STARTED</td>
                          <td>
                            <p>{auction.next.balanceNormal.toString()} {auction.sell.symbol}</p>
                          </td>
                          <td>
                            claim {getTimingApproximations({
                              auctionStart: auction.auctionStart,
                              now: auction.now,
                              status: auction.next.status.status,
                            }).claim}
                          </td>
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
                            <td onClick={() => claimSellerFundsFromSeveral(auction.sell, auction.buy)}>
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
                          <td>
                            claim {getTimingApproximations({
                              auctionStart: auction.auctionStart,
                              now: auction.now,
                              status: auction.current.statusOpp.status,
                            }).claim}
                          </td>
                        </tr>
                      )}
                      {auction.next && auction.next.participatesInverse && (
                        <tr onClick={() => push(`/auction/${auction.buy.symbol}-${auction.sell.symbol}-${auction.next.index}`)}>
                          <td className="sectionLink">{auction.buy.symbol}/{auction.sell.symbol}</td>
                          <td>NOT STARTED</td>
                          <td>
                            <p>{auction.next.balanceInverse.toString()} {auction.buy.symbol}</p>
                          </td>
                          <td>
                            claim {getTimingApproximations({
                              auctionStart: auction.auctionStart,
                              now: auction.now,
                              status: auction.next.status.status,
                            }).claim}
                          </td>
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
                            <td onClick={() => claimSellerFundsFromSeveral(auction.buy, auction.sell)}>
                              {auction.past.claimableBalanceInverse} {auction.sell.symbol} <img src={require('assets/claim.svg')} />
                            </td>
                          }
                        </tr>
                      )}
                    </ Fragment>
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
