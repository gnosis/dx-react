import React from 'react'

interface ContentPages {
  handleClick: () => any;
}

export const HowItWorks = ({ handleClick }: ContentPages) => (
<article>
  <h1>How the DX works</h1>
  <section className="drawer" onClick={handleClick}>
    <h3>The Dutch Exchange in short</h3>
    <span>
      <p>The Dutch Exchange (DutchX or DX) is a fully decentralized exchange for ERC-20 token pairings, based on the Dutch auction principle.
        Using this interface, you will participate in the next running auction.
      </p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>The auction process</h3>
    <span>
      <p>There is only always one auction for a particular pairing (e.g. ETH-RDN) at any point in time.
        Being part of the DutchX has a lot of advantages: you may reduce your fees, you may benefit from other participants’ fees and you will get a fair price for tokens.
        However, it comes with the drawback of slow execution!
      </p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>How long does an auction take?</h3>
    <span>
      <p>The duration of an auction is unknown ahead of time. However, a typical auction is expected to run for about 6 hours. This is because after 6 hours, the auction reaches the prior closing price, which is an indication for length and price (the last available market price). Due to potential fluctuations (especially in the realm of cryptocurrencies), the auction may close earlier or run longer. It is important to stress that the price reached in the auction reflects the current fair market price.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>When do I claim my tokens?</h3>
    <span>
      <p>Once you have submitted your order, you will take part in the next auction to run. The start time of that auction might be just momentarily or it might be only in some hours time if there is still one running for your chosen pairing. Once your auction has started, it might take around 6 hours to finish. Therefore, it could take some time until you can claim your tokens. But it’s definitely worth the wait.
        At the moment, there is no notification, which means that you have to revisit this interface. A red claim button will alert that you are able to claim your receive Token.
      </p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>When do auctions start?</h3>
    <span>
      <p>Opposite auctions (e.g. ETH-RDN and RDN-ETH) always start at the same time. They start at least 10 minutes after the prior auctions finish and only if one of the volumes (i.e. deposits) is worth more than 1,000 USD. Therefore, it cannot be predicted when exactly they will start as they depend on the prior closing time.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>When do auctions end?</h3>
    <span>
      <p>Auctions end when the auction clearing price is reached and all sellTokens are being bought and thus allocated to bidders at this final price (i.e. bidVolume x price = sellVolume).</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>Which tokens can I exchange?</h3>
    <span>
      <p>You may find the tokens available to trade on this interface within the token list (click on either the sell or receive token). Note that all tokens are always available to trade with ETH (or WETH) but may not yet exists as a pairing with one another.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What do I need to exchange a token on the DutchX?</h3>
    <span>
      <p>You only need three things:</p>
      <ol>
        <li>A compatible (and connected) wallet. Currently only Metamask is supported!</li>
        <li>An ERC-20 token or ETH. For the tokens that you can currently exchange on this interface, check the token list by clicking on the sell or receive token.</li>
        <li>ETH in your wallet to pay for transactions fees (both for submitting an order and claiming your tokens).</li>
      </ol>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>Step-by-step guide to submit an order:</h3>
    <span>
      <p>
        <strong>These are the screens you will be taken through on this interface:</strong>
      </p>
      <ol>
        <li>Pick the token you want to sell and the token you would like to receive</li>
        <li>Specify the amount of the token you would like to sell</li>
        <li>
          Proceed via your wallet provider’s screens to place your order into the next running auction. To make this process easier to understand, modals are provided alongside the wallet screens:
          <ul>
            <li>Wrapping ETH will be the first confirmation which you will see only if you need to wrap (i.e. make it ERC-20 compatible) (confirm with the wallet provider’s pop-up)</li>
            <li>Paying for fees in OWL: If you have OWL in your linked wallet, you will be asked whether you would like to pay for half of your fees in OWL (as long as you have OWL available).</li>
            <li>Confirming the token transfer on the modal provided (either a minimum or the maximum; allow the maximum to only sign one transaction in the future)</li>
            <li>Approving the token transfer (confirm with the wallet provider’s pop-up)</li>
            <li>Confirming order (confirm with the wallet provider’s pop-up)</li>
          </ul>
        </li>
        <li>Once your order has been submitted, you will see be provided with the auction status and a link to return for information. The auction is also added to “Your Auctions” at the top of the page. So, no worries if you don’t save the URL. Come back to the DutchX with your linked wallet at any time to view your auctions.</li>
        <li>Don’t forget to claim your tokens when the auction has finished (see below).</li>
      </ol>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>Step-by-step guide to claim your tokens:</h3>
    <span>
      <p>Once you have submitted your order and the next auction has started (you can see that an auction has started in the specific auction URL provided for you after you submitted your order) and finished, you may proceed to claim the tokens you receive. At the moment, there is no notification, which means that you have to revisit this interface. A red claim button will alert that you are able to claim your receive token.
        The interface provides you with two different possibilities of claiming your token.
      </p>
      <ul>
        <li>At the top of the page within the section “Your Auctions”. Using this button will claim the tokens from all prior auctions of that pairing in which you have participated. By clicking on the red claim button, you will see your wallet provider’s screens. You may need to confirm twice.</li>
        <li>The second option is provided to you via the specific URL for the auction pairing. You will see this screen at the end of the order process and you there you may claim the token particularly for that specific auction. You will only need to sign once.</li>
      </ul>
      <p><strong>Note that you have to be connected to the same wallet that you participated with in order to claim!</strong></p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What is displayed in “Your Auctions”?</h3>
    <span>
      <p>You can see three statuses:</p>
      <ul>
        <li> Auctions in which you have placed an order but have not started (including the amount you have committed). </li>
        <li>Auctions  that are running currently (including the committed amount). </li>
        <li>Auctions that have finished but you have not claimed your funds yet. </li>
      </ul>
      <p>If you have none of the three mentioned, you will see a message “No Auctions to show”.
        Note that the first token shows you the token you are selling and the second token is the one you will receive.The link to the auction pairing will always take you to the last one you have participated in (even if you have participated in more auctions in a row).
      </p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What is MGN?</h3>
    <span>
      <p>MGN is short for the Magnolia token. Magnolia token reduce your Fee level: For more info, check out Magnolia within the token section.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What is my fee level?</h3>
    <span>
      <p>By default, your fee level is 0.5%. You may lower your fees by trading frequently or owning Magnolia. For more info, check out the Fee section.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What does “Any auction with [Token] won’t generate MGN” mean?</h3>
    <span>
      <p>With this, we display for you if the Token creates Magnolia (which is used for fee-reduction) when you exchange it. Find more information on this here. You can still take part in auctions in the normal way.</p>
    </span>
  </section>
  <section className="drawer" onClick={handleClick}>
    <h3>What does “Note: this token pair won’t generate MGN tokens” mean?</h3>
    <span>
      <p>With this, we display for you if the token pair creates Magnolia (which is used for fee-reduction) when you exchange it. If one token does not generate Magnolia, the entire token pair will not create magnolia. Find more information on this here. You can still take part in auctions in the normal way.
        <br />
        Watch the screencast for the details!
        To participate as a technical bidder, read up on the documentation here.
      </p>
    </span>
  </section>
</article>
)

