import { createSelector } from 'reselect'
import { State } from 'types'

export const auctionClaimable = createSelector(
  (state: State) => state.auctions.ongoingAuctions,
  auctions => auctions && auctions.some((auc: any) => auc.claim || auc.claimInverse),
)
