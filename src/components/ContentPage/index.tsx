import React from 'react'

const ContentPage: React.SFC = () => (
  <div className="contentPage">
    <article>
    <h1>Fees</h1>
    <h2>[Section subtitle]</h2>

<section className="drawer">
  <h3>What fees do I have to pay?</h3>
  <p>Both sellers and bidders pay the same amount of fees which equals <strong>0.5%</strong> of their trading volume. However, fees can be lowered down to <strong>0%</strong>.</p>
</section>

<section className="drawer active">
<h3>How can I lower my fees?</h3>
<p>In fact, the fee will be lowered automatically if you hold Magnolia tokens. The amount by which the fee is lowered depends on how much Magnolia you hold in relation to the entire Magnolia market volume. It is based on this neat step function:

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

Note: If you want to make use of the Magnolia fee reduction mechanism, you must hold Magnolia tokens in the same wallet that you are participating with on the DutchX .
Magnolia tokens are inflationary as the creation is based on the volume traded on the Dutch Exchange—there is no mechanism to diminish their volume.
</p>
</section>

<section className="drawer">
<h3>Where can I see my fee level?</h3>
<p>On the header of the interface, the approximate fee level is provided for your convenience. Note that this is a snapshot in time and due to the changing Magnolia market, this number should be viewed as an approximation.</p>
</section>

<section className="drawer">
<h3>How do I obtain Magnolia?</h3>
<p>You may either generate Magnolia by trading on the DutchX (within a whitelisted trading pair): 1 MGN (or fraction of MGN) is generated and automatically attributed for every 1 ETH (or fraction of ETH) worth of trade.
Or alternatively, MGN are freely tradable and can theoretically be purchased. This may be particularly beneficial if you are close to the next fee reduction level. </p>
</section>

<section className="drawer">
<h3>How do I transfer Magnolia?</h3>
<p>To trade MGN, you must unlock them first. After a waiting period of 24 hours, they may be transferred and locked again to make use of the fee reduction model. Currently this is not offered on the interface.</p>
</section>

<section className="drawer">
<h3>Why is it beneficial to hold a lot of Magnolia?</h3>
<p>The more Magnolia you hold as a percentage of the total Magnolia market volume, the lower your fee (if within the relevant percentages). This provides an incentivize for a continuous use of the DutchX. Additionally, it becomes lucrative to be an active participant on the DutchX from the beginning, since the Magnolia you hold are relative to the entire Magnolia market. </p>
</section>

<section className="drawer">
<h3>How do I pay up to half of fees with OWL?</h3>
<p>After the fee reduction using Magnolia (which is done automatically), you may (but do not have to) pay up to half of the remainder of fees in OWL. One OWL can be used to pay for the equivalent of one USD in fees.
If you set an allowance on the first pop-up modal when going through transactions, fee payment in OWL is done automatically for you and OWL is deducted from the wallet you are connected with. The pop-up modal only appears if you hold OWL.
OWL used to pay for fees are not credited to any particular party but are instead consumed (“burned”).</p>
</section>

<section className="drawer">
<h3>How do I pay my fees?</h3>
<p>Fees (or remaining fees in case you choose to partially pay with OWL) are automatically deducted from the token you are participating with (and then attributed to the auction you are participating in). </p>
</section>

<section className="drawer">
<h3>So what does the step-by-step fee calculation look like?</h3>
<p>Imagine you are taking part with a volume of 20 Token A.
The DutchX calculates your fee level based on the MGN you hold, e.g. 4%. This information is displayed for you in the header (e.g. 0.8 Token A)
From this fee level (e.g. 4%), you have the option to pay half in OWL (if you own OWL in the wallet you are participating with).
If you choose to pay half in OWL (in this example 2%; 2% of your participating volume (=0.4 TokenA) is translated into USD. Note that 1OWL is accepted as 1USD on the DutchX.
If you do not choose to pay in OWL or you do not have OWL, 4% (in this example) are deducted from your participating Token.
The remainder of the fees is paid in the participating token
In the case of not paying in OWL; the remainder is 0.8 -0 = 0.8.
In the case of paying with OWL, the remainder is 0.8-0.4= 0.4.
What gets attributed to the auction?
In the case of not paying in OWL: 20-0.8=19.2 A Token are attributed to the sellVolume.
In the case of paying in OWL: 20-0.4=19.6 A Token are attributed to the sellVolume.</p>
</section>

<section className="drawer">
<h3>Who obtains the fees?</h3>
<p>Fees in the Dutch Exchange do not go to any specific party!
Fees paid in OWL are consumed (i.e. burned) and not credited to anyone.
Fees paid in the Token the user is participating with will go into the next running auction for the same token-pairing to be auctioned off as an extra balance (always as sellTokens). Fees are redistributed within the DutchX ecosystems and go towards high-volume users!</p>
</section>

<section className="drawer">
<h3>What is the reasoning for the fees to go into the next auction?</h3>
<p>We would like to keep the fees in the DutchX ecosystems. That means that users, and especially frequent users benefit as they not only lower their fees, but get credited part of the fees!</p>
</section>

<section className="drawer">
<h3>What are OWL?</h3>
<p>Read up on OWL and the initial OWL generation.</p>
</section>

<section className="drawer">
<h3>Why would I want to pay my fees in OWL?</h3>
<p>Firstly, if you are a GNO holder, you obtain OWL by locking your GNO. Secondly, one OWL can be used to pay one USD worth of fees (this is fixed on the platform). </p>
</section>

<section className="drawer">
<h3>How are OWLs burned?</h3>
<p>Burning OWL means that they will be collected in a smart contract that cannot be accessed by anyone.</p>
</section>

<section className="drawer">
<h3>Do I also have to pay a gas price?</h3>
<p>Yes, you do! For all transactions on the Ethereum blockchain, gas has to be paid. The amount of gas to be paid depends on the current transactions being processed on Ethereum. Both sellers and bidders have to pay gas for a) executing the bid or sellOrder, and b) to claim the exchanged token. Your wallet provider will show you the gas estimation for each transactions and you may set a gas fee.</p>
</section>
</article>

{/* Imprint contentpage example */}
<article>
<h1>Imprint</h1>
<section className="content">
  <h3>Gnosis Ops Ltd.</h3>
  <p>
    World Trade Center<br/>
    6 Bayside Rd, GX111AA Gibraltar<br/>
    E-mail: <a href="mailto:info@gnosis.pm">info@gnosis.pm</a><br/><br/>
    <strong>Directors:</strong> <br/>Stefan George, Martin Köppelmann, Joseph Lubin, Jeremy Millar<br/><br/>
    Company registered in Gibraltar<br/>
    Company Nr. 116678
  </p>
</section>
</article>
{/* END Imprint example */}

{/* footer example - would be sitewide */}
<footer>
  <p>Trading on DutchX carries a risk to your capital. Please read our full <a href="#">Risk Disclaimer</a>, <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> before trading. – <a href="#">Imprint</a></p>
</footer>
{/* END footer example */}

  </div>
)

export default ContentPage
