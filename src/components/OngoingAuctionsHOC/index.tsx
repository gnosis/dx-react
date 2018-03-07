import React, { Component }  from 'react'

import { 
    // getLatestAuctionIndex,
    // getClosingPrice,
    getSellerBalance, getUnclaimedSellerFunds, getLatestAuctionIndex,
} from 'api'

import {
    TokenCode,
    TokenPair,
} from 'types'

// import BigNumber from 'bignumber.js'

export interface AppProps {
  sell: TokenCode,
  buy: TokenCode,
  index: string
}

export interface AppState {
  ongoingAuctions: any[],
}

// interface KnownPairs {
//     sell: TokenCode,
//     buy: TokenCode
// }

/** OngoingAuctionsHOC
 * @param WrappedComponent => Component to WRAP and return 
 * @returns EnhancedComponent => React.Class enhanced by HOC
 */
export default (WrappedComponent: React.ClassType<any, any, any>): React.ClassType<any,any,any> => {
  return class extends Component<AppProps, AppState> {
        
    state: AppState = {
        ongoingAuctions: [],
      }

    async componentDidMount() {
        await this.updateState()
        // TODO: create mounting function to call
        setInterval(async() => {
            console.log('refrehing...')
            await this.updateState()
        }, 20000)
      }

    async updateState() {
        /* TODO: insert logic here
            * Possible state:
            * 
            * Auction has closed
            * if [closingPrice.den !== 0] THEN [auction has closed] => [closingPrice.num, closingPrice.den] 
            * 
            * Auction does not exist
            * if (auctionIndex > getAuctionIndex(sellToken, buyToken)) => [0, 0] 
            * 
            * Auction is ONGOING
            * calculate currentPrice
            * 
            * PROBLEM: there are a lot of tokens to pair up and test via a looping function for aucIdx > 0
        */

        /** fetcher
         * @param url {string} => api endpoint URL
         * @returns [ Array ] => [ { tokenA: string, tokenB: string }, ... ]
         */
        // const fetcher = (url: string): Promise<[KnownPairs]> => fetch(url).then(r => r.json())
        // const knownPairs = await fetcher('https://apiEndpoint/tokenPairs')

        // TODO: fix Error: No known address for OMG token
        // Move knownPairs out of this into endpoint (using fetcher)
        const knownPairs: any[] = [
            { sell: 'ETH', buy: 'GNO' },
            { sell: 'ETH', buy: 'TUL' },
            { sell: 'ETH', buy: 'OWL' },
        ]
        // Map through knownPairs [{ tA: string, tB: string }, ... ]
        // Check what needs to be checked
        // grab sellerBalances first
        const sellerBalance = await Promise.all(knownPairs.map(p => getSellerBalance(p)))
        // filter sb's for greaterThanZero
        const tokenPairsWithSellerBalances = knownPairs.filter((_, i) => sellerBalance[i].greaterThan(0))

        // tokenPairWithSellBalances = {sell, buy} WITH sellerBalances
        const latestTokenPairInfo = await Promise.all(tokenPairsWithSellerBalances.map(async (p: TokenPair) => {
            const sellerBalance = await getSellerBalance(p)
            const claimableAmt = await getUnclaimedSellerFunds(p)
            const index = await getLatestAuctionIndex(p)

            return ({
                ...p,
                price: sellerBalance,
                claim: claimableAmt.greaterThan(0) ? true : false,
                index,
            })
        }))
        
        if (!latestTokenPairInfo) return
            
        this.setState({
            ongoingAuctions: [...latestTokenPairInfo],
        })

        return true
    }

    render() {
        return (
            <div>
                <pre style={{ position: 'fixed', left: 0, zIndex: 2, opacity: 0.9 }}>
                    State:
                    <br/>
                    {this.state ? JSON.stringify(this.state, null, 2) : null}
                    <br/>
                    Props:
                    <br/>
                    {this.props ? JSON.stringify(this.props, null, 2) : null}
                </pre>
                <WrappedComponent {...this.props} {...this.state} />
            </div>
          )
      }
  }
}    
