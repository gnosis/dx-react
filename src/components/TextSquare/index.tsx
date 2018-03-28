import React from 'react'

export const TextSquare: React.SFC = () => {
  return (
    <div className="intro">
      <h1>Decentralized Token Auction Exchange</h1>
      <p>
        The DutchX is a decentralized exchange for ERC20 tokens and ETH,
        determining a fair value for tokens based on the Dutch auction principle.
        <br /><br />
        No account needed. Direct trades between peers through smart contracts.
        (1) Choose the token you would like to sell,
        (2) pick the token you would like to receive for it,
        (3) specify the amount to sell and your order gets automatically submitted into the next running auction
        - no strategy needed!
        <br /><br />
        <a className="buttonCTA" href="#">How the DutchX works</a>
      </p>
    </div>
  )
}

export default TextSquare
