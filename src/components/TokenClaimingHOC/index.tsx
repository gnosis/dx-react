import React from 'react'

export interface TokenClaimingProps {
  completed: boolean,
  buyAmount: number,
  claimSellerFunds: () => any,
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
      const {
        completed,
        buyAmount,
        claimSellerFunds,
      } = this.props
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
        await claimSellerFunds()
        // if succeeds change isClaiming state
        this.setState({
          isClaiming: false,
        })
        this.setProgressTo4()  
      } catch (error) {
        // if fails change isClaiming state and add error
        console.warn('Error claiming tokens', error)
        this.setState({
          isClaiming: false,
          error: error.message,
        })
      }

    }

    setProgressTo4() {
      const progressBar: HTMLDivElement = document.querySelector('.progress-bar')
      if (progressBar && progressBar.dataset.progress === '3') progressBar.dataset.progress = '4'
    }

    render() {
      return <Component {...this.props} {...this.state} claimTokens={this.claimTokens}/>
    }
  }
}
