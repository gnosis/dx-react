import React from 'react'
import { URLS } from 'globals'

interface ContentPages {
  handleClick: () => any;
  handleSectionMove(sectionID: string, sectionPage?: string): () => any;
}

export const HowItWorks = ({ handleClick, handleSectionMove }: ContentPages) => (
  <article>
    <h1>How the DutchX works</h1>

    <section className="drawer" onClick={handleClick}>
      <h3>The DutchX in short</h3>
      <span>
        <p>
          The DutchX is a fully decentralized exchange for ERC-20 token pairings, based on the Dutch auction principle.
          Using this interface, you will participate in the next running auction.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
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

    <section className="drawer" onClick={handleClick}>
      <h3>How does a Dutch auction work?</h3>
      <span>
        <p>
        While there are some variations to the mechanism, the main concept of a Dutch auction is that it starts with a high but falling price.
        The first person to make a bid will purchase the auctioned item for the current price at the bidding time.
        If there are multiple fungible items in one auction (e.g. shares or tokens), then the auction only ends when all the items have been allocated to bidders. Each successful bidder will receive their purchase at the same final (lowest!) price.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What are the specific characteristics of the DutchX?</h3>
      <span>
        <p>
          There is always only one auction for a particular pair (e.g. ETH-RDN) at any point in time.
          Taking part in the DutchX has a lot of advantages: you may reduce your fees, benefit from the fees of other participants, and you will get a fair price for tokens.
          However, it comes with the drawback of slower order execution!
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How long does an auction take?</h3>
      <span>
        <p>
          The duration of an auction is unknown ahead of time. However, a typical auction is expected to run for about 6 hours (in which the bidding to take place). After 6 hours, the auction reaches the prior closing price, which serves as an indication for length and price (the last available market price). Due to potential fluctuations (especially in the realm of cryptocurrencies), the auction may close earlier or run longer. It is important to stress that the auction price reflects the current fair market price.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>When do I claim my tokens?</h3>
      <span>
        <p>
          Once you have placed the tokens that you want to sell in the auction (=submitted your deposit/order), you will take part in the next auction that runs. The next auction might start right away, or only in a couple of hours time if there is still an auction running for your chosen token pair. Once your auction has started, it might take around 6 hours to finish. Therefore, it could take some time until you can receive the tokens that you want for the trade (=claim your new tokens)—but it’s definitely worth the wait. You can be assured to get a fair price for your tokens.
          At the moment, there is no notification once your auction has closed, which means that you have to revisit this interface. A red claim button will alert you that you are able to claim your new tokens.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How do I claim my new tokens?</h3>
      <span>
        <p>
          The interface provides you with two options to claim your new tokens:
          The first option is on top of the page in Your Auctions. The red claim button shows the auctions for which you can claim tokens. If you claim your tokens via this feature, you will claim this particular token from all prior auctions you have participated in for that token pair (please note: you might need to sign two transactions with your wallet provider).
          <br/>
          <br/>
          The second option is via the specific URL for the auction pair (auction overview page). You will automatically access the URL at the end of the order process. From there, you may claim the new token particular to that specific auction (you will only need to sign one transaction with your wallet provider).
          Note that you have to be connected to the same wallet that you used to participate in the auction in order to claim your new tokens! Please also check out the <span className="sectionLink" onClick={() => handleSectionMove('step-by-step-claiming')}>step-by-step guide</span> about claiming tokens.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>When do auctions start?</h3>
      <span>
        <p>
        There is always only one auction for a particular pair (e.g. ETH-RDN) at any point in time.
        They start at least 10 minutes after the prior auction finish and only if the volume (i.e. deposit) of one of the auctions is worth more than 1,000 USD. Therefore, it is hard to estimate when exactly they will start as they depend on the prior auctions' closing time.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>When do auctions end?</h3>
      <span>
        <p>Auctions end when all deposits (<i>sellTokens</i>) have been bought and thus are allocated to bidders at the auction clearing price. The auction clearing price is the price that all <i>sellTokens</i> are traded at (i.e. <i>bidVolume</i> x price = <i>sellVolume</i>).</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
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
          <li>An <span className="sectionLink" onClick={() => handleSectionMove('what-is-erc20', URLS.FAQ)}>ERC20</span> token or ETH. To see a list of tokens that you can currently trade on this interface, click on the <i>deposit</i> or <i>receive</i> token. </li>
          <li>ETH in your wallet to pay for transactions fees (both to submit a deposit (=order) and to claim your new tokens).</li>
        </ol>
        <p>No other tokens are needed!</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
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
                Paying for fees in OWL: If you have <span className="sectionLink" onClick={() => handleSectionMove('what-are-owl', URLS.FEES)}>OWL</span> in your linked wallet, you will be asked whether you would like to pay for half of your <span className="sectionLink" onClick={() => handleSectionMove(undefined, URLS.FEES)}>fees</span> in OWL (as long as you have a positive OWL balance).
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

    <section className="drawer" onClick={handleClick}>
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
          <br/>
          The interface provides you with two different options to claim your new tokens:
        </p>
        <ul>
          <li>At the top of the page in the section <i>“Your Auctions”</i>. Clicking the claim button in the <a>Your Auctions</a> section will claim the tokens from all prior auctions of that particular pair in which you have participated. Once clicked on the red claim button, you will see your wallet provider’s screens. You may need to confirm twice (this is to claim and withdraw back to your wallet).</li>
          <li>The second option is via the specific URL for the auction pair. You will automatically access the URL at the end of the deposit process. From there, you may claim the token particularly to that specific auction. You will only need to sign once.</li>
        </ul>

        <p><strong>Important: If your trade generated <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>Magnolia (MGN)</span>, you will be credited those automatically upon claiming your new tokens. MGN are locked by default and are visible to you in the header bar of the interface.</strong></p>
        <br/>
        <p><strong>Note that you have to be connected to the same wallet that you participated with in order to claim!</strong></p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
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
          For more info, check out the section on <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>Magnolia</span>.
          In the header bar of the interface, the amount of locked MGN associated with your linked wallet is displayed. However, you will not see this amount in your wallet.
          Of course, you do not need to hold any MGN to participate in the DutchX!
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What is my fee level?</h3>
      <span>
        <p>By default, your fee level is 0.5% of your trading volume. It taken from the deposited amount. You may lower your fees by trading frequently or holding MGN. For more info, check out the <span className="sectionLink" onClick={() => handleSectionMove(undefined, URLS.FEES)}>Fee</span> section.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What does “Any auction with [Token] won’t generate MGN” mean?</h3>
      <span>
        <p>This message is to inform you about whether the token you are looking to trade generates Magnolia (which is used for fee-reduction) when you trade it. Find more information on this process <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>here</span>. You can still use the trading interface in the same manner for tokens that do and do not generate Magnolia.</p>
      </span>
    </section>

    <section className="drawer" id="claiming" onClick={handleClick}>
      <h3>What does “Note: this token pair won’t generate MGN tokens” mean?</h3>
      <span>
        <p>This message is to inform you about whether the token pair generates Magnolia (which is used for fee-reduction) when you trade it. If one token out of the pair does not generate Magnolia, the entire token pair will not generate Magnolia. You can use the trading interface in the same manner for tokens that do and do not generate Magnolia. Find more information on this <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>here</span>.
          <br />
          <br />
          Want to bid in an auction? This is currently only possible for technical participants: read <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">DutchX for Devs & API</a>.
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
      <p>A screencast on how to exchange tokens on the DutchX will follow shortly. For now, please read the <a href="#">How the DutchX works</a> section.</p>
    </section>
  </article>

{/* TOKENS - page */}
export const Tokens = ({ handleClick, handleSectionMove }: ContentPages) =>
  <article>
    <h1>Tokens</h1>

    <section className="drawer" onClick={handleClick}>
      <h3>Which token pairs are currently traded on the DutchX?</h3>
      <span>
        <p>
          Check out the token list (click on either Deposit or Receive token) to see the tokens that can be traded on this interface. All tokens on the list can always be traded with ETH (and wrapped ETH).
          <br/>
          However, there might be more tokens available on the smart contract level. Technical readers should read <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">DutchX for Devs & API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Which token pairs can be traded on the DutchX?</h3>
      <span>
        <p>
          Theoretically, all tokens compatible with the ERC20 standard may be traded on the DutchX. Before they become available to trade, they will need to be added to the DutchX. The conditions for adding tokens are defined in the smart contract governing the DutchX. For more and very detailed information, read <a href={URLS.LISTING_A_TOKEN} target="_blank">Listing a Token</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What token do I need to be active on the DutchX?</h3>
      <span>
      <p>
        You do not need to own any particular token to trade on the DutchX! However, keep in mind that you need ETH to pay for gas costs. Check out "<span className="sectionLink" onClick={() => handleSectionMove('what-do-i-need-to-trade-on-dx', URLS.HOW_IT_WORKS)}>What do I need to trade a token on the DutchX</span>"?
      </p>
    </span>
    </section>

    <section className="drawer" id="what-is-mgn" onClick={handleClick}>
      <h3>What are Magnolia (MGN)?</h3>
      <span>
        <p>
          Magnolia (MGN) tokens lower the fees on the DutchX. MGN are <span className="underline">automatically</span> generated and credited to DutchX users: one MGN is credited for trading one ETH worth of any whitelisted token pair (and of course trading any fraction of ETH generates the same fraction of MGN).
          Note that MGN are locked by default in order to reduce fees for you. The locked MGN amount associated with your wallet is <span className="underline">only visible on the interface</span>.
          Of course, it is not required to hold any Magnolia (MGN) to participate in the DutchX.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What are whitelisted tokens?</h3>
      <span>
        <p>
          Whitelisted tokens are those that generate Magnolia when traded in a whitelisted pair. A whitelisted pair simply means that both tokens that are in the auction are whitelisted tokens. The idea of whitelisted tokens is that no token can be added to the DutchX with the mere intention to create Magnolia and benefit from lower fees.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Does my trade generate Magnolia?</h3>
      <span>
        <p>
          Trades only generate Magnolia if both tokens traded are whitelisted. To see if a token that is tradable on this interface is whitelisted, check the token list by clicking on the Deposit or Receive token. You will see a message displayed if the token is not whitelisted: “Any auction with [Token] won’t generate MGN”. Once you proceed to the next screen, you will see “Note: this token pair won't generate MGN tokens” as this auction pair then will not generate Magnolia.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Which tokens are currently whitelisted?</h3>
      <span>
        <p>
          To find out whether a token that is tradable on this interface is whitelisted, check the token list by clicking on the Deposit or Receive token. You will see a message displayed if the token is not whitelisted: “Any auction with [Token] won’t generate MGN”.
          Technical readers may refer to <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank">DutchX for Devs & API</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How can a token be whitelisted?</h3>
      <span>
        <p>Please read <a href={URLS.LISTING_A_TOKEN} target="_blank">Listing a Token</a>.</p>
      </span>
    </section>

  </article>

export const Fees = ({ handleClick, handleSectionMove }: ContentPages) =>
  <article>
    <h1>Fees</h1>
    <section className="drawer" onClick={handleClick}>
      <h3>What fees do I have to pay?</h3>
      <span>
        <p>The default fee is 0.5% of your trading volume. While this might seem high at first glance, fees can be lowered down to 0%. You may also benefit from other participants’ fees, which are kept in the DutchX ecosystem.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How can I lower my fees?</h3>
      <span>
        <p>
          Your fees will be lowered automatically for you if you hold <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>Magnolia</span> tokens. The amount by which the fees are lowered depends on how much Magnolia you hold in relation to the entire Magnolia market volume. It is based on this neat step function:
        </p>
        {/*TODO: add <img id='fee-reduction-image'> */}
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
          Note: If you want to make use of the Magnolia fee reduction mechanism, you must hold Magnolia tokens in the <span className="underline">same wallet</span> that you are participating with on the DutchX.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Where do I see my fees?</h3>
      <span>
        <p>In the header bar of the interface, your fee level is displayed. Note that this is a snapshot in time and due to the changing Magnolia market volume, this number should be seen as an estimate.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How do I obtain Magnolia (MGN)?</h3>
      <span>
      <p>
        You may either generate Magnolia by trading on the DutchX (with a whitelisted trading pair). For more info, see the section on <span className="sectionLink" onClick={() => handleSectionMove('what-is-mgn', URLS.TOKENS)}>Magnolia</span>.
        Alternatively, you could also purchase MGN since they are freely tradable. This may be particularly beneficial if you are close to the <span className="sectionLink" onClick={() => handleSectionMove('fee-reduction-image')}>next fee reduction level</span>.
      </p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How do I trade Magnolia?</h3>
      <span>
      <p>To trade MGN, you must unlock them first. After a waiting period of 24 hours, they may be traded. Unlocked MGN may be locked again to immediately make use of the fee reduction model. Currently, however, this function is not yet supported by this interface but will be available in the next version.</p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Why is it beneficial to hold a lot of Magnolia?</h3>
      <span>
        <p>
          The more Magnolia you hold as a percentage of the total Magnolia market volume, the lower is your fee (if within the relevant percentages). This provides an incentive to remain on the DutchX. Additionally, it pays off to be an active participant on the DutchX from the beginning, since the amount by which your fees are lowered depends on how much Magnolia you hold relative to the entire Magnolia market.
        </p>
    </span>
    </section>

    <section className="drawer" id="what-are-owl" onClick={handleClick}>
      <h3>What are OWL?</h3>
      <span>
        <p>
          OWL gives the <a href={URLS.GNO_TOKEN_ETHERSCAN_URL}>GNO token</a> its utility: it is generated by locking GNO and may be used on some applications created or run by Gnosis to pay for fees. Read up on <a href={URLS.OWL_BLOG_URL}>OWL</a> and the<a href={URLS.INITIAL_OWL_GENERATION_BLOG_URL}> initial OWL generation</a>.
        </p>
        <p>
          Note that OWL is not needed to use the DutchX.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What are OWL used for on the DutchX?</h3>
      <span>
        <p>
          You can pay for half of the fees in OWL. You will be prompted to pay fees in OWL in case you have OWL available in your wallet. The other half of the fees, however, always have to be covered in the token you are depositing.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How much is OWL worth?</h3>
      <span>
        <p>
          OWL can be used for 1USD in fees on the DutchX.
          OWL may be freely tradable (it is a fungible token and not personalized).
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Why would I want to pay my fees in OWL?</h3>
      <span>
        <p>Firstly, if you are a GNO holder, you obtain OWL by locking your GNO. Secondly, one OWL can be used to pay one USD worth of fees (this is fixed on the DutchX). Thirdly, it is likely cheaper as the OWL may be obtained for less than one USD.</p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How do I use OWL to pay for fees?</h3>
      <span>
        <p>
          The interface will prompt you automatically during the trading process and ask if you would like to use OWL to pay for fees. In case you approve, your selection will be valid for further transactions. If you do not approve, OWL will not be used to pay for your fees and you will be prompted again the next time.
          Note that you might not be prompted because you have no OWL in your wallet! To create a great user experience for you on this interface, you are only prompted if you have OWL in your connected wallet.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What happens to the OWL used to pay for fees?</h3>
      <span>
        <p>
          OWL used to pay for fees are not credited to anyone! They are instead consumed (“burned”). Burning OWL means that they will be collected in a smart contract that cannot be accessed by anyone.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How do I pay my fees?</h3>
      <span>
        <p>
          This is all done automatically for you! Fees (or remaining fees in case you choose to partially pay with OWL) are automatically deducted from the token you are participating with on the DutchX.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Step-by-step fee calculation</h3>
      <span>
        <p>Imagine you are taking part with a volume of 20 Token A.</p>
        <br/>
        <ol>
          <li>The DutchX calculates your fee level based on the MGN you hold. Let's assume your fee level is currently 0.4%. This information is displayed in the header bar.</li>
          <li>You owe 0.8A in fee.</li>
          <li>From this fee, you have the option to pay half in OWL (if you hold OWL in the wallet you are participating with). If you choose to pay half in OWL, this is 0.4A. 0.4A will be translated into USD, where 1 OWL is accepted as 1 USD on the DutchX.</li>
          <li>
            The remainder of the fees is paid in the participating token
            <ul>
              <li>In the case of paying with OWL, the remainder is 0.8-0.4 = 0.4A.</li>
              <li>In the case of not paying in OWL; the remainder is 0.8-0 = 0.8A.</li>
            </ul>
          </li>
          <li>
            What gets deposited into the auction?
            <ul>
              <li>In the case of paying in OWL: 20-0.4=19.6 A Tokens are placed on your behalf into the next running auction.</li>
              <li>In the case of not paying in OWL: 20-0.8=19.2 A Tokens are placed on your behalf into the next running auction.</li>
            </ul>
          </li>
        </ol>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What happens to fees paid in a token (not in OWL)?</h3>
      <span>
      <p>These fees remain in the DutchX ecosystem and are redistributed among participants (mainly high-volume users will benefit from this fee redistribution model). Fees will <span className="underline">go into the next running auction</span> for the same token pair as an extra deposit-balance.</p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What is the reasoning for the fees to go into the next auction?</h3>
      <span>
      <p>Users of the DutchX should be the main beneficiaries of this decentralized trading protocol. Hence, the fees should remain in the DutchX ecosystem. This means that users, and especially frequent users, benefit as they not only lower their fees, but get credited part of the fees!</p>
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
        <p>Yes, you do! For all transactions on the Ethereum blockchain, gas has to be paid. The amount of gas cost to be paid depends on the current transactions being processed on Ethereum. Gas is needed to execute your order and claim your new tokens. Your wallet provider will provide you with a gas estimate for each transaction, and you may set a gas price.</p>
      </span>
    </section>

  </article>

export const AuctionMechanisms = ({ handleClick }: ContentPages) =>
  <article>
    <h1>Auction Mechanisms</h1>
    <section className="drawer" onClick={handleClick}>
      <h3>DutchX</h3>
      <span>
      <p>The DutchX is a decentralized exchange for ERC20 token pairings, based on the Dutch auction principle. Taking the traditional order book model to the blockchain makes little sense: problems such as front-running are magnified in discrete time. The mechanism of the DutchX is designed such that sellers submit their tokens ahead of an auction. Then, the auction starts with a high price which falls until the market for the specific token-pairing clears. Bidders submit their bids during the auction, but pay the same final price. Hence, the dominant strategy for bidders to reveal their true willingness to pay will result in fair market prices. Coupled with a pure on-chain design, the DutchX may function as a price oracle and is also usable for other smart contracts to convert tokens. Participants benefit from the redistribution of fees within the DutchX ecosystem as well.
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
      <h3>The DutchX in detail</h3>
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
    <h1>Market Maker on the DutchX</h1>

    TBD

  </article>
{/* END Market Maker on the DutchX - page */}

{/* Listing a Token on the DutchX - page */}
export const ListingToken = () =>
  <article>
    <h1>Listing a Token on the DutchX</h1>

    TBD

  </article>
{/* END Listing a Token on the DutchX - page */}

{/* DutchX as an Open Platform - page */}
export const OpenPlatform = () =>
  <article>
    <h1>DutchX as an Open Platform</h1>

    TBD

  </article>
{/* END DutchX as an Open Platform - page */}

{/* FAQ - page */}
export const FAQ = ({ handleClick }: ContentPages) =>
  <article>
    <h1>FAQ</h1>

    <section className="content">
      <p>Firstly we recommend to read the <a href="#">blog</a> as there is a lot of background information on why the exchange was build. Particularly interesting might also be the <a href="#">Main Benefits of the DutchX Mechanisms</a>.
      </p>
    </section>

    <section className="drawer" id="what-is-erc20" onClick={handleClick}>
      <h3>What is ERC20?</h3>
      <span>
        <p>
          ERC20 is a technical token standard used for smart contracts on the Ethereum blockchain. All tokens of this standard are compatible with the DutchX. You may check, e.g. Etherscan for a list of <a href="https://etherscan.io/tokens">ERC20 Token Contracts</a>.
        </p>
      </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>Which wallets are compatible?</h3>
      <span>
      <p>
        Currently the only tested wallet is Metamask. We recommend the use of Metamask. However, other wallet providers
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
        <p>
          As we run the opposite auctions at the same time, the auctions may have different closing prices. We take the weighted average (depending on the volume) to create a reliable price for the token-pairing. <br/>
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
      <h3>What price feed is the DutchX using?</h3>
      <span>
      <p>We have built our exchange in such a way that we only need to use one external price feed, namely the ETH/USD price feed. We use the price feed of DAI which can be found here. The reason for using this particular price feed is that we believe it is very reliable and accurate.</p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What does the DutchX need the ETH/USD price feed for?</h3>
      <span>
      <p>We need this for thee calculations: 1) the initialisation (first listing) of a token and 2) the starting of an auction, 3) the calculation of fees in USD or OWLs.</p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>What does the exchange got to do with prediction markets?</h3>
      <span>
      <p>The DutchX is not directly linked to our prediction market platform. However, it is a very neat mechanism to come to a fair market price. We look to implement the same price finding mechanism into our prediction markets.</p>
    </span>
    </section>

    <section className="drawer" onClick={handleClick}>
      <h3>How does it work in detail?</h3>
      <span>
        <ol>
        <li>Specify the amount of Tokens you want to sell. We will give you an estimation of how much you will receive based on the last auction’s closing price. This is only indicative! </li>
  <li>Your wallet is automatically connected and by submitting your sellTokens are added into the next auction.</li>
  <li>Once you have clicked on “submit order”, your wallet interface will pop up. You will have to a) approve the movement by the DutchX (possibly twice if you pay fees in OWLs) and b) approve the actual sellOrder itself. </li>
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
      <p>The wallet which injects into your browser last, will be automatically added. If you want to participate with another wallet, simply log out of the ones you do not want to have linked to the DutchX and refresh your browser.</p>
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
      <p>You as a seller may claim your BuyTokens once the auction has cleared. The price and your sell Volume will give you the amount of BuyTokens you will receive. You can do this at any point after the auction clears - there is no rush! Just go back to the DutchX website, make sure you are logged into the same wallet and you will see which of your auctions have ended and where you can claim the tokens.</p>
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
      It’s important to note that funds can always be claimed: interactions with the DutchX smart contract is always possible as the entire DutchX smart contracts are on the Ethereum blockchain.</p>
    </section>
  </article>

{/* Help - page */}
export const Help = ({ handleSectionMove }: ContentPages) =>
  <article>
    <h1>Help</h1>
    <section className="content">
      <p>Haven’t found the answer to your question in the <span className="sectionLink" onClick={() => handleSectionMove(undefined, URLS.FAQ)}>FAQ</span>?
      <br/>
      For all questions from and for developers, get in touch on the <a href={URLS.GITTER_URL} target="_blank">Gitter channel</a>.
      <br/>
      If you would like to take part in the discussion, post in <a href={URLS.ETHRESEARCH_URL} target="_blank">ethresear.ch</a>.
      <br/>
      To stay informed, follow <a href={URLS.DUTCHX_TWITTER_URL} target="_blank">DutchX Twitter</a>.
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