{/* SCREENCAST - page */}
export const Screencast = () =>
  <article>
    <h1>Screencast</h1>
    <section className="content">
      <p>A screencast on how to exchange tokens on the DutchX will follow shortly. For now, please read the <a href="#">How the DX works</a> section.</p>
    </section>
  </article>

{/* TOKENS - page */}
export const Tokens = ({ handleClick }: ContentPages) => 
  <article>
    <h1>Tokens</h1>
    <section className="drawer" onClick={handleClick}>
      <span>
      <h3>Which token pairings are exchanged on the DutchX?</h3>
      <p>Check out the token list (click on either Sell or Receive token) to see the tokens on this interface. All tokens on the list can always be exchanged with ETH (and wrapped ETH).
        However, on a technical level, there might be more tokens available on smart contract level. Technical readers are referred to the section on <a href="#">Technical &amp; API</a>.</p>
      </span>
      </section>
      <section className="drawer" onClick={handleClick}>
        <h3>Which token pairings can be exchanged on the DutchX? </h3>
        <span>
        <p>In theory, all Ethereum tokens compatible with the ERC-20 standard may theoretically be exchanged on the DutchX. Before they become available to trade, they will need to be added to the exchange. The conditions for adding tokens are defined in the smart contract governing the DutchX. For more and very detailed information, read the Section on <a href="#">Listing a Token</a>.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What are the required tokens to trade on the DutchX?</h3>
      <span>
      <p>You do not need to own any particular token to trade on the DutchX! Goes without saying, that you of course need the token to trade and ETH to pay for gas costs. Check out <a href="#">What do I need to exchange a token on the DutchX?</a></p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Magnolia (MGN)</h3>
      <span>
      <p>Magnolia (MGN) tokens lower the platform fees on the DutchX. MGN are automatically generated and credited to platform users: One MGN is generated for trading one ETH worth of any whitelisted token-pair (and of course trading any fraction of ETH generates the same fraction of MGN).
        Note that you will need to add the MGN address to your wallet in order to see it: [INCLUDE DYNAMIC MGN TOKEN ADDRESS].
        Of course, you do not need to have any Magnolia (MGN) to participate in the DutchX! MGN are locked by default and can then be used for <a href="#">fee reduction</a> when locked. In theory, there might be an MGN market also - they are fungible and not personalized.</p>
      </span>
      </section>
      <section className="drawer" onClick={handleClick}>
        <h3>What are whitelisted tokens?</h3>
        <span>
        <p>Whitelisted tokens are those that generate Magnolia when traded in a whitelisted pair. The idea of whitelisted tokens is that no token can be added to the DutchX with the mere intention to create Magnolia and benefit from lower fees.</p>
      </span>
      </section>
      <section className="drawer" onClick={handleClick}>
        <h3>Which tokens are currently whitelisted?</h3>
        <span>
        <p>To see if a token that is tradable on this interface is whitelisted, check the token list by clicking on the sell or receive token. You will find an information if the token is not whitelisted “Any auction with [Token] won’t generate MGN”.
          At launch of the DutchX, the top 150 ERC20-tokens (based on the market cap) were pre-whitelisted from <a href="#">Etherscan</a> on 11 May 2018. Technical readers are referred to the section on <a href="#">Technical &amp; API</a>.</p>
        </span>
      </section>
      <section className="drawer" onClick={handleClick}>
        <h3>How can a further token be whitelisted?</h3>
        <span>
        <p>You will find a section on whitelisting within the section <a href="#">Listing a token</a>.</p>
      </span>
      </section>
      <section className="drawer" onClick={handleClick}>
        <h3>Does my trade generate Magnolia?</h3>
        <span>
        <p>Trades only generate Magnolia if both tokens are whitelisted. To see if a token that is tradable on this interface is whitelisted, check the token list by clicking on the sell or receive token. You will find an information if the token is not whitelisted “Any auction with [Token] won’t generate MGN”. Once you proceed to the next screen, you will find another message only in the case that no Magnolia are generated: “any auction with [Token] won’t generate MGN”.
        In any case, you may proceed to trade those tokens in the same manner.</p>
      </span>
      </section>
  </article>

