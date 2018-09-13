import React from 'react'
import { URLS } from 'globals'
import { Link } from 'react-router-dom'

import 'assets/pdf/DutchX_Rinkeby_PrivacyPolicy.pdf'

import stepByStepFeeCalc from 'assets/content/step_by_step_fee_calculation.png'
import feeReductionModel from 'assets/content/fee_reduction_model_dutchX.png'

interface ContentPages {
  handleClick: () => any;
}

export const HowItWorks = ({ handleClick }: ContentPages) => (
  <article>
    <h1>How the DutchX works</h1>

    <section className="drawer" id="dutchx-in-short" onClick={handleClick}>
      <h3>The DutchX in short</h3>
      <span>
        <p>
          The DutchX is a fully decentralized exchange for ERC-20 token pairings, based on the Dutch auction principle.
          Using this interface, you will participate in the next running auction.
        </p>
      </span>
    </section>

    <section className="drawer" id="what-is-dutchx" onClick={handleClick}>
      <h3>What is the DutchX exactly?</h3>
      <span>
        <p>
          The DutchX is a decentralized, open trading protocol for ERC20 token pairs, based on the Dutch auction principle.
          Taking the traditional order book model to the blockchain makes little sense: problems such as front-running are magnified in discrete time.
          The mechanism of the DutchX is designed such that sellers deposit their tokens ahead of an auction.
          Then, the auction starts with a high price which falls until the market for the specific token-pair clears.
          Bidders submit their bids during the auction, but pay the <span className="underline">same</span> final price.
          Hence, the dominant strategy for bidders to reveal their true willingness to pay will result in fair market prices.
          Coupled with a pure on-chain design, the DutchX may function as a price oracle and is also usable for other smart contracts to exchange tokens.
          Participants benefit from the redistribution of fees within the DutchX ecosystem as well.
        </p>
      </span>
    </section>

    <section className="drawer" id="how-dutch-auction-works" onClick={handleClick}>
      <h3>How does a Dutch auction work?</h3>
      <span>
        <p>
        While there are some variations to the mechanism, the main concept of a Dutch auction is that it starts with a high but falling price.
        The first person to make a bid will purchase the auctioned item for the current price at the bidding time.
        If there are multiple fungible items in one auction (e.g. shares or tokens), then the auction only ends when all the items have been allocated to bidders. Each successful bidder will receive their purchase at the same final (lowest!) price.
        </p>
      </span>
    </section>

    <section className="drawer" id="dutchx-characteristics" onClick={handleClick}>
      <h3>What are the specific characteristics of the DutchX?</h3>
      <span>
        <p>
          There is always only one auction for a particular pair (e.g. ETH-RDN) at any point in time.
          Taking part in the DutchX has a lot of advantages: you may reduce your fees, benefit from the fees of other participants, and you will get a fair price for tokens.
          However, it comes with the drawback of slower order execution!
        </p>
      </span>
    </section>

    <section className="drawer" id="how-long-auction-takes" onClick={handleClick}>
      <h3>How long does an auction take?</h3>
      <span>
        <p>
          The duration of an auction is unknown ahead of time. However, a typical auction is expected to run for about 6 hours (in which the bidding to take place). After 6 hours, the auction reaches the prior closing price, which serves as an indication for length and price (the last available market price). Due to potential fluctuations (especially in the realm of cryptocurrencies), the auction may close earlier or run longer. It is important to stress that the auction price reflects the current fair market price.
        </p>
      </span>
    </section>

    <section className="drawer" id="when-do-i-claim-tokens" onClick={handleClick}>
      <h3>When do I claim my tokens?</h3>
      <span>
        <p>
          Once you have placed the tokens that you want to sell in the auction (=submitted your deposit/order), you will take part in the next auction that runs. The next auction might start right away, or only in a couple of hours time if there is still an auction running for your chosen token pair. Once your auction has started, it might take around 6 hours to finish. Therefore, it could take some time until you can receive the tokens that you want for the trade (=claim your new tokens)—but it’s definitely worth the wait. You can be assured to get a fair price for your tokens.
          At the moment, there is no notification once your auction has closed, which means that you have to revisit this interface. A red claim button will alert you that you are able to claim your new tokens.
        </p>
      </span>
    </section>

    <section className="drawer" id="how-do-i-claim-tokens" onClick={handleClick}>
      <h3>How do I claim my new tokens?</h3>
      <span>
        <p>
          The interface provides you with two options to claim your new tokens:
          The first option is on top of the page in Your Auctions. The red claim button shows the auctions for which you can claim tokens. If you claim your tokens via this feature, you will claim this particular token from all prior auctions you have participated in for that token pair (please note: you might need to sign two transactions with your wallet provider).
          <br/>
          <br/>
          The second option is via the specific URL for the auction pair (auction overview page). You will automatically access the URL at the end of the order process. From there, you may claim the new token particular to that specific auction (you will only need to sign one transaction with your wallet provider).
          Note that you have to be connected to the same wallet that you used to participate in the auction in order to claim your new tokens! Please also check out the <Link to="#step-by-step-claiming">step-by-step guide</Link> about claiming tokens.
        </p>
      </span>
    </section>

    <section className="drawer" id="when-auctions-start" onClick={handleClick}>
      <h3>When do auctions start?</h3>
      <span>
        <p>
        There is always only one auction for a particular pair (e.g. ETH-RDN) at any point in time.
        They start at least 10 minutes after the prior auction finish and only if the volume (i.e. deposit) of one of the auctions is worth more than 1,000 USD. Therefore, it is hard to estimate when exactly they will start as they depend on the prior auctions' closing time.
        </p>
      </span>
    </section>

    <section className="drawer" id="when-auctions-end" onClick={handleClick}>
      <h3>When do auctions end?</h3>
      <span>
        <p>Auctions end when all deposits (<i>sellTokens</i>) have been bought and thus are allocated to bidders at the auction clearing price. The auction clearing price is the price that all <i>sellTokens</i> are traded at (i.e. <i>bidVolume</i> x price = <i>sellVolume</i>).</p>
      </span>
    </section>

    <section className="drawer" id="which-tokens-can-trade" onClick={handleClick}>
      <h3>Which tokens can I trade?</h3>
      <span>
        <p>
          You may find the tokens available to trade in the token list on this interface (click on either the <i>deposit</i> or <i>receive</i> token). Note that all tokens are always available to trade with ETH (or WETH), but may not yet exist as a pair with one another.
        </p>
      </span>
    </section>

    <section className="drawer" id="what-do-i-need-to-trade-on-dx" onClick={handleClick}>
      <h3>What do I need to trade a token on the DutchX?</h3>
      <span>
        <p>You only need three things:</p>
        <ol>
          <li>A compatible (and connected) wallet. Currently only <a href={URLS.METAMASK} target="_blank">MetaMask</a> is supported.</li>
          <li>An <Link to={URLS.FAQ + '#what-is-erc20'}>ERC20</Link> token or ETH. To see a list of tokens that you can currently trade on this interface, click on the <i>deposit</i> or <i>receive</i> token. </li>
          <li>ETH in your wallet to pay for transactions fees (both to submit a deposit (=order) and to claim your new tokens).</li>
        </ol>
        <p>No other tokens are needed!</p>
      </span>
    </section>

    <section className="drawer" id="step-by-step-submit-deposit" onClick={handleClick}>
      <h3>Step-by-step guide to submit a deposit (=order):</h3>
      <span>
        <p>
          <strong>This is the screen flow you will go through on this interface:</strong>
        </p>
        <ol>
          <li>Pick the token you want to sell (=deposit) and the token you would like to receive</li>
          <li>Specify the amount of the token you would like to deposit (note that you will see an <span className="underline">estimated</span> amount to receive, which is based on the last closing price of the prior auction)</li>
          <li>
            Proceed via your wallet provider’s screens to place your deposit into the next running auction. To make this process easier to follow, tutorials are provided alongside the wallet screens:
            <ul>
              <li>
                Wrapping ETH will be the first confirmation which you will see, but only if you need to wrap ETH (i.e. to make it ERC20 compatible). Please always confirm with your wallet provider.
              </li>
              <li>
                Paying for fees in OWL: If you have <Link to={URLS.FEES + '#what-are-owl'}>OWL</Link> in your linked wallet, you will be asked whether you would like to pay for half of your <Link to={URLS.FEES + '#fees'}>fees</Link> in OWL (as long as you have a positive OWL balance).
              </li>
              <li>
                Confirming the token transfer on the screen (either for this trade only or for future transaction with the same tokens).
              </li>
              <li>
                Approving the token transfer (confirm with your wallet provider).
              </li>
              <li>
                Confirming deposit (confirm with your wallet provider).
              </li>
            </ul>
          </li>
          <li>
            Once your deposit has been submitted, you will be provided with the auction status and a link to more information. The auction is also added to “Your Auctions” at the top of the page—no need to save the URL. Come back to the DutchX with your linked wallet at any time to view your auctions.
          </li>
          <li>
            Don’t forget to claim your new tokens when the auction has closed.
          </li>
        </ol>
      </span>
    </section>

    <section className="drawer" id="why-not-know-how-many-tokens-will-receive" onClick={handleClick}>
      <h3>Why do I not know in advance how many tokens I am receiving?</h3>
      <span>
        <p>
          This is because your tokens are deposited into an auction. Only the auction clearing price will define how much tokens you are receiving. This is ideal for a fair price finding mechanism. An estimation of how many tokens you will receive based on the last auction closing price will be provided. Your (deposit) order is essentially a safely (slowly) executed market order.
        </p>
      </span>
    </section>

    <section className="drawer" id="step-by-step-claiming" onClick={handleClick}>
      <h3>Step-by-step guide to claim your new tokens:</h3>
      <span>
        <p>
          Once you have submitted your deposit and the next auction has started (you can see that an auction has started in the specific auction URL you were provided with after you submitted your deposit) and closed, you may proceed to claim your new tokens. At the moment, there is no notification of a closing auction, which means that you have to revisit this interface. A red claim button will alert you to claim your <i>Receive</i> token.
          <br />
          The interface provides you with two different options to claim your new tokens:
        </p>
        <ul>
          <li>At the top of the page in the section <i>“Your Auctions”</i>. Clicking the claim button in the <i>Your Auctions</i> section will claim the tokens from all prior auctions of that particular pair in which you have participated. Once clicked on the red claim button, you will see your wallet provider’s screens. You may need to confirm twice (this is to claim and withdraw back to your wallet).</li>
          <li>The second option is via the specific URL for the auction pair. You will automatically access the URL at the end of the deposit process. From there, you may claim the token particularly to that specific auction. You will only need to sign once.</li>
        </ul>

        <p><strong>Important: If your trade generated <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia (MGN)</Link>, you will be credited those automatically upon claiming your new tokens. MGN are locked by default and are visible to you in the header bar of the interface.</strong></p>
        <br />
        <p><strong>Note that you have to be connected to the same wallet that you participated with in order to claim!</strong></p>
      </span>
    </section>

    <section className="drawer" id="hwhat-is-in-your-auctions" onClick={handleClick}>
      <h3>What is displayed in “Your Auctions”?</h3>
      <span>
        <p>You can see three statuses:</p>
        <ul>
          <li>Auctions in which you have placed a deposit but which have not started yet (including the amount you have deposited).</li>
          <li>Auctions that are currently running (including your deposited amount).</li>
          <li>Auctions that have closed but for which you have not yet claimed your new tokens.</li>
        </ul>
        <p>
          If none of the three above apply to you, you will see the note: “No Auctions to show”.
          Note that the first token is the token you are selling (have deposited) and the second token is the one you will receive.The link to the auction pair will always take you to the last auction you have participated in (even if you have participated in multiple auctions in a row).
          In case you participating in many auctions of the same pairing (e.g. one that is running, one that hasn’t started and one which has ended and you may claim), you will see only the amount for the currently running one (and a claim button for the one that has ended).
        </p>
      </span>
    </section>

    <section className="drawer" id="what-is-mgn" onClick={handleClick}>
      <h3>What is Magnolia (MGN)?</h3>
      <span>
        <p>
          MGN is the abbreviation for the Magnolia token. Locked MGN reduce your fee level. One MGN is automatically created for every ETH-worth of whitelisted token trades you make. You will receive them automatically upon claiming your new tokens. The more you trade, the more MGN you will receive, the lower your fee.
          For more info, check out the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link>.
          In the header bar of the interface, the amount of locked MGN associated with your linked wallet is displayed. However, you will not see this amount in your wallet.
          Of course, you do not need to hold any MGN to participate in the DutchX!
        </p>
      </span>
    </section>

    <section className="drawer" id="what-is-fee-level" onClick={handleClick}>
      <h3>What is my fee level?</h3>
      <span>
        <p>By default, your fee level is 0.5% of your trading volume. It taken from the deposited amount. You may lower your fees by trading frequently or holding MGN. For more info, check out the <Link to={URLS.FEES + '#fees'}>Fee</Link> section.</p>
      </span>
    </section>

    <section className="drawer" id="what-is-wont-generate-mgn" onClick={handleClick}>
      <h3>What does “Any auction with [Token] won’t generate MGN” mean?</h3>
      <span>
        <p>This message is to inform you about whether the token you are looking to trade generates Magnolia (which is used for fee-reduction) when you trade it. Find more information on this process <Link to={URLS.TOKENS + '#what-is-mgn'}>here</Link>. You can still use the trading interface in the same manner for tokens that do and do not generate Magnolia.</p>
      </span>
    </section>

    <section className="drawer" id="claiming" onClick={handleClick}>
      <h3>What does “Note: this token pair won’t generate MGN tokens” mean?</h3>
      <span>
        <p>This message is to inform you about whether the token pair generates Magnolia (which is used for fee-reduction) when you trade it. If one token out of the pair does not generate Magnolia, the entire token pair will not generate Magnolia. You can use the trading interface in the same manner for tokens that do and do not generate Magnolia. Find more information on this <Link to={URLS.TOKENS + '#what-is-mgn'}>here</Link>.
          <br />
          <br />
          Want to bid in an auction? This is currently only possible for technical participants: read <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">DutchX for Devs & API</a>.
        </p>
      </span>
    </section>

  </article>
)

