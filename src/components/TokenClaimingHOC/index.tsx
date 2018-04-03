import React from 'react'
import { claimSellerFunds } from 'api'
import { TokenCode } from 'types'

export interface TokenClaimingProps {
  completed: boolean,
  sellToken: TokenCode,
  buyToken: TokenCode,
  index: number,
  buyAmount: number,
  account: string,
}

export interface TokenClaimingState {
  isClaiming: boolean,
  error?: string,
}

export default (Component: React.ClassType<any, any, any>): React.ClassType<TokenClaimingProps, any, any> => {
  return class TokenClaiming extends React.Component<TokenClaimingProps, TokenClaimingState> {
    constructor(props: TokenClaimingProps) {
      super(props)
      this.claimTokens = this.claimTokens.bind(this)
    }
    state = { isClaiming: false }

    async claimTokens() {
      const { completed, buyAmount, account, sellToken: sell, buyToken: buy, index } = this.props
      // don't claim anything if auction isn't completed or nothing to claim
      if (!completed || buyAmount <= 0) return

      // indicate that claiming is in progress
      // can be used to disallow multiple simultaneous claimRequests or just for indication
      this.setState({
        isClaiming: true,
        // clear whatever error might be left from previous requests
        error: null,
      })

      try {
        // start claimFunds request
        console.log(`claiming tokens for ${account} for ${sell}->${buy}-${index}`)
        await claimSellerFunds({ sell, buy }, index, account)
        // if succeeds change isClaiming state
        this.setState({
          isClaiming: false,
        })      
      } catch (error) {
        // if fails change isClaiming state and add error
        console.warn('Error claiming tokens', error)
        this.setState({
          isClaiming: false,
          error: error.message,
        })
      }

    }

    render() {
      return <Component {...this.props} {...this.state} claimTokens={this.claimTokens}/>
    }
  }
}