export const Fees = ({ handleClick }: ContentPages) => 
  <article>
    <h1>Fees</h1>
    <h2>[Section subtitle]</h2>
    <section className="drawer" onClick={handleClick}>
      <h3>What fees do I have to pay?</h3>
      <span>
      <p>Both sellers and bidders pay the same amount of fees which equals <strong>0.5%</strong> of their trading volume. However, fees can be lowered down to <strong>0%</strong>.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How can I lower my fees?</h3>
      <span>
      <p>In fact, the fee will be lowered automatically if you hold Magnolia tokens. The amount by which the fee is lowered depends on how much Magnolia you hold in relation to the entire Magnolia market volume. It is based on this neat step function:</p>
      <table>
          <thead>
            <tr>
              <th>Percentage of Magnolia you hold (of the entire Magnolia market)</th>
              <th>Your fee as a percentage of your trading volume</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Less than 0.0001%</td>
              <td>0.5%</td>
            </tr>
            <tr>
              <td>0.001%</td>
              <td>0.4%</td>
            </tr>
            <tr>
              <td>0.1%</td>
              <td>0.2%</td>
            </tr>
            <tr>
              <td>1%</td>
              <td>0.1%</td>
            </tr>
            <tr>
              <td>>=10%</td>
              <td>0%</td>
            </tr>
          </tbody>
        </table>
        <p>
        Note: If you want to make use of the Magnolia fee reduction mechanism, you must hold Magnolia tokens in the same wallet that you are participating with on the DutchX .
        Magnolia tokens are inflationary as the creation is based on the volume traded on the Dutch Exchange—there is no mechanism to diminish their volume.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Where can I see my fee level?</h3>
      <span>
      <p>On the header of the interface, the approximate fee level is provided for your convenience. Note that this is a snapshot in time and due to the changing Magnolia market, this number should be viewed as an approximation.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How do I obtain Magnolia?</h3>
      <span>
      <p>You may either generate Magnolia by trading on the DutchX (within a whitelisted trading pair): 1 MGN (or fraction of MGN) is generated and automatically attributed for every 1 ETH (or fraction of ETH) worth of trade.
      Or alternatively, MGN are freely tradable and can theoretically be purchased. This may be particularly beneficial if you are close to the next fee reduction level. </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How do I transfer Magnolia?</h3>
      <span>
      <p>To trade MGN, you must unlock them first. After a waiting period of 24 hours, they may be transferred and locked again to make use of the fee reduction model. Currently this is not offered on the interface.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Why is it beneficial to hold a lot of Magnolia?</h3>
      <span>
      <p>The more Magnolia you hold as a percentage of the total Magnolia market volume, the lower your fee (if within the relevant percentages). This provides an incentivize for a continuous use of the DutchX. Additionally, it becomes lucrative to be an active participant on the DutchX from the beginning, since the Magnolia you hold are relative to the entire Magnolia market. </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How do I pay up to half of fees with OWL?</h3>
      <span>
      <p>After the fee reduction using Magnolia (which is done automatically), you may (but do not have to) pay up to half of the remainder of fees in OWL. One OWL can be used to pay for the equivalent of one USD in fees.
        If you set an allowance on the first pop-up modal when going through transactions, fee payment in OWL is done automatically for you and OWL is deducted from the wallet you are connected with. The pop-up modal only appears if you hold OWL.
      OWL used to pay for fees are not credited to any particular party but are instead consumed (“burned”).</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How do I pay my fees?</h3>
      <span>
      <p>Fees (or remaining fees in case you choose to partially pay with OWL) are automatically deducted from the token you are participating with (and then attributed to the auction you are participating in). </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>So what does the step-by-step fee calculation look like?</h3>
      <span>
      <p>Imagine you are taking part with a volume of 20 Token A.<br/>
        The DutchX calculates your fee level based on the MGN you hold, e.g. 4%. This information is displayed for you in the header (e.g. 0.8 Token A)<br/><br/>
        From this fee level (e.g. 4%), you have the option to pay half in OWL (if you own OWL in the wallet you are participating with).
        If you choose to pay half in OWL (in this example 2%; 2% of your participating volume (=0.4 TokenA) is translated into USD. Note that 1OWL is accepted as 1USD on the DutchX.<br/><br/>
        If you do not choose to pay in OWL or you do not have OWL, 4% (in this example) are deducted from your participating Token.<br/>
        The remainder of the fees is paid in the participating token<br/><br/>
        In the case of not paying in OWL; the remainder is 0.8 -0 = 0.8.<br/><br/>
        In the case of paying with OWL, the remainder is 0.8-0.4= 0.4.<br/><br/>
        <strong>What gets attributed to the auction?</strong><br/>
        In the case of not paying in OWL: 20-0.8=19.2 A Token are attributed to the sellVolume.
      In the case of paying in OWL: 20-0.4=19.6 A Token are attributed to the sellVolume.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Who obtains the fees?</h3>
      <span>
      <p>Fees in the Dutch Exchange do not go to any specific party!
        Fees paid in OWL are consumed (i.e. burned) and not credited to anyone.
      Fees paid in the Token the user is participating with will go into the next running auction for the same token-pairing to be auctioned off as an extra balance (always as sellTokens). Fees are redistributed within the DutchX ecosystems and go towards high-volume users!</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What is the reasoning for the fees to go into the next auction?</h3>
      <span>
      <p>We would like to keep the fees in the DutchX ecosystems. That means that users, and especially frequent users benefit as they not only lower their fees, but get credited part of the fees!</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What are OWL?</h3>
      <span>
      <p>Read up on OWL and the initial OWL generation.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Why would I want to pay my fees in OWL?</h3>
      <span>
      <p>Firstly, if you are a GNO holder, you obtain OWL by locking your GNO. Secondly, one OWL can be used to pay one USD worth of fees (this is fixed on the platform). </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How are OWLs burned?</h3>
      <span>
      <p>Burning OWL means that they will be collected in a smart contract that cannot be accessed by anyone.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Do I also have to pay a gas price?</h3>
      <span>
      <p>Yes, you do! For all transactions on the Ethereum blockchain, gas has to be paid. The amount of gas to be paid depends on the current transactions being processed on Ethereum. Both sellers and bidders have to pay gas for a) executing the bid or sellOrder, and b) to claim the exchanged token. Your wallet provider will show you the gas estimation for each transactions and you may set a gas fee.</p>
    </span>
    </section>
  </article>