{/* SCREENCAST - page */ }
export const Screencast = () =>
  <article>
    <h1>Screencast</h1>
    <section className="content">
      <p>A screencast on how to exchange tokens on the DutchX will follow shortly. For now, please read the <a href="#">How the DutchX works</a> section.</p>
    </section>
  </article>

{/* TOKENS - page */ }
export const Tokens = ({ handleClick }: ContentPages) =>
  <article>
    <h1>Tokens</h1>

    <section className="drawer" onClick={handleClick} id="token-pairs-currently-traded">
      <h3>Which token pairs are currently available for trading on slow.trade?</h3>
      <span>
        <p>
          To see which tokens are currently supported on slow.trade, check out the token list by clicking<strong> on either <em>Deposit</em> </strong>or<strong> <em>Receive</em> token</strong>. All tokens on the list can always be traded with ETH (or wrapped ETH).
          <br />
          Unrelated to our offering, there may be more tokens available on the smart contract level. Technical readers may refer to the documentation linked at <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">Devs & API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-pairs-can-be-traded">
      <h3>Which token pairs can be traded on the DutchX Protocol?</h3>
      <span>
        <p>
        Although we  only support the tokens listed on our slow.trade Platform, we note, for information purposes only, that all tokens compatible with the ERC20 standard may be traded on the DutchX Protocol. This is independent of and unrelated to us, d.ex OÜ and the services offered on our slow.trade Platform. For more and very detailed information, click on <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">Devs & API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-needed-to-trade">
      <h3>What token do I need to participate on the slow.trade?</h3>
      <span>
      <p>
      You do not need to own any particular token to use slow.trade! However, keep in mind that you need ETH to pay for gas costs. For more information, check out "<Link to={URLS.HOW_IT_WORKS + '#what-do-i-need-to-trade-on-dx'}>What do I need to trade a token on slow.trade</Link>"?
      </p>
    </span>
    </section>

    <section className="drawer" id="what-is-mgn" onClick={handleClick}>
      <h3>What are Magnolia (MGN)?</h3>
      <span>
        <p>
        Magnolia (MGN) tokens lower the fees on the DutchX Protocol. MGN are <strong>automatically</strong> generated and credited to users: 1 MGN is credited for trading 1 ETH worth of any whitelisted token pair (and of course trading any fraction of ETH generates the same fraction of MGN).
        <br />
        Note that MGN are locked by default in order to reduce fees for you. The locked MGN amount associated with your Wallet is <strong>only visible on slow.trade</strong>.
        <br />
        Of course, you are not required to hold any Magnolia (MGN) to participate on slow.trade or interact with the DutchX Protocol.
        <br />
        <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" id="what-are-whitelisted-tokens" onClick={handleClick}>
      <h3>What are whitelisted tokens?</h3>
      <span>
        <p>
        Whitelisted tokens are those that generate Magnolia when traded in a whitelisted pair. A whitelisted pair simply means that both tokens that are in the auction are whitelisted tokens. The idea of whitelisted tokens is that no token can be added to the DutchX Protocol with the mere intention to create Magnolia and benefit from lower fees.
        <br />
        <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="does-trade-generate-mgn">
      <h3>Does my trade generate Magnolia?</h3>
      <span>
        <p>
        Trades only generate Magnolia if both tokens traded are <Link to="#what-are-whitelisted-tokens">whitelisted</Link>. To see if a token that is tradable on slow.trade is whitelisted, check the token list by clicking on the <em>Deposit</em> or <em>Receive</em> token. Where a token is not whitelisted, the following message will be displayed: "Any auction with [Token] won't generate MGN". Once you proceed to the next screen, you will see "Note: this token pair won't generate MGN tokens".
        <br />
        <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-currently-whitelisted">
      <h3>Which tokens are currently whitelisted?</h3>
      <span>
        <p>
        To find out whether a token that is tradable on slow.trade is whitelisted, <strong>check the token list by clicking on the <em>Deposit</em> or <em>Receive</em> token.</strong> If the token is not whitelisted, you will see the following message displayed: "Any auction with [Token] won't generate MGN".
        <br />
        <em>Note that Magnolia generation is inactive for this version and no tokens are whitelisted.</em>
        </p>
      </span>
    </section>

  </article>

