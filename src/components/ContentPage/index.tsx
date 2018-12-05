import React from 'react'
import { URLS } from 'globals'
import { Link } from 'react-router-dom'

import 'assets/pdf/PrivacyPolicy.pdf'

import stepByStepFeeCalc from 'assets/content/step_by_step_fee_calculation.png'
import feeReductionModel from 'assets/content/fee_reduction_model_dutchX.png'
import dutchXSlowtrade from 'assets/content/dutchX_slowtrade.png'

interface ContentPages {
  handleClick?: () => any;
  network: string;
}

export const HowItWorks = ({ handleClick }: ContentPages) => (
  <article>
    <h1>How it works</h1>

    <section className="drawer active" id="what-is-slowtrade" onClick={handleClick}>
      <h3>What is <strong>slow.trade</strong></h3>
      <span>
        <p>
          <strong>Slow.trade</strong> is a graphical interface and trading platform (the "<strong>Platform</strong>"), that lets you seamlessly interact with the DutchX Decentralized Trading Protocol (the "<strong>DutchX Protocol</strong>").
        </p>
        <img src={dutchXSlowtrade} />
      </span>
    </section>

    <section className="drawer" id="what-is-dutchx" onClick={handleClick}>
      <h3>What is the DutchX then?</h3>
      <span>
        <p>
          The DutchX is a <strong>decentralized, open trading protocol</strong> for ERC20 token pairs (the "DutchX Protocol"). Using slow.trade, you will participate in the next running auction of the DutchX Protocol.
        </p>
        <p>
          It is different from other protocols or trading platforms because it uses the Dutch auction mechanism instead of an order book. This mechanism brings several benefits including the <strong>same price for all auction participants</strong>, the ability to trade in markets with low liquidity and protection against frontrunning by other users, the trading platform itself, and miners!
        </p>
        <p>
          The DutchX is not only a trading protocol, but also <strong>open source protocol that</strong> anyone can build on.
        </p>
      </span>
    </section>

    <section className="drawer" id="why-slow-but-fair" onClick={handleClick}>
      <h3>Why slow but fair?</h3>
      <span>
        <p>
          Going through the <strong>auction process</strong> simply takes time.
          A slower trading time frame ensures that there is sufficient time to collect a critical threshold amount of token deposits (ideal for low liquidity tokens!) and that the <strong>important market mechanisms</strong> function properly.
        </p>
      </span>
    </section>

    <section className="drawer" id="will-i-get-a-fair-price" onClick={handleClick}>
      <h3>Will I get a fair price?</h3>
      <span>
        <p>
          Yes!
        </p>
        <p>
          There are market economics at work to ensure this. But to put your mind at ease:
          all token trades on <strong>slow.trade</strong> will get a comparable price to other trading
          platforms, if not a better one.
        </p>
        <p>
          For more details, check out <Link to={URLS.FAQ + '#how-much-will-receive'}>"I don't know beforehand how much of a token I will
          receive —will I get the fair amount?"</Link>
        </p>
      </span>
    </section>

    <section className="drawer" id="can-i-test-it-first" onClick={handleClick}>
      <h3>Can I test it first?</h3>
      <span>
        <p>
          Yes, absolutely! We actually recommend that you first familiarize yourself with the auction mechanism on <strong>slow.trade</strong> using the <a href={`https://${URLS.APP_URL_RINKEBY}`} target="_blank" rel="noopener noreferrer">Rinkeby Testnet</a>. This allows you to interact with the DutchX Rinkeby Protocol. To do so, make sure your Metamask is set to Rinkeby.
        </p>
      </span>
    </section>

    <section className="drawer" id="how-long-auction-takes" onClick={handleClick}>
      <h3>How long does an auction take?</h3>
      <span>
        <p>
          A typical auction is expected to run for about<strong> 6 hours</strong>. After 6 hours, the auction reaches the prior closing price, which serves as an indication for length and price (the last available market price). Due to potential price fluctuations, which can often be quite significant in the cryptocurrency space, <strong>the auction may close earlier or run longer.</strong>
        </p>
      </span>
    </section>

    <section className="drawer" id="when-do-i-claim-tokens" onClick={handleClick}>
      <h3>When do I claim my tokens?</h3>
      <span>
        <p>
          Once you have placed the tokens that you want to sell in the auction by submitting your deposit, you will take part in the next auction that runs. The next auction might start right away, or in a couple of hours time if there is still an auction running for your chosen token pair. Once your auction has started, <strong>it will take around 6 hours to finish. After the auction has come to a close, you can claim your tokens</strong>. A red claim button will alert you that you are able to claim your new tokens.
        </p>
      </span>
    </section>

    <section className="drawer" id="how-do-i-claim-tokens" onClick={handleClick}>
      <h3>How do I claim my new tokens?</h3>
      <span>
        <p>
          <strong>Slow.trade</strong> provides you with two options to claim your new tokens:
        </p>
        <p>
          The first option is on <strong>top of the page in <em>Your Auctions</em></strong>. The red claim button shows the auctions for which you can claim tokens. If you claim your tokens via this feature, you will claim this particular token from <em>all</em> prior auctions you have participated in for that specific token pair (please note: you might need to sign two transactions with your Wallet provider).
        </p><br />
        <p>
          The second option is <strong>via the specific URL for the auction pair (auction overview page)</strong>. You will automatically be directed to this URL at the end of the order process. From there, you may claim the new token particular to that specific auction. Accordingly, you will only need to sign one transaction with your Wallet provider.
        </p><br />
        <p>
          Note that you have to be connected to the same Wallet that you used to participate in the auction in order to claim your new tokens! Please also check out the <Link to="#step-by-step-claiming">step-by-step guide</Link> to claim tokens.
        </p>
      </span>
    </section>

    <section className="drawer" id="when-auctions-start" onClick={handleClick}>
      <h3>When do auctions start?</h3>
      <span>
        <p>
          There is no set schedule for the auctions. However, there will never  be more than one auction running for a particular trading pair (e.g. ETH-RDN, RDN-ETH) at any point in time. They start <strong>at least 10 minutes after the last of the auction pair has finished</strong> and only if the sell volume (i.e. deposit) of one of the auction pairs is worth at least 1,000 USD. For this reason, the time of the auction depends on the prior auctions' closing time.
        </p>
      </span>
    </section>

    <section className="drawer" id="when-auctions-end" onClick={handleClick}>
      <h3>When do auctions end?</h3>
      <span>
        <strong>Auctions end when all deposits (<i>sellTokens</i>) have been bought</strong> and have subsequently been allocated to bidders at the auction clearing price. The auction clearing price is the price that all <i>sellTokens</i> are traded at (i.e. clearing price * <i>bidVolume</i> = <i>sellVolume</i>).
      </span>
    </section>

    <section className="drawer" id="which-tokens-can-trade" onClick={handleClick}>
      <h3>Which tokens can I trade?</h3>
      <span>
        <p>
          You may find the tokens available to trade in the token list on <strong>slow.trade</strong> <strong>(click on either the <i>deposit</i> or <i>receive</i> token)</strong>. Note that all listed tokens are always available to trade with ETH (or WETH), but may not yet exist as a pair with one another.
        </p>
      </span>
    </section>

    <section className="drawer" id="what-do-i-need-to-trade-on-slow.trade" onClick={handleClick}>
      <h3>What do I need to trade a token on the <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          You only need three things:
        </p><ol>

          <li>A compatible (and connected) Wallet. Currently only <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Metamask</a> is supported.</li>
          <li>An ERC20 token or ETH. To see a list of tokens that you can currently trade on <strong>slow.trade</strong>, click on the <em>deposit</em> or <em>receive</em> token.</li>
          <li>ETH in your Wallet to pay for transactions fees (both to submit a deposit (=order) and to claim your new tokens).</li></ol>

        <p>
          No other tokens are needed!
        </p>
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
          <li>Specify the amount of the token you would like to deposit (note that you will see an <strong>estimated</strong> amount of the token that you will receive in return. This estimate is based on the last closing price of the prior auction. We do not guarantee that you will receive that estimate.</li>
          <li>
            Proceed via your Wallet provider’s screens to place your deposit into the next running auction. To make this process easier to follow, tutorials are provided alongside the Wallet screens:
            <ul>
              <li>
                Wrapping ETH will be the first confirmation which you will see, but only if you need to wrap ETH (i.e. to make it ERC20 compatible). Please always confirm with your Wallet provider.
              </li>
              <li>
                Settling liquidity contribution in OWL: If you have <Link to={URLS.LIQUIDITY_CONTRIBUTION + '#what-are-owl'}>OWL</Link> in your linked Wallet, you will be asked whether you would like to settle half of the <Link to={URLS.LIQUIDITY_CONTRIBUTION + '#liquidity-contribution'}>liquidity contribution</Link> in OWL (as long as you have a positive OWL balance).
              </li>
              <li>
                Confirming the token transfer on the screen (either for this trade only or for future transaction with the same tokens).
              </li>
              <li>
                Approving the token transfer (confirm with your Wallet provider).
              </li>
              <li>
                Confirming deposit (confirm with your Wallet provider).
              </li>
            </ul>
          </li>
          <li>
            Once your deposit has been submitted, you will be provided with the auction status and a link to more information. The auction is also added to “Your Auctions” at the top of the page—no need to save the URL. Come back to <strong>slow.trade</strong> with your linked Wallet at any time to view your auctions.
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
          <strong>This is because your tokens are deposited into an auction.</strong> Only the auction clearing price will define how much tokens you are receiving. This allows a fair price finding mechanism. An estimation of how many tokens you will receive based on the last auction closing price will be provided. Your (deposit) order is essentially a safely executed market order.
        </p>
      </span>
    </section>

    <section className="drawer" id="step-by-step-claiming" onClick={handleClick}>
      <h3>Step-by-step guide to claim your new tokens:</h3>

      <span>
        <p>
          Once you have submitted your deposit and the auction round you participated in has closed, you may proceed to claim your new tokens. A red claim button will alert you on <strong>slow.trade</strong> that you can claim your <em>Receive</em> token. You should therefore revisit <strong>slow.trade</strong> frequently.
        </p>
        <p>
          <strong>Slow.trade</strong> provides you with <strong>two different options to claim your new tokens</strong>:
        </p><ul>

          <li>At the top of the page in the section <em>"Your Auctions"</em>. <strong>Clicking the claim button in the <em>Your Auctions </em>section</strong> will claim the tokens from all prior auctions of that particular pair in which you have participated and have not yet claimed. Once you have clicked on the red claim button, you will see your Wallet provider's screens. You may need to confirm twice to claim the tokens (the first confirmation is to claim and the second is to withdraw the tokens back into your Wallet).</li>
          <li>The second option is <strong>via the specific URL for the auction pair. You will automatically access the URL at the end of the deposit process.</strong> From there, you may claim the token that are particular to that specific auction. You will only need to sign once.</li></ul>

        <p>
          Important: If your trade generated <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia (MGN)</Link>, they will be credited to your Wallet automatically upon claiming your new tokens. MGN are locked by default and are visible to you in the header bar of <strong>slow.trade</strong>.
        </p>
        <p>
          Note that you have to be connected to the same Wallet that you used to participate in the auction in order to claim your new tokens!
        </p>
      </span>
    </section>

    <section className="drawer" id="what-is-in-your-auctions" onClick={handleClick}>
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
          <strong>Magnolia (MGN) is the token used for reducing your individual liquidity contribution due on the DutchX Protocol.</strong> One MGN is automatically created for every trade you make that is worth one ETH (or any fraction thereof). You will receive them automatically upon claiming your new tokens. The more you trade, the more MGN you will receive, and the lower your individual liquidity contribution.
          </p>
        <p>
          For more info, check out the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link>.
          </p>
        <p>
          In the header bar of <strong>slow.trade</strong>, the amount of locked MGN associated with your linked Wallet is displayed. However, you will not see this amount in your Wallet.
          </p>
        <p>
          Of course, you do not need to hold any MGN to participate on <strong>slow.trade</strong> or the DutchX Protocol!
          </p>
        <p>
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" id="what-is-liquidity-contribution" onClick={handleClick}>
      <h3>What is liquidity contribution?</h3>
      <span>
        <p>On the DutchX Protocol, liquidity contribution is levied on users in place of traditional fees. These do not go to us or an operator. Liquidity contribution is committed to the next running auction for the respective auction pair and are thus redistributed to you and all other users of the DutchX Protocol! It incentivises volume and use of the Protocol. Please read more in the section on <Link to={URLS.LIQUIDITY_CONTRIBUTION + '#liquidity-contribution'}>liquidity contribution</Link>.</p>
      </span>
    </section>

    <section className="drawer" id="what-is-individual-liquidity-contribution" onClick={handleClick}>
      <h3>What is my individual liquidity contribution?</h3>
      <span>
        <p>The liquidity contribution on the DutchX Protocol is variable. If you hold enough Magnolia (MGN), your individual liquidity contribution can be 0. Without a reduction, the liquidity contribution is 0.5% of your trading volume, and is gradually reduced depending on the amount of MGN you hold.</p>
      </span>
    </section>

    <section className="drawer" id="what-is-wont-generate-mgn" onClick={handleClick}>
      <h3>What does “Any auction with [Token] won’t generate MGN” mean?</h3>
      <span>
        <p>
          This message is to inform you whether the token you are looking to trade generates Magnolia (which is used for reducing your liquidity contribution) when you trade it. You can use <strong>slow.trade</strong> in the same manner for tokens that do and do not generate Magnolia.
        </p>
        <p>
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" id="claiming" onClick={handleClick}>
      <h3>What does “Note: this token pair won’t generate MGN tokens” mean?</h3>
      <span>

        <p>
          This message is to inform you about whether the token pair generates Magnolia (which is used for reducing your liquidity contribution) when you trade it. If one token out of the pair does not generate Magnolia, the entire token pair will not generate Magnolia. You can use <strong>slow.trade</strong> in the same manner for tokens that do and do not generate Magnolia.
        </p>
        <p>
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>
    <br />
    <p>
      Want to bid in an auction? This is currently only possible for technical participants on the DutchX Protocol level: read <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" rel="noopener noreferrer">Devs &amp; API</a>.
    </p>

  </article>
)

export const Tokens = ({ handleClick }: ContentPages) =>
  <article>
    <h1>Tokens</h1>

    <section className="drawer" onClick={handleClick} id="token-pairs-currently-traded">
      <h3>Which token pairs are currently available for trading on <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          To see which tokens are currently supported on <strong>slow.trade</strong>, check out the token list by clicking<strong> on either <em>Deposit</em> </strong>or<strong> <em>Receive</em> token</strong>. All tokens on the list can always be traded with ETH (or wrapped ETH).
          <br />
          Unrelated to our offering, there may be more tokens available on the smart contract level. Technical readers may refer to the documentation linked at <a href={URLS.DUTCHX_DEVS_AND_API}>Devs &amp; API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-pairs-can-be-traded">
      <h3>Which token pairs can be traded on the DutchX Protocol?</h3>
      <span>
        <p>
          Although we  only support the tokens listed on our <strong>slow.trade</strong> Platform, we note, for information purposes only, that all tokens compatible with the ERC20 standard may be traded on the DutchX Protocol. This is independent of and unrelated to us, d.ex OÜ and the services offered on our <strong>slow.trade</strong> Platform. For more and very detailed information, click on <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" rel="noopener noreferrer">Devs &amp; API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-needed-to-trade">
      <h3>What token do I need to participate on the <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          You do not need to own any particular token to use <strong>slow.trade</strong>! However, keep in mind that you need ETH to pay for gas costs. For more information, check out "<Link to={URLS.HOW_IT_WORKS + '#what-do-i-need-to-trade-on-dx'}>What do I need to trade a token on <strong>slow.trade</strong></Link>"?
      </p>
      </span>
    </section>

    <section className="drawer" id="what-is-mgn" onClick={handleClick}>
      <h3>What are Magnolia (MGN)?</h3>
      <span>
        <p>
          Magnolia (MGN) tokens lower the default liquidity contributions on the DutchX Protocol. MGN are <strong>automatically</strong> generated and credited to users: 1 MGN is credited for trading 1 ETH worth of any whitelisted token pair (and of course trading any fraction of ETH generates the same fraction of MGN).
        <br />
          Note that MGN are locked by default in order to reduce your liquidity contribution. The locked MGN amount associated with your Wallet is <strong>only visible on slow.trade</strong>.
        <br />
          Of course, you are not required to hold any Magnolia (MGN) to participate on <strong>slow.trade</strong> or interact with the DutchX Protocol.
        <br />
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" id="what-are-whitelisted-tokens" onClick={handleClick}>
      <h3>What are whitelisted tokens?</h3>
      <span>
        <p>
          Whitelisted tokens are those that generate Magnolia when traded in a whitelisted pair. A whitelisted pair simply means that both tokens that are in the auction are whitelisted tokens. The idea of whitelisted tokens is that no token can be added to the DutchX Protocol with the mere intention to create Magnolia and benefit from liquidity contribution.
        <br />
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="does-trade-generate-mgn">
      <h3>Does my trade generate Magnolia?</h3>
      <span>
        <p>
          Trades only generate Magnolia if both tokens traded are <Link to="#what-are-whitelisted-tokens">whitelisted</Link>. To see if a token that is tradable on <strong>slow.trade</strong> is whitelisted, check the token list by clicking on the <em>Deposit</em> or <em>Receive</em> token. Where a token is not whitelisted, the following message will be displayed: "Any auction with [Token] won't generate MGN". Once you proceed to the next screen, you will see "Note: this token pair won't generate MGN tokens".
        <br />
          <em>Note that Magnolia generation is inactive for this version.</em>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="token-currently-whitelisted">
      <h3>Which tokens are currently whitelisted?</h3>
      <span>
        <p>
          To find out whether a token that is tradable on <strong>slow.trade</strong> is whitelisted, <strong>check the token list by clicking on the <em>Deposit</em> or <em>Receive</em> token.</strong> If the token is not whitelisted, you will see the following message displayed: "Any auction with [Token] won't generate MGN".
        <br />
          <em>Note that Magnolia generation is inactive for this version and no tokens are whitelisted.</em>
        </p>
      </span>
    </section>

  </article>

export const LiquidityContribution = ({ handleClick }: ContentPages) =>
  <article id="liquidity-contribution">
    <h1>Liquidity contribution</h1>

    <section className="drawer" onClick={handleClick} id="what-id-liquid-contrib">
      <h3>What is liquidity contribution?</h3>
      <span>
        <p>
          On the DutchX Protocol, liquidity contribution is levied on users in place of traditional fees. These do not go to us or an operator. Liquidity contribution is committed to the next running auction for the respective auction pair and are thus redistributed to you and all other users of the DutchX Protocol! It incentivises volume and use of the Protocol.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-fees-are-due">
      <h3>Are there no fees due on <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          <strong>No fees</strong> or additional liquidity contributions are levied on the <strong>slow.trade</strong> Platform. However, you will still need to pay the liquidity contribution that isare due on the DutchX Protocol level. Note that there are no traditional fees on the DutchX protocol; rather but  the contribution levied remains in the DutchX protocol and is not extracted from the system. For more information please see the next question.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-fees-need-to-pay">
      <h3>What liquidity contribution do I have to pay to be active on the DutchX Protocol?</h3>
      <span>
        <p>
          If you hold enough Magnolia (MGN), your liquidity contributionfee is 0. The default liquidity contribution is 0.5% of your trading volume, which isand are gradually reduced depending on the amount of MGN you hold. <strong>Liquidity contributionsFees paid are redistributed to all users of the DutchX Protocol!</strong> You pay some, you gain some.
        </p>
      </span>
    </section>

    <section className="drawer" id="fee-reduction-image" onClick={handleClick}>
      <h3>How can I lower my liquidity contribution?</h3>
      <span>
        <p>
          Your liquidity contribution will be lowered automatically if you hold <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link> tokens. The amount by which the liquidity contribution are lowered depends on how much Magnolia you hold in relation to the entire Magnolia market volume. It is based on this step function integrated within the DutchX Protocol:
        </p>
        <img src={feeReductionModel} />
        <p>
          Note: If you want to make use of the Magnolia fee reduction mechanism, you must hold Magnolia tokens in the<strong> same Wallet</strong> that you are using for the auction.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="where-to-see-fees">
      <h3>Where do I see my level of liquidity contribution?</h3>
      <span>
        <p>
          <strong>Your liquidity contribution level is displayed on the header bar of slow.trade</strong>. Note that this figure is subject to change as the Magnolia market volume changes. For this reason, this number should be considered an estimate.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-magnolia-generation-inactive">
      <h3>What does it mean that Magnolia generation is inactive for this version?</h3>
      <span>
        <p>
          Currently no token is whitelisted to generate Magnolia and no Magnolia tokens are in circulation. When the DutchX smart contracts are released again by a decentralized autonomous organisation (a DAO), the Magnolia fee reduction will be activated. We have kept the explanatory notes for you to learn about this mechanism.
        <br />
          Note that the absence of Magnolia does not impact the <strong>liquidity contribution redistribution, which is fully functioning.</strong> All liquidity contributions remain within the DutchX Protocol and go to all its users.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-get-mgn">
      <h3>How do I obtain Magnolia (MGN)?</h3>
      <span>
        <p>
          You may either generate Magnolia (MGN) by trading on the DutchX Protocol (with a whitelisted trading pair),for example via <strong>slow.trade</strong>. You will get 1 MGN for every 1ETH worth of volume traded. For more info, see the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>Magnolia</Link> (MGN).
        <br />
          Alternatively, you may purchase MGN as they are freely tradable. This may be particularly useful if you are close to the next lower liquidity contribution level.
      </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-trade-mgn">
      <h3>How do I trade Magnolia?</h3>
      <span>
        <p>
          To trade MGN, you must unlock them first. After a waiting period of 24 hours, they may be traded. Unlocked MGN may be locked again to immediately make use of the liquidity contribution reduction. Currently, it is not possible to trade MGN on <strong>slow.trade</strong>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-hold-mgn">
      <h3>Why is it beneficial to hold a lot of Magnolia (MGN)?</h3>
      <span>
        <p>
          <strong>Magnolia</strong> (MGN) tokens <strong>reduce your liquidity contributions</strong>.The more MGN you hold as a percentage of the total MGN market volume, the lower your liquidity contribution is (if within the relevant percentages). This provides an incentive to continue trading on the DutchX Protocol. Additionally, it is beneficial to be an active participant on the DutchX Protocol from the beginning, since the amount by which your liquidity contributions is lowered depends on how much MGN you hold relative to the entire MGN market.
        <br />
          <em>Note that Magnolia generation is inactive for this version and no tokens are whitelisted.</em>
        </p>
      </span>
    </section>

    <section className="drawer" id="what-are-owl" onClick={handleClick}>
      <h3>What are OWL?</h3>
      <span>
        <p>
          OWL gives the <a href={URLS.GNO_TOKEN_ETHERSCAN_URL} target="_blank">GNO token</a> its utility: it is generated by locking GNO and may be used on some applications created or run by Gnosis to pay for fees or in the case of the DutchX protocol to settle parts of the liquidity contribution due. Read up on <a href={URLS.OWL_BLOG_URL} target="_blank">OWL</a> and the<a href={URLS.INITIAL_OWL_GENERATION_BLOG_URL} target="_blank"> initial OWL generation</a>.
        <br />
          OWL is not needed to use <strong>slow.trade</strong> or the DutchX Protocol.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-to-use-owl-for">
      <h3>What are OWL used for on the DutchX Protocol?</h3>
      <span>
        <p>
          You can <strong>settle half of the liquidity contribution</strong> in OWL. You will be prompted to pay in OWL in case you have OWL available in your Wallet. The other half of the liquidity contribution, however, always has to be covered in the token you are depositing for trade.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-much-is-owl-worth">
      <h3>How much is OWL worth?</h3>
      <span>
        <p>
          1 OWL can be used to pay for the equivalent of <strong>1 USD</strong> of liquidity contribution on the DutchX Protocol.
        <br />
          OWL may be freely traded (it is a fungible token and not personalized).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-pay-fees-in-owl">
      <h3>Why would I want to settle my liquidity contribution in OWL?</h3>
      <span>
        <p>
        First, if you are a GNO holder, you obtain OWL by locking your GNO. Second, 1 OWL can be used to pay 1 USD worth of liquidity contribution (this is fixed on the DutchX Protocol). Third, it is likely cheaper as OWL may be obtained for less than 1 USD.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-pay-fees-in-owl">
      <h3>How do I use OWL to partially settle my liquidity contribution?</h3>
      <span>
        <p>
        <strong>Slow.trade</strong> will prompt you automatically during the trading process and ask if you would like to use OWL to partially settle your liquidity contribution. In case you approve, your selection will be valid for further transactions. If you do not approve, OWL will not be used to partially settle your liquidity contribution and you will be prompted again the next time.
        <br />
        Note that you might not be prompted because you have no OWL in your Wallet! To create a better user experience for you on <strong>slow.trade</strong>, you are only prompted if you have OWL in your connected Wallet.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-to-owl-used-for-fees">
      <h3>What happens to the OWL used to partially settle the liquidity contribution?</h3>
      <span>
        <p>
          OWL used to pay for fees are <strong>not credited</strong> to anyone! <strong>They are instead consumed ("burned")</strong>. Burning OWL means that they will be collected in a smart contract that cannot be accessed by anyone.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-pay-fees">
      <h3>How do I settle my liquidity contribution?</h3>
      <span>
        <p>
        The liquidity contribution is done <strong>automatically</strong>. The liquidity contribution(or remaining level in case you choose to partially settle with OWL) are automatically deducted from the token you are depositing for sale.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="fee-calculation">
      <h3>Step-by-step calculation of your liquidity contribution</h3>
      <span>
        <p>Imagine you are taking part with a volume of 20 'token A.'</p>
        <br />
        <ol>
          <li>The DutchX Protocol calculates your liquidity contribution level based on the MGN you hold. Let’s assume your level is currently 0.4%. This information is displayed in the header bar.</li>
          <li>You then owe 0.08 A tokens in liquidity contribution.</li>
          <li>From this liquidity contribution, you have the option to settle half in OWL (if you hold OWL in the Wallet you are participating with). If you choose to settle half in OWL, this is 0.04 A tokens. 0.04 A tokens will be translated into USD, where 1 OWL is accepted as 1 USD on the DutchX Protocol.</li>
          <li>
            The remainder of the liquidity contribution is levied in token A
            <ul>
              <li>In the case of partially settling in OWL, the remainder is 0.08-0.04 = 0.04 A tokens.</li>
              <li>In the case of not settling in OWL; the remainder is 0.08-0 = 0.08 A tokens.</li>
            </ul>
          </li>
          <li>
            What gets deposited for you into the auction?
            <ul>
              <li>In the case of partially settling in OWL: 20-0.04=19.96 A tokens are placed on your behalf into the next running auction.</li>
              <li>In the case of not settling in OWL: 20-0.08=19.92 A tokens are placed on your behalf into the next running auction.</li>
            </ul>
          </li>
          <li>
            What happens to the liquidity contribution made in token A?
            <ul>
              <li>All liquidity contributions get added as a sell volume to the next auction for the same token pair that runs thereafter. It is accordingly a redistribution within the entire DutchX ecosystem designed to benefit you and other users! The auction you are participating in may also have some amount of previously collected liquidity contribution, which you are profiting from!</li>
            </ul>
          </li>
        </ol>
        <img src={stepByStepFeeCalc} />
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-to-fees-paid-in-a-token">
      <h3>What happens to liquidity contributions made in a token (not in OWL)?</h3>
      <span>
        <p>
        These contributions remain in the DutchX ecosystem and are redistributed among participants. Contributions will be added into the <strong>next running auction</strong> for the same token pair as an extra sell volume balance.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-fees-go-into-next-auction">
      <h3>Why do the liquidity contributions get transferred into the next auction?</h3>
      <span>
        <p>
        Users of the DutchX Protocol (and hence of slow.trade) should be its main beneficiaries. For this reason, the contributions  remain in the DutchX ecosystem. This means that users, and especially frequent users, benefit from the mechanism in two ways: it lowers their individual liquidity contribution and they are credited part of others’ liquidity contributions!
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

export const FAQ = ({ handleClick }: ContentPages) =>
  <article id="FAQ">
    <h1>FAQ</h1>
    <section className="content">
      <p>
        Please read this <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">blog</a> to learn more about the motivation behind the way the DutchX Protocol was designed. For further information and the terms and conditions that apply to the use of our <strong>slow.trade</strong> Platform, please always consult the <Link to="/terms">Terms & Conditions</Link>. Capitalized terms used but not defined here, have the respective meanings given to them in the Terms and Conditions.
      </p>
    </section>

    <section className="drawer" id="what-is-erc20" onClick={handleClick}>
      <h3>What is ERC20?</h3>
      <span>
        <p>
          ERC20 is a technical token standard used for smart contracts on the Ethereum Blockchain. All tokens of this standard are compatible with the DutchX Protocol. You may check <a href="https://etherscan.io/" target="_blank">Etherscan</a> for a list of <a href="https://etherscan.io/tokens" target="_blank">ERC20 Token Contracts</a>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="do-i-need-account">
      <h3>Do I need an account on <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          No account is needed.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-wallets-compatible">
      <h3>Which wallets are compatible with <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          Your wallet needs to be compatible to the <strong>slow.trade</strong> Platform (a "<strong>Wallet</strong>"). Currently, the only Wallet that has been tested is <strong><a href={URLS.METAMASK} target="_blank">Metamask</a></strong>. Thus, using Metamask is highly recommended. However, other wallet providers holding ERC20 tokens might also be compatible but may result in a less smooth user experience.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="how-to-link-wallet">
      <h3>How do I link my wallet to <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          Your Wallet is automatically linked to <strong>slow.trade</strong>. In case you are not logged into your Wallet, you need to log in first.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="what-if-multiple-wallets">
      <h3>What if I have multiple Wallets?</h3>
      <span>
        <p>
          We recommend that you <strong>hold your relevant tokens,</strong> i.e. (1) <strong>those you want to trade with </strong>and (2) any <strong>OWL tokens</strong> you have in one Wallet. (3) Additionally, we recommend that you have your locked <strong>Magnolia</strong> (MGN) stored in the <strong>same Wallet</strong>. In other words, we strongly advise that you don't spread your Magnolia over many Wallet addresses as they are important for reducing your liquidity contribution!
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-wallet-is-linked">
      <h3>What if I have multiple Wallets, which Wallet is linked to <strong>slow.trade</strong>?</h3>
      <span>
        <p>It depends on which Wallet connects to the browser first. If you want to participate with a different Wallet, simply log out of the ones you do not want to use, and refresh your browser. Check out <Link to="#which-wallets-compatible">"Which wallets are compatible with <strong>slow.trade</strong>?"</Link>.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="need-to-know-about-wallet">
      <h3>What else do I need to know about my Wallet?</h3>
      <span>
        <p>
          Very important—<strong>you need to have access to your private key!</strong> It's possible to send tokens to the DutchX Protocol from an address for which you do not have access to the private key. Please keep in mind that you can only claim tokens with the address you have sent tokens from!
        <br />
          Furthermore, it is recommended that you <strong>always use the same Wallet address</strong> in order to optimize the reduction of your liquidity contribution associated with that Wallet address.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-not-all-tokens-in-wallet-shown">
      <h3>Why do I not see all tokens that I hold in my Wallet on the <strong>slow.trade</strong> header?</h3>
      <span>
        <p>The <strong>slow.trade</strong> interface only displays the listed tokens you can trade through our Platform interface.</p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-0.0000-shown">
      <h3>Why do I see 0.0000 of a particular token in the header of <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          The <strong>slow.trade</strong> interface only displays four decimals. In case you have an available balance which is less than 0.0001, the interface will only display '0.0000'.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="which-browsers-compatible">
      <h3>Which browsers are compatible with <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          Only browsers supported by Metamask have been tested so far. It is highly recommended that you use a browser that is Metamask compatible. <a href="https://www.google.com/chrome/" target="_blank">Chrome</a> is likely the most popular browser that supports Metamask.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-it-safe-to-trade">
      <h3>Is it safe to trade on the DutchX Protocol?</h3>
      <span>
        <p>
          We think it is as safe as it gets! The DutchX is a non-custodial trading Protocol. Your funds are only ever held in audited smart contracts. Our public bug bounty has yet to uncover any system bugs. However, you need to make sure that you are the only one who has access to your private key! Always beware of phishing attacks.
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
        <p>
          Yes, definitely! You may participate in as many auctions as you would like. Note that for a specific token pair, there is only ever one auction running at a time. If you submit two separate orders for the same pair, and after your first order submission the auction had not yet started, your deposits will be placed into the same auction (and an accumulated amount will be displayed).
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="participate-more-than-once">
      <h3>Can I participate more than once in the same auction?</h3>
      <span>
        <p>
          Yes, definitely! If you submit more than one order for the same trading pair before an auction has started, then all of those deposits will be entered into the same auction and the accumulated amount of deposits will be displayed.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-generated">
      <h3>Why did my trade not generate Magnolia (MGN)?</h3>
      <span>
        <p>
          If your trade does not generate Magnolia, that is <strong>because one (or both) of the tokens part of the auction are not whitelisted.</strong> Learn more on the topic in the section on <Link to={URLS.TOKENS + '#what-is-mgn'}>'Magnolia'</Link> and <Link to={URLS.TOKENS + '#what-are-whitelisted-tokens'}>'whitelisted tokens'</Link>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="when-how-mgn-is-credited">
      <h3>When/how do I get Magnolia (MGN) credited?</h3>
      <span>
        <p>
          If your trade generated Magnolia, they are credited to you <strong>automatically</strong> once you claim your new tokens from the auction. However, you will not see MGN as a balance in your Wallet, as they will still be locked. For your convenience, the amount of locked MGN is displayed in the header of <strong>slow.trade</strong>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-balance-displayed">
      <h3>Why do I not see Magnolia (MGN) as a balance in my Wallet?</h3>
      <span>
        <p>
          This is because Magnolia are locked by default as they can only be used for the reduction of your liquidity contribution level when they are locked. Once you have claimed your new tokens, your MGN will be automatically credited to the wallet address used for the trade and displayed in the header of our interface.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-no-mgn-in-header">
      <h3>Why can't I see my Magnolia (MGN) in the header?</h3>
      <span>
        <p>
          <strong>Make sure you are connected to the same Wallet you participated with</strong> in the trade that generated those MGN (see section 'whitelisted tokens').
        <br />
          It is recommended to make all trades from the same Wallet for this reason. The more MGN you have, the less liquidity contribution is levied.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="is-mgn-tradable">
      <h3>Is Magnolia (MGN) tradable?</h3>
      <span>
        <p>
          Yes. MGN is an ERC20 token. However, MGN are locked by default in order for you to make use of the reduction of your liquidity contribution level inherent to the DutchX Protocol. MGN are fungible and not personalized. At the moment, you won't be able to unlock your MGN on <strong>slow.trade</strong>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="can-claim-deposits">
      <h3>Can I claim back my deposits (before or during an auction)?</h3>
      <span>
        <p>
          <strong>No, you cannot.</strong> Once you have placed your deposit into an auction, you will have to wait for the next auction to run <strong>and</strong> to close before you may claim your new tokens. In other words: after the final submission ("Order Confirmation" screen with your Wallet provider), you cannot cancel your order and you will not be able to get your deposit back.(as per design of the DutchX Protocol). This can be advantageous because o no gas costs incur due to cancelling orders.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="when-is-order-final">
      <h3>When is my order final?</h3>
      <span>
        <p>
          When you have gone through the last screen on <strong>slow.trade</strong> you have to click on "<strong>submit deposit</strong>" before you're directed through your Wallet provider's screens. This is the last step before your order is final. After this point there are no refunds for submitted amounts.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="unhappy-with-amount-received">
      <h3>What do I do when I am not happy with the amount received?</h3>
      <span>
        <p>
          Unfortunately, there is nothing to do about it. You have received the fair market price at that time.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="how-to-claim-new-tokens">
      <h3>How can I claim my new tokens (funds)?</h3>
      <span>
        <p>
          As a seller, you may claim the tokens you received once the auction has cleared. The price and your amount deposited will give you the amount of tokens you will receive. There is no rush - you can claim your tokens at any point after the auction has cleared! Just come back to <strong>slow.trade</strong> and, make sure you are logged into the same Wallet you participated with in the auction and you will see which of your auctions have ended and where you can claim the tokens received.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="notification-to-claim">
      <h3>Can I receive a notification indicating I can claim my new tokens (funds)?</h3>
      <span>
        <p>
          Unfortunately not at this point. However, this is work in progress! For now, you will have to come back to <strong>slow.trade</strong> and check whether your new tokens are ready to be claimed. You will be alerted by a red "claim" button if there are claimable tokens connected to your linked Wallet address.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="participate-with-fiat">
      <h3>Am I able to participate on <strong>slow.trade</strong> using fiat (e.g. USD, EUR)?</h3>
      <span>
        <p>
          No, you can only trade listed ERC20 tokens and ETH on <strong>slow.trade</strong> and the DutchX Protocol.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="what-is-weth">
      <h3>What is wrapped Ether (W-ETH) and why do I need it?</h3>
      <span>
        <p>
          Ether (or "ETH")—the native currency built on the Ethereum blockchain—is not ERC20 compatible. <a href={URLS.WETH_TOKEN_URL} target="_blank">Wrapped Ether</a>, however, is <strong>Ether that is compliant with the ERC20 standard and hence can be traded on the DutchX</strong> <strong>Protocol</strong>. Keep in mind that you still need ETH to pay for your gas costs, though.
        <br />
          Wrapped Ether is worth the same as ETH and can be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped</a> again anytime.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="trade-eth-and-weth">
      <h3>Can I trade both Ether and wrapped Ether?</h3>
      <span>
        <p>
          Yes! For a smooth user experience, the interface will wrap ETH for you in case you don't have any wrapped ETH available. In this case, wrapping your ETH is the first transaction you will have to approve before proceeding with the deposit.
          <br />
          However, <strong>slow.trade</strong> <strong>will not unwrap ETH for you</strong>: If you trade a token for ETH, you will always receive W-ETH. Make sure to add the W-ETH token address to your Wallet: (Rinkeby Test Network: 0xc778417e063141139fce010982780140aa0cd5ab; Ethereum Mainnet: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2). W-ETH is worth the same as ETH and can be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped on many other trading platforms</a>.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="why-received-weth">
      <h3>I have received W-ETH instead of ETH, what happened?
      </h3>
      <span>
        <p>
          W-ETH is the ERC20 compatible version of ETH. Our interface provides no unwrapping at this time. W-ETH is worth the same as ETH and can of course be <a href="https://weth.io/" target="_blank">unwrapped</a> again on various other trading platforms.
        </p>
      </span>
    </section>
    <section className="drawer" onClick={handleClick} id="no-claimed-eth-in-wallet">
      <h3>I have claimed my ETH, but can't find them in my wallet—what happened?</h3>
      <span>
        <p>
          If you trade a token for ETH on <strong>slow.trade</strong>, <strong>you will always receive W-ETH. </strong>Make sure to add the W-ETH token address to your Wallet (Rinkeby Test Network: 0xc778417e063141139fce010982780140aa0cd5ab; Ethereum Mainnet: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2).
        <br />
          W-ETH is the ERC20 compatible version of ETH. Since <strong>slow.trade</strong> provides no unwrapping at this time, you will always receive W-ETH instead of ETH. W-ETH is worth the same as ETH and can be <a href={URLS.WETH_TOKEN_URL} target="_blank">unwrapped</a> back to ETH on various other trading platforms.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="approve-choices-meaning">
      <h3>What does "approve this trade only" and "approve also for future trades" mean?</h3>
      <span>
        <p>
          This is a little technical and has to do with the fact that the DutchX Protocol operates on the Ethereum Blockchain.
          <br />
          If you choose <strong>"approve this trade only", you will approve for the DutchX Protocol to take the amount of the current trade from your Wallet</strong>. This also means that you will have to sign a transfer confirmation <strong>and</strong> an order confirmation for all future trades. You will spend transaction cost on each of these two separate transaction.
          <br />
          If you <strong>"approve also for future trades", you allow the DutchX Protocol to take this specific token for future trades as well.</strong> The DutchX Protocol won't take any tokens from your Wallet until you confirm your order. You will use the same amount of funds, but you will save transaction costs on future trades because you will need to send fewer transactions to the Ethereum Blockchain going forward. This option is cheaper in terms of overall transaction costs. However, it carries the risk that if the DutchX Protocol would be maliciously updated, it could theoretically be re-designed to access more funds. This is unlikely to happen, but every user should decide for themselves. We do not provide any guarantees.
          <br />
          If you are in doubt, please only approve the current trade.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-these-tokens-available">
      <h3>Why are only these tokens available on <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          We support tokens <strong>for which liquidity is provided for both sides of the market and from projects with which we are familiar and where we see no regulatory hurdles to offer them on our Platform.</strong> We plan to add more tokens over time. Other developers may provide an interface enabling more/other tokens to be traded.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="requirements-to-add-token">
      <h3>What are the requirements for a token to be part of the curated list on <strong>slow.trade</strong>?</h3>
      <span>
        <p>
          It is expected that a<strong> minimal liquidity is guaranteed.</strong> Apart from that, there must be no regulatory hurdle following our assessment. Among other things, the <strong>token must not be considered a security, financial instrument or equivalent </strong>by any authority, law firm or decentralized or centralized exchange. A relatively high market cap is often a good indicator  of sufficient liquidity. For more information, please reach out to us.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="best-seller-strategy">
      <h3>What is my best strategy as a seller?</h3>
      <span>
        <p>
          This is the great thing about the DutchX Protocol—<strong>you don't need a strategy.</strong> Simply deposit (sell) your token at any point in time. It will then be placed in the next running auction. The Dutch auction mechanism is designed to ensure a fair price finding mechanism.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-much-will-receive">
      <h3>I don't know beforehand how many tokens will receive —will I get a fair amount?</h3>
      <span>
        <p>
          You do not know exactly how many tokens you will receive when you make your deposit — our interface will only show you an estimation based on the last auction outcome for the same token pair. Of course, prices are often volatile and may change during the auction. However, at that point in time, it will be a fair price. To ensure that the right incentives are set, we have implemented a few other safeguards beyond the mere auction design: 1) auctions only start once a threshold is reached to incentivize participation, 2) the market mechanisms applied have been explained to many market makers, 3) the supported tokens listed on this interface were curated based on minimal liquidity provision. This ensures that the seller always obtains at least a comparable market price as s/he would on other trading platforms (at auction closing time).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-dutch-auction-works">
      <h3>How does a Dutch auction work?</h3>
      <span>
        <p>
          While there are some variations to the mechanism, the main concept of a Dutch auction is that it starts with a high price that gradually decreases. The first person to make a bid will purchase the auctioned item for the current price at the bidding time.
        <br />
          If there are multiple assets in one auction (e.g. shares or tokens), the auction will only end when all the items have been allocated to participating bidders. <strong>Each successful bidder will receive their purchase at the same final (lowest) price.</strong>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-batch-auctions-are-used">
      <h3>How does the DutchX Protocol use batch auctions?</h3>
      <span>
        <p>
          Instead of trading continuously, t<strong>he DutchX Protocol collects the sell orders as batches until the auction starts, and clears them at the end of the auction all at once.</strong>
          <br />
          By accumulating orders that are executed at the same time, a batch auction not only represents a better price finding mechanism than an order book, but also eliminates the inherent flaw of the order book exchange: front-running. However, batching orders comes at the expense of speedy trading as order execution time is slow.
          <br />
          Through <strong>slow.trade</strong>, we provide you with a Platform to interact with the DutchX Protocol.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-inactive-auction">
      <h3>What is an inactive auction?</h3>
      <span>
        <p>
          You will see the notice about an "inactive" auction only in the auction overview page if you stumble across an auction which has zero volume but for which the opposite auction is currently running.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="which-data-is-collected">
      <h3>Which data do you collect?</h3>
      <span>
        <p>
          Whenever you take part in a trade on the DutchX Protocol, transactions are stored on the Ethereum Blockchain, which is public and immutable. For more information, please refer to the <a href="./PrivacyPolicy.pdf" target="_blank">Privacy Policy</a>.
          </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="deposit-is-not-stuck">
      <h3>How can I be sure that my deposit is not stuck?</h3>
      <span>
        <p>
          For tokens listed on our <strong>slow.trade</strong> interface, minimum liquidity is guaranteed and the next auction will start without time delay.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="price-fairness">
      <h3>How can I be sure that the price I receive is fair?</h3>
      <span>
        <p>
          The DutchX mechanism is as fair as it gets! However, it reflects the current market price. Of course, the mechanism only works if there is a critical mass participating. This is why<strong> an automated trading service for tokens listed on slow.trade will guarantee that the price does not drop significantly below the market price of other trading platforms. </strong>
          <br />
          On <strong>slow.trade</strong>, you can safely take part in the DutchX Protocol from day one!
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-is-liquidoty-provided">
      <h3>How is liquidity provided?</h3>
      <span>
        <p>
          To ensure that a critical trading mass is reached and markets work well,<strong> there will, at the beginning, be an automated trading service for tokens listed on slow.trade. This ensures that the market price does not drop significantly below the market price of other trading platforms</strong>. When markets on <strong>slow.trade</strong> develop sufficient liquidity, the automated trading service is expected to cease.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-high-are-gas-costs">
      <h3>How high will my gas costs be?</h3>
      <span>
        <p>For every transaction on the Ethereum Blockchain, you will incur a small 'gas' fee. For example, in order to trade a token (depositing and claiming back) it will usually cost about 175k gas. The total cost depends on the gas price you set (and the ETH price of course).</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-is-preselected-gas-price">
      <h3>What is the preselected gas price?</h3>
      <span>
        <p>
          <strong>Slow.trade</strong> does not override your Wallet provider's suggestion for a gas price. It will be using the default rate of your Wallet provider. <strong>You may change it directly on your Wallet provider's interface. </strong>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="which-gas-price-to-set">
      <h3>Which gas price should I set?</h3>
      <span>
        <p>
          For transactions that are not time critical (and for which you do not mind waiting), <strong>you can set the gas price low to save gas costs.</strong>
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="high-gas-price-advantage">
      <h3>Do I have an advantage if I set a higher gas price?</h3>
      <span>
        <p>
          No, not really—the mechanism of the DutchX Protocol is to batch orders and execute them at the same clearing price. With a lower gas price, your order might miss the cut-off of one auction start (if it is just about to start) and will consequently be deposited into the following auction (you can never deposit into a running auction)—but the logic in that auction is the same! You may then have to wait longer to finalise your trade. In other words, the only consequence would be that claiming your new tokens will get delayed. Moreover, the processing of transactions takes time, so you might need to wait longer until your order has gone through.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="transaction-problems">
      <h3>Something has gone wrong with my transaction, what happened?</h3>
      <span>
        <p>
          If a transaction fails, usually your Wallet provider will tell you what happened. These errors will relate to the nature of the Ethereum Blockchain. Possible explanations include (but are not limited to): (1) you did not have sufficient ETH to pay for your gas costs, or (2) the gas price you had set was too low and thus the transaction was not mined. However, you will not incur a loss of funds if a transaction hasn't gone through.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-price-feed-is-used">
      <h3>What price feed is the DutchX Protocol using?</h3>
      <span>
        <p>
          The DutchX Protocol is built in such a way that only <strong>one</strong> external price feed is used, namely the ETH/USD price feed. This feed is derived from the <a href="https://developer.makerdao.com/feeds/" target="_blank" rel="noopener noreferrer">MakerDAO</a> on-chain price feed (which is a median of many price feeds).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="why-price-feed-is-needed">
      <h3>Why does the DutchX Protocol need the ETH/USD price feed?</h3>
      <span>
        <p>
          The ETH/USD price feed is needed for three calculations: 1) the initialisation (first listing) of a token, 2) the start of an auction, and 3) the calculation of liquidity contribution in USD or OWL.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="how-to-participate-as-buyer">
      <h3>How do I participate as a bidder?</h3>
      <span>
        <p>
          There is currently no interface for participating as a bidding. If there is the demand for it, a bidder interface will be created in the future.
          <br />
          For technical readers, check out the link for <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" rel="noopener noreferrer">Devs &amp; API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick} id="what-happens-in-case-of-downtime">
      <h3>What happens in case of downtime?</h3>
      <span>
        <p>
          We do not guarantee to keep this interface available to you at all times. If <strong>slow.trade</strong> is scheduled for maintenance, we will communicate this within a reasonable time frame. In case the site is down due to unforeseen reasons, we will try our best to be back up and running as soon as possible.
        <br />
          <strong>It's important to note that funds can always be claimed, even if slow.trade is down. In other words,</strong> interaction with the DutchX Protocol is always possible as all the DutchX smart contracts are stored on the Ethereum Blockchain.
        </p>
      </span>
    </section>

  </article >