export const AuctionMechanisms = ({ handleClick }: ContentPages) => 
  <article>
    <h1>Auction Mechanisms</h1>
    <section className="drawer" onClick={handleClick}>
      <h3>Dutch Exchange</h3>
      <span>
      <p>The Dutch Exchange (DutchX) is a decentralized exchange for ERC20 token pairings, based on the Dutch auction principle. Taking the traditional order book model to the blockchain makes little sense: problems such as front-running are magnified in discrete time. The mechanism of the DutchX is designed such that sellers submit their tokens ahead of an auction. Then, the auction starts with a high price which falls until the market for the specific token-pairing clears. Bidders submit their bids during the auction, but pay the same final price. Hence, the dominant strategy for bidders to reveal their true willingness to pay will result in fair market prices. Coupled with a pure on-chain design, the DutchX may function as a price oracle and is also usable for other smart contracts to convert tokens. Participants benefit from the redistribution of fees within the DutchX ecosystem as well.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How a Dutch auction works</h3>
      <span>
      <p>While there are some variations to the mechanism, the main concept of a Dutch auction is that it starts with a high but falling price. The first person to make a bid will purchase the auctioned item for the current price at the bidding time.
        If there are multiple fungible items in one auction (e.g. shares or tokens), then the auction only ends when all the items have been allocated to bidders and each successful bidder will receive their purchase at the same final (lowest!) price.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What is a batch auction?</h3>
      <span>
      <p>Instead of trading continuously, the exchange collects the sell orders as batches until the auction starts, and clear them at the end of the auction all at once.<br/><br/>
        Therefore, by accumulating orders that are executed at the same time, a batch auction exchange not only represents a better price finding mechanism than an order book, but also eliminates the inherent flaw of the order book exchange: front-running.
        On the DutchX, your orders will get batched so that you benefit from these advantages (which is a reason for slow execution as well).
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>The Dutch Exchange in detail</h3>
      <span>
      <p>The DutchX for a particular token-pairing (e.g. exchange Token A for Token B) changes between two states: (i) before the particular auction starts, and (ii) when an auction is running.
        In the first state (i) sellers deposit their tokens (here: Token A). In the second state (ii), while the auction is running, bidders submit their bids (here: Token B).
        <br/><br/>
        (include seller/bidder picture from this slide deck, slide 6; I don’t think there is a separate graphic for this).
        <br/><br/>
        State (i) closes before state (ii) starts and hence sellers cannot deposit tokens into a running auction (these automatically go into the next auction). This means that there is a fixed amount of tokens to be auctioned off.
        <br/><br/>
        This is what the second state (the auction) looks like (Token A for Token B):
        (include picture of the running auction, slide 7, there should be a graph)
        <br/><br/>
        The price starts at a very high price point (twice the last closing price) and falls over time. The price falls quickly at first and slows down to decrease less rapidly. During the entire auction, bids are accepted. <strong>When the auction ends, all bidders pay the same closing price!</strong> The “price” is paid in the currency determined by the particular token-pairing. In this example, Token B was used to purchase A Token and the price is set by the exchange rate between Token A and Token B.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What does each auction look like over time?</h3>
      <span>
      <p>Only one auction of the same pairing is run at the same time. Note that opposite auctions (i.e. opposite auction of Token A as sellToken and Token B as bidToken is Token B as sellToken and Token A as bidToken) run at the same time (they start simultaneously and finishing at their individual times).<br/><br/>
        Of course for all unique pairings the same logic is applied and those auctions run independently from one another. Each pairing goes through the stages (i) sellers deposit, (ii) bidders bid, and (iii) payouts are claimed. Over time, it looks like this:
        (include slide 9 of the slide deck; I don’t think this graphic exists in the repo)
      </p>
    </span>
    </section>
  </article>