export const Fees = ({ handleClick }: ContentPages) =>
  <article id="fees">
    <h1>Fees</h1>

    <section className="drawer" onClick={handleClick} id="what-fees-are-due">
      <h3>What fees are due on slow.trade?</h3>
      <span>
        <p>
          <strong>No fees</strong> are levied on the slow.trade Platform. However, you will still need to pay the fees that are due on the DutchX Protocol level. For more information please see the next question.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-fees-need-to-pay">
      <h3>What fees do I have to pay to be active on the DutchX Protocol?</h3>
      <span>
        <p>
          Fee level is one of the most interesting aspects of the DutchX Protocol. If you hold enough Magnolia (MGN), your fee is 0. Fees normally start at 0.5% of your trading volume, and are gradually reduced depending on the amount of MGN you hold. <strong>Fees paid are redistributed to all users of the DutchX Protocol! </strong>
        </p>
      </span>
    </section>

    <section className="drawer" id="fee-reduction-image" onClick={handleClick}>
      <h3>How can I lower my fees?</h3>
      <span>
        <p>
          Your fees will be lowered automatically if you hold <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link> tokens. The amount by which the fees are lowered depends on how much Magnolia you hold in relation to the entire Magnolia market volume. It is based on this step function integrated within the DutchX Protocol:
        </p>
        <a href={feeReductionModel} target="_blank"><img src={feeReductionModel}/></a>
        <p>
        Note: If you want to make use of the Magnolia fee reduction mechanism, you must hold Magnolia tokens in the<strong> same Wallet</strong> that you are using for the auction.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="where-to-see-fees">
      <h3>Where do I see my fees?</h3>
      <span>
        <p>
        <strong>Your fee level is displayed on the header bar of slow.trade</strong>. Note that this figure is subject to change as the Magnolia market volume changes. For this reason, this number should be considered an estimate.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-magnolia-generation-inactive">
      <h3>What does it mean that Magnolia generation is inactive for this version?</h3>
      <span>
        <p>
        Currently no token is whitelisted to generate Magnolia and no Magnolia tokens are in circulation. When the DutchX smart contracts are released again by a decentralized autonomous organisation (a DAO), the Magnolia fee reduction will be activated. We have kept the explanatory notes for you to learn about this mechanism.
        <br/>
        Note that the absence of Magnolia does not impact the <strong>fee redistribution, which is fully functioning.</strong> All fees remain within the DutchX Protocol and go to all its users.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-get-mgn">
      <h3>How do I obtain Magnolia (MGN)?</h3>
      <span>
      <p>
        You may either generate Magnolia (MGN) by trading on the DutchX Protocol (with a whitelisted trading pair),for example via slow.trade. You will get 1 MGN for every 1ETH worth of volume traded. For more info, see the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link> (MGN).
        <br/>
        Alternatively, you may purchase MGN as they are freely tradable. This may be particularly useful if you are close to the next fee reduction level.
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-trade-mgn">
      <h3>How do I trade Magnolia?</h3>
      <span>
        <p>
        To trade MGN, you must unlock them first. After a waiting period of 24 hours, they may be traded. Unlocked MGN may be locked again to immediately make use of the fee reduction. Currently, it is not possible to trade MGN on slow.trade.
        </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-hold-mgn">
      <h3>Why is it beneficial to hold a lot of Magnolia (MGN)?</h3>
      <span>
        <p>
        <strong>Magnolia</strong> (MGN) tokens <strong>reduce your fees</strong>.The more MGN you hold as a percentage of the total MGN market volume, the lower your fee is (if within the relevant percentages). This provides an incentive to continue trading on the DutchX Protocol. Additionally, it is beneficial to be an active participant on the DutchX Protocol from the beginning, since the amount by which your fees are lowered depends on how much MGN you hold relative to the entire MGN market.
        <br/>
        <em>Note that Magnolia generation is inactive for this version and no tokens are whitelisted.</em>
        </p>
    </span>
    </section>

    <section className="drawer" id="what-are-owl" onClick={handleClick}>
      <h3>What are OWL?</h3>
      <span>
        <p>
          OWL gives the <a href={URLS.GNO_TOKEN_ETHERSCAN_URL}>GNO token</a> its utility: it is generated by locking GNO and may be used on some applications created or run by Gnosis to pay for fees. Read up on <a href={URLS.OWL_BLOG_URL}>OWL</a> and the<a href={URLS.INITIAL_OWL_GENERATION_BLOG_URL}> initial OWL generation</a>.
        <br/>
        OWL is not needed to use slow.trade or the DutchX Protocol.
        </p>
        <p>
          Note that OWL is not needed to use the DutchX.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-to-use-owl-for">
      <h3>What are OWL used for on the DutchX Protocol?</h3>
      <span>
        <p>
        You can <strong>pay for half of the fees</strong> in OWL. You will be prompted to pay fees in OWL in case you have OWL available in your Wallet. The other half of the fees, however, always has to be covered in the token you are depositing for trade.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-much-is-owl-worth">
      <h3>How much is OWL worth?</h3>
      <span>
        <p>
        OWL can be used to pay for up to <strong>1USD</strong> in fees on the DutchX Protocol.
        <br/>
        OWL may be freely traded (it is a fungible token and not personalized)
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-pay-fees-in-owl">
      <h3>Why would I want to pay my fees in OWL?</h3>
      <span>
        <p>
        First, if you are a GNO holder, you obtain OWL by locking your GNO. Second, 1 OWL can be used to pay 1 USD worth of fees (this is fixed on the DutchX Protocol). Third, it is likely cheaper as OWL may be obtained for less than 1 USD.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-pay-fees-in-owl">
      <h3>How do I use OWL to pay for fees?</h3>
      <span>
        <p>
        Slow.trade will prompt you automatically during the trading process and ask if you would like to use OWL to pay for fees. In case you approve, your selection will be valid for further transactions. If you do not approve, OWL will not be used to pay for your fees and you will be prompted again the next time.
        <br/>
        Note that you might not be prompted because you have no OWL in your Wallet! To create a better user experience for you on slow.trade, you are only prompted if you have OWL in your connected Wallet.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-to-owl-used-for-fees">
      <h3>What happens to the OWL used to pay for fees?</h3>
      <span>
        <p>
        OWL used to pay for fees are not credited to anyone! <strong>They are instead consumed ("burned")</strong>. Burning OWL means that they will be collected in a smart contract that cannot be accessed by anyone.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-pay-fees">
      <h3>How do I pay my fees?</h3>
      <span>
        <p>
        Fee payment is done automatically. Fees (or remaining fees in case you choose to partially pay with OWL) are automatically deducted from the token you are depositing for sale.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="fee-calculation">
      <h3>Step-by-step fee calculation</h3>
      <span>
        <p>Imagine you are taking part with a volume of 20 'token A.'</p>
        <br />
        <ol>
          <li>The DutchX Protocol calculates your fee level based on the MGN you hold. Let’s assume your fee level is currently 0.4%. This information is displayed in the header bar.</li>
          <li>You then owe 0.08 A tokens in fees.</li>
          <li>From this fee, you have the option to pay half in OWL (if you hold OWL in the Wallet you are participating with). If you choose to pay half in OWL, this is 0.04 A tokens. 0.04 A tokens will be translated into USD, where 1 OWL is accepted as 1 USD on the DutchX Protocol.</li>
          <li>
            The remainder of the fees is paid in token A
            <ul>
              <li>In the case of paying with OWL, the remainder is 0.08-0.04 = 0.04 A tokens.</li>
              <li>In the case of not paying in OWL; the remainder is 0.08-0 = 0.08 A tokens.</li>
            </ul>
          </li>
          <li>
            What gets deposited for you into the auction?
            <ul>
              <li>In the case of paying in OWL: 20-0.04=19.96 A tokens are placed on your behalf into the next running auction.</li>
              <li>In the case of not paying in OWL: 20-0.08=19.92 A tokens are placed on your behalf into the next running auction.</li>
            </ul>
          </li>
          <li>
            What happens to the fees paid in token A?
            <ul>
              <li>These fees get added as a sell volume to the next auction for the same token pair that runs thereafter. It is accordingly a fee-redistribution within the entire DutchX ecosystem designed to benefit you and other users! Your auction may have some prior fee funding as well.</li>
            </ul>
          </li>
        </ol>
        <a href={stepByStepFeeCalc} target="_blank"><img src={stepByStepFeeCalc} /></a>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-to-fees-paid-in-a-token">
      <h3>What happens to fees paid in a token (not in OWL)?</h3>
      <span>
        <p>
        These fees remain in the DutchX ecosystem and are redistributed among participants. Fees will be added <strong>into the next</strong> <strong>running auction</strong> for the same token pair as an extra sell volume balance.
        </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-fees-go-into-next-auction">
      <h3>Why do the fees get transferred into the next auction?</h3>
      <span>
        <p>
        Users of the DutchX Protocol (and hence of slow.trade) should be its main beneficiaries. For this reason,<strong> </strong>the fees remain in the DutchX ecosystem<strong>.</strong> This means that users, and especially frequent users, benefit from the mechanism in two ways: it lowers their fees and they are credited part of these fees!
        </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="do-i-have-to-pay-gas">
      <h3>Do I also have to pay gas?</h3>
      <span>
        <p>
        Yes. For all transactions on the Ethereum Blockchain, gas has to be paid. The amount of gas that has to be paid depends on the transaction processed on Ethereum. Gas is needed to execute your order and claim your new tokens. Your Wallet provider will provide you with a gas estimate for each transaction, and you may also choose to specify a gas price.
        </p>
      </span>
    </section>

  </article>

