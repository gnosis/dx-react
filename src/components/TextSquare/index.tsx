import React from 'react'
import ButtonCTA from 'components/ButtonCTA'

export const TextSquare: React.SFC = () => {
  return (
    <div className="intro">
      <h1>Decentralized Token Auction Exchange</h1>
      <div className="textSquareInnerContainer">
        The DutchX is a decentralized exchange for ERC20 tokens and ETH,
        determining a fair value for tokens based on the Dutch auction principle.

        <br />
        <br />

        No account needed. Direct trades between peers through smart contracts.

        <br />
        <br />
        <ol>
          <li>Choose the tokens you would like to exchange</li>
          <li>Specify the amount to sell</li>
          <li>Submit the order via your wallet provider’s screens</li>
        </ol>

        <br />

        Your order is automatically deposited into the next running auction - no strategy needed!

        <br />
        <br />
        { /*TODO: change this below - defaultProp is hurting this*/ }
        <ButtonCTA className="void" to="#">How the DutchX works</ButtonCTA>
      </div>
    </div>
  )
}

export default TextSquare