export const MarketMarker = () =>
  <article>
    <h1>Market Maker on the DX</h1>

    TBD

  </article>
{/* END Market Maker on the DX - page */}


{/* Listing a Token on the DX - page */}
export const ListingToken = () =>
  <article>
    <h1>Listing a Token on the DX</h1>

    TBD

  </article>
{/* END Listing a Token on the DX - page */}


{/* DX as an Open Platform - page */}
export const OpenPlatform = () =>
  <article>
    <h1>DX as an Open Platform</h1>

    TBD

  </article>
{/* END DX as an Open Platform - page */}


{/* FAQ - page */}
export const FAQ = ({ handleClick }: ContentPages) => 
  <article>
    <h1>FAQ</h1>

    <section className="content">
      <p>Firstly we recommend to read the <a href="#">blog</a> as there is a lot of background information on why the exchange was build. Particularly interesting might also be the <a href="#">Main Benefits of the DutchX Mechanisms</a>.
      </p>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What is ERC20?</h3>
      <span>
      <p>ERC20 is a technical token standard used for smart contracts on the Ethereum blockchain. All tokens of this standard are compatible with the DutchX. You may check, e.g. Etherscan for a list of <a href="https://etherscan.io/tokens">ERC20 Token Contracts</a>.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Which wallets are compatible?</h3>
      <span>
      <p>Currently the only tested wallet is Metamask. We recommend the use of Metamask. However, other wallet providers
  Tested ERC20 compatible cryptocurrency wallets are ONLY Metamask (www.metamask.io). Other wallets may likely work (give that both, GNO and OWL tokens are ERC20 compatible).  However, the interface was not scrutinised with other wallets, whereas Metamask was tested and is highly recommended for use.
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Which browsers are compatible?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>

    <h2>Providing liquidity</h2>
    <section className="drawer" onClick={handleClick}>
      <h3>Is it safe?</h3>
      <span>
      <p>Some infos? Do we ever hold the deposit (I assume not as it is decentralised) - i.e. it is locked in a smart contract during this time… is each sellOrder submitted separately, or are they batched beforehand...??</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I copy, alter and use the code?</h3>
      <span>
      <p>You may do everything that is allowed based on the licenses attached to the code. This is not to be considered legal advice and no further information can be given.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What is wrapped Ether?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I trade both Ether and wrapped Ether?</h3>
      <span>
      <p>Yes.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Why do my trades not generate Magnolia tokens?</h3>
      <span>
      <p>If your trades do not generate Magnolia, that is because they are not white-listed.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How is the starting price determined?</h3>
      <span>
      <p>As we run the opposite auctions at the same time, the auctions may have different closing prices. We take the weighted average (depending on the volume) to create a reliable price for the token-pairing. <br/>
  We start the next token auctions at twice the weighted average price. E.g. if the final weighted average price was 2:1 for Token A:Token B we start the Token A / Token B auction at 1:1 and the Token B / Token A auction at 1:4. <br/>
  Why do we do this? This has mainly a couple of reason: one, the duration of the auction should be such that bidders have time to bid. During this time frame, sellers can already deposit their tokens into the next auction. Two, this way we allow for large price fluctuations.
  </p>