export const AuctionMechanisms = ({ handleClick }: ContentPages) =>
  <article>
    <h1>Auction Mechanisms</h1>
    <section className="drawer" onClick={handleClick} id="dutchx">
      <h3>DutchX</h3>
      <span>
      <p>The DutchX is a decentralized exchange for ERC20 token pairings, based on the Dutch auction principle. Taking the traditional order book model to the blockchain makes little sense: problems such as front-running are magnified in discrete time. The mechanism of the DutchX is designed such that sellers submit their tokens ahead of an auction. Then, the auction starts with a high price which falls until the market for the specific token-pairing clears. Bidders submit their bids during the auction, but pay the same final price. Hence, the dominant strategy for bidders to reveal their true willingness to pay will result in fair market prices. Coupled with a pure on-chain design, the DutchX may function as a price oracle and is also usable for other smart contracts to convert tokens. Participants benefit from the redistribution of fees within the DutchX ecosystem as well.
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-dutchx-works">
      <h3>How a Dutch auction works</h3>
      <span>
      <p>While there are some variations to the mechanism, the main concept of a Dutch auction is that it starts with a high but falling price. The first person to make a bid will purchase the auctioned item for the current price at the bidding time.
        If there are multiple fungible items in one auction (e.g. shares or tokens), then the auction only ends when all the items have been allocated to bidders and each successful bidder will receive their purchase at the same final (lowest!) price.
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-batch-auction">
      <h3>What is a batch auction?</h3>
      <span>
        <p>Instead of trading continuously, the exchange collects the sell orders as batches until the auction starts, and clear them at the end of the auction all at once.<br /><br />
        Therefore, by accumulating orders that are executed at the same time, a batch auction exchange not only represents a better price finding mechanism than an order book, but also eliminates the inherent flaw of the order book exchange: front-running.
        On the DutchX, your orders will get batched so that you benefit from these advantages (which is a reason for slow execution as well).
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="dutchx-in-detail">
      <h3>The DutchX in detail</h3>
      <span>
      <p>The DutchX for a particular token-pairing (e.g. exchange Token A for Token B) changes between two states: (i) before the particular auction starts, and (ii) when an auction is running.
        In the first state (i) sellers deposit their tokens (here: Token A). In the second state (ii), while the auction is running, bidders submit their bids (here: Token B).
        <br /><br />
        (include seller/bidder picture from this slide deck, slide 6; I don’t think there is a separate graphic for this).
        <br /><br />
        State (i) closes before state (ii) starts and hence sellers cannot deposit tokens into a running auction (these automatically go into the next auction). This means that there is a fixed amount of tokens to be auctioned off.
        <br /><br />
        This is what the second state (the auction) looks like (Token A for Token B):
        (include picture of the running auction, slide 7, there should be a graph)
        <br /><br />
        The price starts at a very high price point (twice the last closing price) and falls over time. The price falls quickly at first and slows down to decrease less rapidly. During the entire auction, bids are accepted. <strong>When the auction ends, all bidders pay the same closing price!</strong> The “price” is paid in the currency determined by the particular token-pairing. In this example, Token B was used to purchase A Token and the price is set by the exchange rate between Token A and Token B.
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick} id="auction-over-time">
      <h3>What does each auction look like over time?</h3>
      <span>
        <p>Only one auction of the same pairing is run at the same time. Note that opposite auctions (i.e. opposite auction of Token A as sellToken and Token B as bidToken is Token B as sellToken and Token A as bidToken) run at the same time (they start simultaneously and finishing at their individual times).<br /><br />
        Of course for all unique pairings the same logic is applied and those auctions run independently from one another. Each pairing goes through the stages (i) sellers deposit, (ii) bidders bid, and (iii) payouts are claimed. Over time, it looks like this:
        (include slide 9 of the slide deck; I don’t think this graphic exists in the repo)
      </p>
    </span>
    </section>

  </article>