export const Help = ({ network }: ContentPages) =>
  <article>
    <h1>Help</h1>
    <section className="content">
      <p>Haven’t found the answer to your question in the <Link to={URLS.FAQ + '#faqs'}>FAQ</Link>?
      <br />
        For all questions from and for developers, check out the resources available on <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" rel="noopener noreferrer">Devs &amp; API</a>.
      {network === 'MAIN' &&
          <>
            <br /><br />
            You may also reach us at <a href="mailTo: support@slow.trade">support@slow.trade</a>
            <br /><br />
            For press requests, please contact <a href="mailTo: press@slow.trade">press@slow.trade</a>
          </>}
      </p>
    </section>
  </article>

// NOT USED RIGHT NOW
export const Screencast = () =>
  <article>
    <h1>Screencast</h1>
    <section className="content">
      <p>A screencast on how to exchange tokens on the DutchX will follow shortly. For now, please read the <a href="#">How the DutchX works</a> section.</p>
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
export const ListingToken = () =>
  <article>
    <h1>Listing a Token on the DutchX</h1>

    TBD

  </article>
export const OpenPlatform = () =>
  <article>
    <h1>DutchX as an Open Platform</h1>

    TBD

  </article>
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
export const Downtime = () =>
  <article>
    <h1>Downtime and Maintenance</h1>
    <section className="content">
      <p>Unfortunately, there is no guarantee of keeping this interface available to you. We try our best to facilitate an easy use. If we are down for maintenance, we will try to communicate this early. In case the site is down due to unforeseen reasons, we will reach out via other channels (e.g. <a href="#">twitter</a>).<br /><br />
        It’s important to note that funds can always be claimed: interactions with the DutchX smart contract is always possible as the entire DutchX smart contracts are on the Ethereum blockchain.</p>
    </section>
  </article>