</span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What does the price function look like?</h3>
      <span>
      <p>We start at twice the weighted closing price. First the price falls quicker to then slow down to allow bidders to submit bids at the critical price points. This is critical for participation as it should not make a big difference if the transaction is only processed in a later block on a blockchain as the price will not have moved significantly. The function reaches the prior auction’s closing price after exactly 6 hours. Then the price function would drop further until it reaches zero after 24 hours - this will of course not happen but technically it is possible (the price function looks like (24-t)/(t+12)).</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Why do the auctions for the opposite token pairing start at the same time?</h3>
      <span>
      <p>This has a few reasons: One, it is very simple to do so! Two, it will result in a more accurate weighted price. And three, we automate the arbitrage that would else be possible between the two markets.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can it happen that there is no opposite auction?</h3>
      <span>
      <p>Yes, theoretically this can happen (though very unlikely). This would be the case if only one of the auction has the entire funding necessary to start and the opposite auction has no funding when the auction starts. This isn’t a problem. </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What price feed is the Dutch Exchange using?</h3>
      <span>
      <p>We have built our exchange in such a way that we only need to use one external price feed, namely the ETH/USD price feed. We use the price feed of DAI which can be found here. The reason for using this particular price feed is that we believe it is very reliable and accurate.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What does the Dutch Exchange need the ETH/USD price feed for?</h3>
      <span>
      <p>We need this for thee calculations: 1) the initialisation (first listing) of a token and 2) the starting of an auction, 3) the calculation of fees in USD or OWLs.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What does the exchange got to do with prediction markets?</h3>
      <span>
      <p>The Dutch Exchange is not directly linked to our prediction market platform. However, it is a very neat mechanism to come to a fair market price. We look to implement the same price finding mechanism into our prediction markets.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How does it work in detail?</h3>
      <span>
        <ol>
        <li>Specify the amount of Tokens you want to sell. We will give you an estimation of how much you will receive based on the last auction’s closing price. This is only indicative! </li>
  <li>Your wallet is automatically connected and by submitting your sellTokens are added into the next auction.</li>
  <li>Once you have clicked on “submit order”, your wallet interface will pop up. You will have to a) approve the movement by the Dutch Exchange (possibly twice if you pay fees in OWLs) and b) approve the actual sellOrder itself. </li>
  <li>You will see an interface where we inform you about:
  <ul>
    <li>The link to the auction</li>
    <li>When we expect the auction to end</li>
    <li>Claiming the buyTokens (when you can claim them)</li>
  </ul>
  </li>
  <li>As is Ethereum best practice, you will have to actively claim your buyTokens when the auction finishes. Upon claiming, we will deposit the buyTokens into your wallet (the same wallet you participated with). </li>
  <li>A note regarding the fee: The fee process is automated in the background. You don’t have to actively process anything. You can find the details here, in short: If you do not qualify for a fee reduction, the fee is 0.5% of your trading volume. This can either be paid in OWL or in the Token you are participating with. It is automated to deduced OWL as long as you have these in your wallet and set an allowance.</li>
  <li>Also note that gas costs incur separately: once for posting the order and once for claiming the order. Your wallet may show you the estimated gas fees beforehand.</li>
  <li>The process for the seller equates a market order (at the currently fair market price).</li>
  <li>No account with us is needed (just a wallet). </li>
  <li>For specifics, refer to the seller FAQ below.</li>
  </ol>
