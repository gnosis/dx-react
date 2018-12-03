import React from 'react'
import ButtonCTA from 'components/ButtonCTA'

interface TextSquareProps {
  claimOnly?: boolean,
}

export const TextSquare: React.SFC<TextSquareProps> = ({ claimOnly }) =>
  <div className="intro">
    <h1>
      <div className="homeTitle">Trading Platform</div>
      <span>Good trades take time</span>
    </h1>

    <div className="textSquareInnerContainer">
      This trading interface allows you to interact with
      the DutchX decentralized trading protocol for ERC20 tokens,
      determining a fair value for tokens based on the Dutch auction principle.
      <br/><br/>
      No account needed. Direct trades between peers through smart contracts.
      <br/><br/>
      {claimOnly &&
        <>
          <ol>
            <li>Choose the tokens you would like to trade</li>
            <li>Specify the amount to deposit</li>
            <li>Submit the order via your wallet provider</li>
          </ol>
          <br/>
          Your order is automatically deposited into the next running auction - no strategy needed!
          <br/><br/>

          <ButtonCTA to="/content/HowItWorks" className={null}><strong>Slow &amp; Fair -</strong>How it works</ButtonCTA>
        </>
      }
    </div>
  </div>

export default TextSquare