export const MarketMarker = () =>
  <article>
    <h1>Market Maker on the DutchX</h1>

    TBD

  </article>
{/* END Market Maker on the DutchX - page */ }

{/* Listing a Token on the DutchX - page */ }
export const ListingToken = () =>
  <article>
    <h1>Listing a Token on the DutchX</h1>

    TBD

  </article>
{/* END Listing a Token on the DutchX - page */ }

{/* DutchX as an Open Platform - page */ }
export const OpenPlatform = () =>
  <article>
    <h1>DutchX as an Open Platform</h1>

    TBD

  </article>
{/* END DutchX as an Open Platform - page */ }

{/* FAQ - page */ }
export const FAQ = ({ handleClick }: ContentPages) =>
  <article id="FAQ">
    <h1>FAQ</h1>
    <section className="content">
      <p>Please read this <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">blog</a> to learn more about the motivation behind the way the DutchX was designed. Check out especially: <a href="https://blog.gnosis.pm/the-main-benefits-of-the-dutchx-mechanism-6fc2ef6ee8b4" target="_blank">Main Benefits of the DutchX Mechanism.</a></p>
    </section>
    <section className="drawer" id="what-is-erc20" onClick={handleClick}>
      <h3>What is ERC20?</h3>
      <span>
        <p>
          ERC20 is a technical token standard used for smart contracts on the Ethereum blockchain. All tokens of this standard are compatible with the DutchX. You may check <a href="https://etherscan.io/" target="_blank">Etherscan</a> for a list of <a href="https://etherscan.io/tokens" target="_blank">ERC20 Token Contracts</a>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="do-i-need-account">
      <h3>Do I need an account on the DutchX?</h3>
      <span>
        <p>
          No account is needed.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-wallets-compatible">
      <h3>Which wallets are compatible with the DutchX?</h3>
      <span>
        <p>
          Currently, the only wallet that has been tested is <a href={URLS.METAMASK} target="_blank">MetaMask</a>. Thus, the use of MetaMask is highly recommended. However, other wallet providers holding ERC20 tokens might likely be compatible but will not guarantee a flawless user experience.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="how-to-link-wallet">
      <h3>How do I link my wallet to the DutchX?</h3>
      <span>
        <p>Your wallet is automatically linked to the DutchX. In case you are not logged into your wallet, you need to log in first.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="what-if-multiple-wallets">
      <h3>What if I have multiple wallets?</h3>
      <span>
        <p>It is recommended that you hold your relevant tokens, i.e. (1) those you want to participate with in the DutchX and (2) OWL in one wallet. (3) Additionally, it is recommended that you have your locked Magnolia stored in the same wallet: don’t spread your Magnolia over more wallet addresses as they are important for reducing your fees!</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-wallet-is-linked">
      <h3>What if I have multiple wallets, which wallet is linked to the DutchX?</h3>
      <span>
        <p>It depends on which wallet connects to the browser first. If you want to participate with a different wallet, simply log out of the ones you do not want to participate with in the DutchX, and refresh your browser. Check out “Which wallets are compatible with the DutchX?”.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="need-to-know-about-wallet">
      <h3>What else do I need to know about my wallet?</h3>
      <span>
        <p>Very important—you need to have access to your private key! It's possible to send tokens to the DutchX from an address for which you do not have access to the private key. Please keep in mind that you can only claim tokens with the address you have sent tokens from!
          Furthermore, it is recommended that you always use the same wallet address in order to accumulate your fee reduction associated with that address.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-not-all-tokens-in-wallet-shown">
      <h3>Why do I not see all tokens that I hold in my wallet on the DutchX header?</h3>
      <span>
        <p>The DutchX interface only displays those tokens that you can trade on this interface.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-0.0000-shown">
      <h3>Why do I see 0.0000 of a particular token in the header of the DutchX?</h3>
      <span>
        <p>The DutchX interface only display four decimals. In case you have an available balance which is less that 0.00009, the interface will only display '0.0000'.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-browsers-compatible">
      <h3>Which browsers are compatible with the DutchX?</h3>
      <span>
        <p>
          Only browsers supported by MetaMask have been tested so far. It is highly recommended that you use one of those—<a href="https://www.google.com/chrome/" target="_blank">Chrome</a> would probably be the one that's most commonly used.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-it-safe-to-trade">
      <h3>Is it safe to trade in the DutchX?</h3>
      <span>
        <p>It is as safe as it gets! The DutchX is a non-custodial trading protocol. Your funds are only ever held in audited smart contracts. There still is a public bug bounty running and no bugs have been discovered. However, you need to make sure that you are the only one who has access to your private key! Still beware of phishing attacks.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-there-minimum-deposit">
      <h3>Is there a minimum deposit (order)?</h3>
      <span>
        <p>No, there is not.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-there-maximum-deposit">
      <h3>Is there a maximum deposit (order)?</h3>
      <span>
        <p>No, there is not.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="participate-in-more-acutions">
      <h3>Can I participate in more than one auction?</h3>
      <span>
        <p>Yes, definitely! You may participate in as many auctions as you would like. Note that for a specific token pair, there is only ever one auction running at a time. If you submit two separate orders for the same pair, and the auction had not started after your first order submission, your deposits will be placed into the same auction (and an accumulated amount will be displayed).
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="participate-more-than-once">
      <h3>Can I participate more than once in the same auction?</h3>
      <span>
        <p>Yes, definitely! This will happen automatically if you submit two separate orders for the same pair, and the auction had not started after your first order. In this case, both your deposits will be placed into the same auction (and an accumulated amount will be displayed).
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-generated">
      <h3>Why did my trade not generate Magnolia (MGN)?</h3>
      <span>
        <p>If your trade does not generate Magnolia, that is because one (or both) of the tokens part of the auction might not be whitelisted. Learn more on the topic in the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>'Magnolia'</Link> and <Link to={URLS.TOKENS + '#what-are-whitelisted-tokens'}>'whitelisted tokens'</Link>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="when-how-mgn-is-credited">
      <h3>When/how do I get Magnolia (MGN) credited?</h3>
      <span>
        <p>If your trade generated Magnolia, you are credited these automatically once you <Link to={URLS.HOW_IT_WORKS + '#how-do-i-claim-tokens'}>claim</Link> your new tokens (funds) from the auction. However, you will not see MGN as a balance in your wallet, as they are still locked. For your convenience, the amount of locked MGN is displayed in the header of the DutchX interface.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-balance-displayed">
      <h3>Why do I not see Magnolia (MGN) as a balance in my wallet?</h3>
      <span>
        <p>Magnolia are locked by default and can only then be used for fee reduction. Once you have claimed your new tokens, your MGN will be automatically credited to the wallet address used for the trade and are displayed in the header of the interface.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-in-header">
      <h3>Why can I not see my Magnolia (MGN) in the header?</h3>
      <span>
        <p>Make sure you are connected with the same wallet you participated with in the trade that generated those Magnolia (see section 'whitelisted tokens').
          It is recommended to make all trades from the same wallet exactly for this reason. The more MGN you have, the less fees you pay.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-mgn-tradable">
      <h3>Is Magnolia (MGN) tradable?</h3>
      <span>
        <p>In theory, absolutely! MGN is an ERC20 token. However, please note that MGN are locked by default in order for you to make use of the fee reduction inherent to the DutchX. MGN are fungible and not personalized. At the moment, you won't be able to unlock your MGN on this interface. However, you will be in the next version of the DutchX.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="can-claim-deposits">
      <h3>Can I claim back my deposits (before or during an auction)?</h3>
      <span>
        <p>No, you cannot. Once you have placed your deposit into an auction, you will have to wait for the next auction to run and to close before you may claim the token you receive. In other words: after the final submission (“Order Confirmation” screen with your wallet provider), you cannot cancel your order and you cannot receive your deposit back.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="unhappy-with-amount-received">
      <h3>What do I do when I am not happy with the amount received?</h3>
      <span>
        <p>Unfortunately, there is nothing to do about it. You have received the fair market price at that time.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="how-to-claim-new-tokens">
      <h3>How can I claim my new tokens (funds)?
      </h3>
      <span>
        <p>As a seller, you may claim the tokens you received once the auction has cleared. The price and your amount deposited will give you the amount of tokens you will receive. You can claim your tokens at any point after the auction clears—there is no rush! Just go back to the DutchX website, make sure you are logged into the same wallet you participated with in the auction and you will see which of your auctions have ended and where you can claim the tokens received.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="notification-to-claim">
      <h3>Can I receive a notification indicating I can claim my new tokens (funds)?
      </h3>
      <span>
        <p>Unfortunately not at this point. However, this is work in progress! For now, you will have to come back to the interface and check whether your new tokens are ready to be claimed. You will be alerted by a red “claim” button if there are claimable tokens connected to your linked wallet address.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="participate-with-fiat">
      <h3>Am I able to participate in the DutchX using fiat (e.g. USD, EUR)?
      </h3>
      <span>
        <p>Unfortunately, you cannot trade anything but <Link to={URLS.FAQ + '#what-is-erc20'}>ERC20 tokens</Link> and ETH on this interface.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="what-is-weth">
      <h3>What is wrapped Ether (W-ETH) and why do I need it?
      </h3>
      <span>
        <p>
          Ether (or "ETH")—the native currency built on the Ethereum blockchain—is not ERC20 compatible. <a href={URLS.WETH_TOKEN_URL} target="_blank">Wrapped Ether</a>, however, is Ether that is compliant with the ERC20 standard and hence can be traded on the DutchX. Keep in mind that you still need ETH to pay for your gas costs, though.
          <br />
          Wrapped Ether is worth the same as ETH and can of course be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped</a> again anytime.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="trade-eth-and-weth">
      <h3>Can I trade both Ether and wrapped Ether?
      </h3>
      <span>
        <p>
          Yes! For a smooth user experience, the interface will wrap ETH for you in case you don't have any wrapped ETH available. In this case, wrapping your ETH is the first transaction you will have to approve before proceeding with the deposit.
          <br />
          However, the <span className="underline">DutchX will not unwrap ETH for you—</span>if you exchange a token for ETH, you will always receive W-ETH. Make sure to add the W-ETH token address to your wallet: (Rinkeby Test Network: 0xc778417e063141139fce010982780140aa0cd5ab; Ethereum Mainnet: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2). W-ETH is worth the same as ETH and can be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped on many platforms</a>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-received-weth">
      <h3>I have received W-ETH instead of ETH, what happened?
      </h3>
      <span>
        <p>
          W-ETH is the ERC20 compatible version of ETH. The interface provides no unwrapping at this time. W-ETH is worth the same as ETH and can of course be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped</a> again on various platforms.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="no-claimed-eth-in-wallet">
      <h3>I have claimed my ETH, but can't find them in my wallet—what happened?
      </h3>
      <span>
        <p>
          If you exchange a token for ETH, you will always receive W-ETH in the DutchX. Thus, make sure to add the W-ETH token address to your wallet (Rinkeby Test Network: 0xc778417e063141139fce010982780140aa0cd5ab; Ethereum Mainnet: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2).
          <br />
          W-ETH is the ERC20 compatible version of ETH. Since the DutchX interface provides no unwrapping at this time, you will always receive W-ETH instead of ETH. W-ETH is worth the same as ETH and can of course be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped</a> again on various platforms.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="approve-choices-meaning">
      <h3>What does “approve this trade only” and “approve also for future trades” mean?</h3>
      <span>
        <p>
          This is a little technical and has to do with the fact that the DutchX operates on the blockchain.
          <br />
          If you choose "approve this trade only", you will approve for the DutchX to take the amount of the current trade out of your wallet. This also means that you will have to sign a transfer confirmation <span className="underline">and</span> an order confirmation for all future trades. You will spend transaction cost on each of these two separate transaction.
          <br />
          If you "approve also for future trades", you allow the DutchX to take this specific token for future trades as well. The DutchX won't take any tokens from your wallet until you confirm your order. You will use the same amount of funds, but you will save transaction costs on future trades because you will need to send fewer transactions to the blockchain going forward. In terms of transaction cost, this option is better for you. However, it carries the small risk that if the DutchX contract would be maliciously updated (there would always be a time lag and other safeguards in place), it could theoretically be re-designed to access more funds. This will certainly not happen, but every user should decide for themselves.
          <br />
          If you are unclear on this, please only approve the current trade.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-these-tokens-available">
      <h3>Why are exactly these tokens available on the interface?
      </h3>
      <span>
        <p>The curation is based on tokens for which liquidity is provided for both sides of the market. Apart from that, the token must not be considered a security by any authority, law firm, or decentralized or centralized exchange. Other developers may provide an interface enabling more/other tokens to be traded. </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="requirements-to-add-token">
      <h3>What are the requirements for a token to be part of the curated list on the DutchX?
      </h3>
      <span>
        <p>It is expected that a minimal liquidity provision is guaranteed. Apart from that, the token must not be considered a security by any authority, law firm or any decentral or central exchange. A certain market cap should also weigh in for sufficient liquidity. For more information, please <Link to={URLS.HELP}>reach out</Link>.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="best-seller-strategy">
      <h3>What is my best strategy as a seller?
      </h3>
      <span>
        <p>This is the great thing about the DutchX—you don’t need any strategy. Simply deposit (sell) your token at any point in time. It will then be placed in the next running auction. The Dutch auction mechanism is designed to incentivize a fair price finding mechanism.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-much-will-receive">
      <h3>I don’t know beforehand how much of a token I will receive —will I get the fair amount?</h3>
      <span>
        <p>You do not know exactly how much of a token you will receive when you deposit your token— the interface will only show you an estimation based on the last auction outcome. Of course, prices may be volatile (up and down) and may change until your auction closes. However, at that point in time, it will be a fair price. To ensure that right incentives are set, we have implemented a few other safeguards beyond the mere auction design: 1) auctions only start once a threshold is reached to incentivize participation, 2) the market mechanisms applied have been explained to many market makers, 3) the tokens listed on this interface were curated based on minimal liquidity provision. This ensures that the seller always obtains at least a comparable market price as s/he would on an exchange (at auction closing time).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-batch-auctions-are-applied">
      <h3>How does the DutchX apply batch auctions?</h3>
      <span>
        <p>Instead of trading continuously, the DutchX collects the sell orders as batches until the auction starts, and clears them at the end of the auction all at once.
          By accumulating orders that are executed at the same time, a batch auction not only represents a better price finding mechanism than an order book, but also eliminates the inherent flaw of the order book exchange: front-running.
          On the DutchX, your orders will get batched so that you benefit from these advantages. However, batching orders comes at the expense of speedy trading as the order execution time is slow.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="which-data-is-collected">
      <h3>Which data do you collect?</h3>
      <span>
        <p>Whenever you take part in a trade on the DutchX, transactions are stored on immutable public blockchains. For more information, please refer to the <a href="./DutchX_Rinkeby_PrivacyPolicy.pdf" target="_blank">Privacy Policy</a> in the footer.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="price-fairness">
      <h3>How can I be sure that the price I receive is fair?</h3>
      <span>
        <p>The DutchX mechanism is as fair as it gets! However, it reflects the current market price. Of course, the mechanism only works if there is a critical mass participating. This is why an automated trading service will guarantee that the price does not drop significantly below the market price of other trading platforms.
          You can safely take part in the DutchX from day one!
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-is-liquidoty-provided">
      <h3>How is liquidity provided?</h3>
      <span>
        <p>To ensure that a critical trading mass is reached and markets work well, there will be an automated trading service at the beginning, ensuring that the market price does not drop significantly below the market price of other trading platforms. Where markets develop sufficient liquidity, the automated trading service is expected to cease.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-high-are-gas-costs">
      <h3>How high will my gas costs be?</h3>
      <span>
        <p>For every transaction to the blockchain, you will incur gast costs. As an example: In order to trade a token (depositing and claiming back) it will be a total of about 175k gas. The total cost depends on the gas price you set. At 10Gwei (and an assumed ETH-USD rate of 400), this would equal 0.70 USD.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-preselected-gas-price">
      <h3>What is the preselected gas price?</h3>
      <span>
        <p>The interface does not override your wallet provider’s suggestion for a gas price. It will be using the default rate of your wallet provider. You may change it directly on your wallet provider's interface.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="which-gas-price-to-set">
      <h3>Which gas price should I set?</h3>
      <span>
        <p>For transactions that are not time critical (and for which you do not mind waiting), you can set the gas price low to save gas costs.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="high-gas-price-advantage">
      <h3>Do I have an advantage with a higher gas price?</h3>
      <span>
        <p>No, not really—the mechanism of the DutchX is to batch orders and execute them at the same clearing price. What could happen with a lower gas price is that your order then gets submitted to the subsequent auction—but the logic here is the same! Hence, the only consequence would be that claiming your new tokens will get delayed. Also note that the processing of transactions takes time, hence you might need to wait longer until your order has gone through.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="transaction-problems">
      <h3>Something has gone wrong with my transaction, what happened?</h3>
      <span>
        <p>If a transaction fails, usually your wallet provider will tell you what happened. These errors will relate to the nature of the blockchain. Possible explanations include (but are not limited to): (1) you did not have sufficient ETH to pay for your gas costs, or (2) the gas price you had set was too low and thus the transaction was not mined. However, rest assured that you will not incur a loss of funds if a transaction hasn't gone through.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-price-feed-is-used">
      <h3>What price feed is the DutchX using?</h3>
      <span>
        <p>
          The DutchX is built in such a way that only <span className="underline">one</span> external price feed is used, namely the ETH/USD price feed, derived from the reliable and accurate <a href="https://developer.makerdao.com/feeds/" target="_blank">MakerDAO</a> on-chain price feed (which is a median of many price feeds).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-price-feed-is-needed">
      <h3>What does the DutchX need the ETH/USD price feed for?</h3>
      <span>
        <p>The ETH/USD price feed is needed for three calculations: 1) the initialisation (first listing) of a token, 2) the start of an auction, and 3) the calculation of <Link to={URLS.FEES + '#fees'}>fees</Link> in USD or OWL.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="can-i-use-dutchx-code">
      <h3>Can I copy, alter, and use the code of the DutchX?</h3>
      <span>
        <p>You may do everything that is allowed based on the licenses attached to the code. This is not to be considered legal advice and no further information can be given.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-participate-as-buyer">
      <h3>How do I participate as a buyer?</h3>
      <span>
        <p>Unfortunately, there is currently no interface to participate in the bidding as development work was focused on providing this interface for you. If there is the demand for it, a bidder interface will be created in the future.
          For technical readers, check out the link for <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">DutchX for Devs & API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-in-case-of-downtime">
      <h3>What happens in case of downtime?</h3>
      <span>
        <p>Unfortunately, there is no guarantee of keeping this interface available to you at all times. If the interface is down for maintenance, it will be communicated early on.In case the site is down due to unforeseen reasons, this will be communicated via the DutchX Twitter account (@DutchX_).
          It’s important to note that funds can always be claimed: interaction with the DutchX smart contract is always possible as all the DutchX smart contracts are stored on the Ethereum blockchain.
        </p>
      </span>
    </section>

  </article>