</span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Do I need an account?</h3>
      <span>
      <p>No account needed.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How do I link my wallet?</h3>
      <span>
      <p>This is done automatically for you. In case you are not logged into your wallet, you should log in first.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What wallets are compatible?</h3>
      <span>
      <p>All wallets that hold ERC-20 tokens are compatible.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What if I have many wallets?</h3>
      <span>
      <p>We recommend that you have your relevant tokens (those you want to participate with, Magnolia and OWLs) in one wallet. Firstly, we can access it there, secondly: don’t spread your Magnolia over more wallets as they are relevant for reducing your fees!</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What happens if I have more than one wallet, which wallet is linked?</h3>
      <span>
      <p>The wallet which injects into your browser last, will be automatically added. If you want to participate with another wallet, simply log out of the ones you do not want to have linked to the Dutch Exchange and refresh your browser.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What else do I need to know about my wallet?</h3>
      <span>
      <p>Very important, you need to have your private key! Sometimes, if you send tokens from another address, you will not hold the private key. You can only claim the tokens with the address you have send it from!</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Is there a minimum sellOrder?</h3>
      <span>
      <p>No, there is not.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I re-claim my deposits (before or during an auction)?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I re-claim my deposits (before or during an auction)?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What do I do if I want to use FIAT currency (e.g. USD, EUR) to receive Tokens?</h3>
      <span>
      <p>You cannot trade other (non-ERC-20 Tokens) on our platform. You will first need tokens.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What do I need to know about cryptocurrencies?</h3>
      <span>
      <ul>
        <li>We make it simple but it’s highly speculative if you don’t know what you’re doing</li>
        <li>In that moment the auction ends, the market price will be fair. Of course high fluctuations are possible.</li>
      </ul>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What information is known to me ahead of depositing my tokens?</h3>
      <span>
        <ul>
          <li>Last auction closing price.</li>
          <li>Not the fee pot</li>
          <li>Not how big the sellvolume is</li>
          <li>When the next auction starts if know?</li>
        </ul>
      </span>
    </section>
      <section className="drawer" onClick={handleClick}>
      <h3>I don’t know how much I am getting beforehand - will it be fair?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What do I do when I am not happy with the amount received?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What if there are no bidders for my tokens?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What is my best strategy as a seller?</h3>
      <span>
      <p>What is my fall-back strategy if the price drops too low?</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How can I claim my funds?</h3>
      <span>
      <p>You as a seller may claim your BuyTokens once the auction has cleared. The price and your sell Volume will give you the amount of BuyTokens you will receive. You can do this at any point after the auction clears - there is no rush! Just go back to the Dutch Exchange website, make sure you are logged into the same wallet and you will see which of your auctions have ended and where you can claim the tokens.</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Why can I not withdraw the token immediately? </h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>How high will my gas costs be?</h3>
      <span>
      <p>As a seller you will incur gas costs for the following transactions:
        TBD
      </p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Is it worthwhile to be a repeat customer?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Do I have an advantage with a higher gas price?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>What happens if I close the auction?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Who pays the gas price for closing an auction if it is closed by time?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I specify beforehand at which price I would like to buy?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I receive a notification when we are close to my price point?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Can I receive a notification a specific auction is scheduled?</h3>
      <span>
      <p>TBD</p>
    </span>
    </section>
    <section className="drawer" onClick={handleClick}>
      <h3>Is there a minimum buyOrder?</h3>
      <span>
      <p>No, there is not.</p>
    </span>
    </section>

  </article>

