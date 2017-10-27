import React from 'react'

interface TextSquareProps {}

export const TextSquare: React.SFC<TextSquareProps> = () => {
  return (
    <div className="intro">
      <h1>Decentralised Token Auction Exchange.</h1>
      <p>
        DutchX is a token auction which uses a mechanism for determining a fair value for tokens. 
        This value is based on the demand from the community.
        <br/><br/>
        No account needed. Direct trades between peers through smart contracts.
        <br/><br/>
        <a href="#">How a Dutch Auction works</a>
      </p>
    </div>
  )
}

export default TextSquare