{/* API and Technical Links - page */ }
export const Technical = () =>
  <article>
    <h1>API and Technical Links</h1>
    <section className="content">
      <p>
        <a href="#">Read API</a><br />
        <a href="#">Technical documentation </a><br />
        <a href="#">Github Repo</a><br />
        <a href="#">Listing a Token to the Smart Contract</a><br />
        <a href="#">Listing a Token to the Interface</a><br />
        <a href="#">Providing Liquidity</a>
      </p>
    </section>

  </article>

{/* Downtime and Maintenance - page */ }
export const Downtime = () =>
  <article>
    <h1>Downtime and Maintenance</h1>
    <section className="content">
      <p>Unfortunately, there is no guarantee of keeping this interface available to you. We try our best to facilitate an easy use. If we are down for maintenance, we will try to communicate this early. In case the site is down due to unforeseen reasons, we will reach out via other channels (e.g. <a href="#">twitter</a>).<br /><br />
      It’s important to note that funds can always be claimed: interactions with the DutchX smart contract is always possible as the entire DutchX smart contracts are on the Ethereum blockchain.</p>
    </section>
  </article>

{/* Help - page */ }
export const Help = () =>
  <article>
    <h1>Help</h1>
    <section className="content">
      <p>Haven’t found the answer to your question in the <Link to={URLS.FAQ + '#faqs'}>FAQ</Link>?
      <br />
      For all questions from and for developers, get in touch on the <a href={URLS.GITTER_URL} target="_blank">Gitter channel</a>.
      <br />
      If you would like to take part in the discussion, post in <a href={URLS.ETHRESEARCH_URL} target="_blank">ethresear.ch</a>.
      <br />
      To stay informed, follow <a href={URLS.DUTCHX_TWITTER_URL} target="_blank">DutchX Twitter</a>.
      </p>
    </section>
  </article>

{/* Imprint page */ }
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
