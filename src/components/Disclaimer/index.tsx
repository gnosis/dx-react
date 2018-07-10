import React from 'react'
import disclaimerSVG from 'assets/disclaimer.svg'

import { RouteComponentProps } from 'react-router'

export interface DisclaimerProps extends RouteComponentProps<any> {
  accepted: boolean,
  acceptDisclaimer: () => any,
}

export interface DisclaimerState {
  formInvalid: boolean,
}

export default class Disclaimer extends React.Component<DisclaimerProps, DisclaimerState> {
  state = {
    formInvalid: true,
  }

  form: HTMLFormElement = null

  onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const accepted = this.form.checkValidity()
    this.setState({
      formInvalid: !accepted,
    })
    // redirect to /
    if (accepted) {
      this.props.acceptDisclaimer()
    }
  }
  onChange = () => {
    this.setState({
      formInvalid: !this.form.checkValidity(),
    })
  }

  render() {
    const { formInvalid } = this.state
    const { accepted } = this.props

    let disclaimerConfirmClasses = 'buttonCTA'
    const disclaimerErrorStyle: React.CSSProperties = {}
    if (formInvalid) {
      disclaimerConfirmClasses += ' buttonCTA-disabled'
    } else {
      disclaimerErrorStyle.visibility = 'hidden'
    }

    return (
      <section className="disclaimer">

        <span>
          <img src={disclaimerSVG} />
          <h1>Verification and Disclaimer</h1>
        </span>

        <div>
          <h2>Please confirm before continuing:</h2>
          <form
            id="disclaimer"
            ref={c => this.form = c}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
          >

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer1" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer1">
                I am NOT a citizen or resident of
                and I am NOT currently in the People's Republic of China
                or an entity formed under the laws of the People's Republic of China.
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer2" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer2">
                I certify that I am NOT (and NOT under the control of), 
                a citizen or resident of or entity formed under the laws of any of the following countries 
                and/or territories and that I am NOT currently located in any thereof: 
                Afghanistan, Belarus, Bosnia and Herzegovina, Côte d’Ivoire, Central African Republic, 
                Crimea (Region of Ukraine), Cuba, Democratic Republic of the Congo, 
                Democratic People's Republic of Korea, Eritrea, Ethiopia, Guinea-Bissau, Iran, Iraq, 
                Japan, Myanmar, Libya, Lebanon, Liberia, Russian Federation, Somalia, 
                South Sudan, Sudan, Syria, Uganda, United States of America, Vanuatu, Venezuela, Yemen, Zimbabwe.
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer3" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer3">
                I certify that
                (1) I am NOT a person on the U.S. Treasury Department's Specially Designated Nationals List
                or the U.S. Commerce Department's Denied Persons List, Unverified List, Entity List,
                or the EU consolidated list of persons, groups or entities subject to EU financial sanctions
                (a "Sanctioned Person");
                and (2) I do not act on behalf a Sanctioned Country (or a national or resident of a Sanctioned Country)
                or Sanctioned Person.
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer4" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer4">
                By accepting this disclaimer, you understand, accept and agree that:
              </label>
            </div>

            <div className="disclaimerTextbox">
              <p>
              - The DutchX is a decentralized medium for the exchange of ERC20 tokens. <br />
              - The process is governed by a smart contract; there is no intermediary between sellers and bidders. Trades happen directly peer-to-peer. <br />
              - You are solely responsible for the safekeeping of your wallet and private information. <br />
              - You are encouraged to bookmark https://dutchx.d.exchange. Web address imitation by hackers is a real risk! <br />
              - ERC20 tokens are not a currency in legal terms and are not backed by assets. The value of ERC20 tokens may be highly volatile. This volatility might cause unforeseen price fluctuations as auctions typically run for some time and trades are not executed instantly. <br />
              - The DutchX as well as the Ethereum protocol are still in an early development stage and there is no guarantee of an error-free process. <br />
              - There is neither a price guarantee nor a liquidity guarantee on the DutchX.  <br />
              - Blockchain transactions are (likely) irreversible. The wallet address and your transaction will be displayed permanently and publicly—this is an inherent characteristic to services available on the blockchain. The right to request rectification or erasure of personal data is not possible with blockchain technology. <br />
              - The availability of a token does not indicate approval or disapproval, volume, or any other measure of quality. Tokens may be added by anyone using the governing mechanisms of the smart contract which is open source and available to everyone. Token lists may be created by anyone and there is no approval or blacklisting process in place. <br />
              - You are prohibited from using or accessing the DutchX in order to transmit or exchange digital assets that are the direct or indirect proceeds of any criminal or fraudulent activity, including terrorism or tax evasion. <br />
              - In no event shall the initiator, programmer, auditor, auctioneer, participant, or any other person or entity which was/is involved in the creation of, maintenance of, or any other form of interaction or support of the DutchX, be liable for any indirect, special, incidental, consequential, or exemplary damages of any kind arising out of, or in any way related to the use of the DutchX, regardless of the form of action, whether based in the contract, tort, or any other legal or equitable theory.  <br />
              - You will indemnify, defend, and hold harmless the initiator, programmer, auditor, auctioneer, participant, or any other person or entity which is involved in the code maintenance or other form of interaction with the DutchX, from and against all claims, demands, actions, damages, losses, costs, and expenses that arise from or relate to your responsibilities under this Disclaimer or your violation of this Disclaimer.  <br />
              - In case that your jurisdiction does not allow the limitation or exclusion of liability for incidental or consequential damages, you are prohibited to interact with the DutchX. <br />
              - You recognize and agree on using the DutchX on your own risk.  <br />
              - You are legally allowed to buy/sell this kind of (new) asset class.
              </p>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer5" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer5">
                <b>
                  I have read and understood the <a href="">Privacy Policy</a>.
                </b>
              </label>
            </div>

            <p className="disclaimerError" style={disclaimerErrorStyle}>
              Please read and truly confirm all sections before continuing
            </p>
          </form>

          <span className="disclaimerFooterActions">
            <button
              id="disclaimer-submit"
              form="disclaimer"
              type="confirm"
              className={disclaimerConfirmClasses}
            >
              Continue
            </button>
          </span>

        </div>

      </section>
    )
  }
}