{/* API and Technical Links - page */}
export const Technical = () =>
  <article>
    <h1>API and Technical Links</h1>
    <section className="content">
      <p>
        <a href="#">Read API</a><br/>
        <a href="#">Technical documentation </a><br/>
        <a href="#">Github Repo</a><br/>
        <a href="#">Listing a Token to the Smart Contract</a><br/>
        <a href="#">Listing a Token to the Interface</a><br/>
        <a href="#">Providing Liquidity</a>
      </p>
    </section>
  </article>

{/* Downtime and Maintenance - page */}
export const Downtime = () =>
  <article>
    <h1>Downtime and Maintenance</h1>
    <section className="content">
      <p>Unfortunately, there is no guarantee of keeping this interface available to you. We try our best to facilitate an easy use. If we are down for maintenance, we will try to communicate this early. In case the site is down due to unforeseen reasons, we will reach out via other channels (e.g. <a href="#">twitter</a>).<br/><br/>
      It’s important to note that funds can always be claimed: interactions with the DX smart contract is always possible as the entire DutchX smart contracts are on the Ethereum blockchain.</p>
    </section>
  </article>

{/* Help - page */}
export const Help = () =>
  <article>
    <h1>Help</h1>
    <section className="content">
      <p>Haven’t found the answer in the <a href="#">FAQ?</a> <br/>
      For all questions from and for developers, go to the <a href="#">Gitter channel</a>. <br/>
      You may also reach us at <a href="#">support.dx@gnosis.pm</a><br/>
      </p>
    </section>
  </article>

{/* Imprint page */}
export const Imprint = () =>
  <article>
    <h1>Imprint</h1>
    <section className="content">
      <h3>Gnosis Ops Ltd.</h3>
      <p>
        World Trade Center<br />
        6 Bayside Rd, GX111AA Gibraltar<br />
        E-mail: <a href="mailto:info@gnosis.pm">info@gnosis.pm</a><br /><br />
        <strong>Directors:</strong> <br />Stefan George, Martin Köppelmann, Joseph Lubin, Jeremy Millar<br /><br />
        Company registered in Gibraltar<br />
        Company Nr. 116678
      </p>
    </section>
  </article>
