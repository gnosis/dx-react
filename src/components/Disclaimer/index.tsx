import React from 'react'
import localForage from 'localforage'

import disclaimerSVG from 'assets/disclaimer.svg'

import 'assets/pdf/DutchX_Rinkeby_PrivacyPolicy.pdf'

import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { BLOCKED_COUNTRIES } from 'globals'

export interface DisclaimerProps extends RouteComponentProps<any> {
  accepted: boolean,
  acceptDisclaimer: () => any,
  network: string,
}

export interface DisclaimerState {
  cookies_analytics_accepted: boolean,
  formInvalid: boolean,
  loading: boolean,
  termsOfUseScrolled: boolean,
  termsOfUseAccepted: boolean,
}

export default class Disclaimer extends React.Component<DisclaimerProps, DisclaimerState> {
  state = {
    formInvalid: true,
    termsOfUseScrolled: false,
    termsOfUseAccepted: false,
    cookies_analytics_accepted: undefined as boolean,
    loading: true,
  }

  form: HTMLFormElement = null

  async componentWillMount() {
    try {
      const cookieData: { analytics?: boolean } = await localForage.getItem('cookieSettings')

      if (!cookieData) return this.setState({ loading: false })

      const { analytics } = cookieData
      return this.setState({
        cookies_analytics_accepted: analytics,
        loading: false,
      })
    } catch (err) {
      console.error(err)
    }
  }

  onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const accepted = this.form.checkValidity() && this.state.termsOfUseAccepted
    this.setState({
      formInvalid: !accepted,
      ...this.state,
    })
    // redirect to /
    if (accepted) {
      this.props.acceptDisclaimer()
    }
    return localForage.setItem('cookieSettings', { necessary: true, analytics: !!(this.state.cookies_analytics_accepted) })
  }

  onChange = () =>
    this.setState({
      formInvalid: !this.form.checkValidity(),
    })

  handleTermsScroll = ({ target }: any) => {
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight

    if (bottom) {
      console.warn('BOTTOM BOTTOM')
      return this.setState({ termsOfUseScrolled: true })
    }
  }

  renderMainnetDisclaimer() {
    const { cookies_analytics_accepted, formInvalid, termsOfUseScrolled, termsOfUseAccepted } = this.state
    const { accepted } = this.props

    let disclaimerConfirmClasses = 'buttonCTA'
    const disclaimerErrorStyle: React.CSSProperties = {}

    if (formInvalid || !termsOfUseAccepted) {
      disclaimerConfirmClasses += ' buttonCTA-disabled'
    } else {
      disclaimerErrorStyle.visibility = 'hidden'
    }

    return (
      <section className="disclaimer">

        <span>
          <img src={disclaimerSVG} />
          <h1>Verification and T&C</h1>
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
                I am NEITHER a citizen or resident of, NOR currently located in any of the following states or territories, NOR an entity formed under the laws of:
                {Object.values(BLOCKED_COUNTRIES).map((code, i, array) => {
                  if (i === 0) return ` ${code}, `
                  if (array[i] === array.last()) return `${code}.`
                  return `${code}, `
                })}
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer2" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer2">
                I certify that I am NEITHER on any of the U.S. Treasury Department’s Office of Foreign Asset Control’s sanctions lists, the U.S. Commerce Department's Consolidated Screening List, the EU consolidated list of persons, groups or entities subject to EU financial sanctions, NOR do I act on behalf of a person sanctioned thereunder or a U.S.-, EU- or UN-sanctioned state.
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer3" type="checkbox" onChange={() => this.setState({ termsOfUseAccepted: !this.state.termsOfUseAccepted })} required disabled={accepted || !termsOfUseScrolled} />
              <label htmlFor="disclaimer3">
                I have read, understood, and agree to the full Terms and Conditions:
              </label>
            </div>

            <div className="disclaimerTextbox" onScroll={this.handleTermsScroll}>
              <span>
                <h4>Terms and Conditions:</h4>
                <ul className="scrollableDisclaimerList">
                  <li>The DutchX is a decentralized medium for the exchange of ERC20 tokens.</li>
                  <li>The process is governed by a smart contract; there is no intermediary between sellers and bidders. Trades happen directly peer-to-peer.</li>
                  <li>You are solely responsible for the safekeeping of your wallet and private information.</li>
                  <li>You are encouraged to bookmark https://dutchx.app. Web address imitation by hackers is a real risk!</li>
                  <li>ERC20 tokens are not a currency in legal terms and are not backed by assets. The value of ERC20 tokens may be highly volatile. This volatility might cause unforeseen price fluctuations as auctions typically run for some time and trades are not executed instantly.</li>
                  <li>The DutchX as well as the Ethereum protocol are still in an early development stage and there is no guarantee of an error-free process.</li>
                  <li>There is neither a price guarantee nor a liquidity guarantee on the DutchX. </li>
                  <li>Blockchain transactions are (likely) irreversible. The wallet address and your transaction will be displayed permanently and publicly—this is an inherent characteristic to services available on the blockchain. The right to request rectification or erasure of personal data is not possible with blockchain technology.</li>
                  <li>The availability of a token does not indicate approval or disapproval, volume, or any other measure of quality. Tokens may be added by anyone using the governing mechanisms of the smart contract which is open source and available to everyone. Token lists may be created by anyone and there is no approval or blacklisting process in place.</li>
                  <li>You are prohibited from using or accessing the DutchX in order to transmit or exchange digital assets that are the direct or indirect proceeds of any criminal or fraudulent activity, including terrorism or tax evasion.</li>
                  <li>In no event shall the initiator, programmer, auditor, auctioneer, participant, or any other person or entity which was/is involved in the creation of, maintenance of, or any other form of interaction or support of the DutchX, be liable for any indirect, special, incidental, consequential, or exemplary damages of any kind arising out of, or in any way related to the use of the DutchX, regardless of the form of action, whether based in the contract, tort, or any other legal or equitable theory. </li>
                  <li>You will indemnify, defend, and hold harmless the initiator, programmer, auditor, auctioneer, participant, or any other person or entity which is involved in the code maintenance or other form of interaction with the DutchX, from and against all claims, demands, actions, damages, losses, costs, and expenses that arise from or relate to your responsibilities under this Disclaimer or your violation of this Disclaimer. </li>
                  <li>In case that your jurisdiction does not allow the limitation or exclusion of liability for incidental or consequential damages, you are prohibited to interact with the DutchX.</li>
                  <li>You recognize and agree on using the DutchX on your own risk. </li>
                  <li>You are legally allowed to buy/sell this kind of (new) asset class.</li>
                </ul>
              </span>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer5" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer5">
                <b>
                  I have read and understood the <a href="docs/DutchX_Main_PrivacyPolicy.pdf" target="_blank">Privacy Policy</a>.
                </b>
              </label>
            </div>

            {/* COOKIE DISCLAIMER */}
            <div className="disclaimerCookiePolicy">
              <div>
                <div>
                    <div className="disclaimerBoxCookie md-checkbox">
                      <input id="disclaimer5" type="checkbox" required defaultChecked disabled/>
                      <label htmlFor="disclaimer5">Necessary</label>
                    </div>
                    <div className="disclaimerBoxCookie md-checkbox">
                      <input id="disclaimer6" type="checkbox" onChange={() => this.setState({ cookies_analytics_accepted: !this.state.cookies_analytics_accepted })} defaultChecked={cookies_analytics_accepted} disabled={accepted}/>
                      <label htmlFor="disclaimer6">Analytics</label>
                    </div>
                </div>
                <p>I agree to the storing of cookies on my device to enhance site navigation and analyze site usage. Please read the <Link to="/cookies">Cookie Policy</Link> for more information.</p>
              </div>
            </div>

            <p className="disclaimerError" style={disclaimerErrorStyle}>
              Please read and truly confirm all sections before you continue
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

  renderRinkebyDisclaimer() {
    const { cookies_analytics_accepted, formInvalid, termsOfUseScrolled, termsOfUseAccepted } = this.state
    const { accepted } = this.props

    let disclaimerConfirmClasses = 'buttonCTA'
    const disclaimerErrorStyle: React.CSSProperties = {}

    if (formInvalid || !termsOfUseAccepted) {
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
                I am NEITHER a citizen or resident of, NOR currently located in any of the following states or territories, NOR an entity formed under the laws of:
                {Object.values(BLOCKED_COUNTRIES).map((code, i, array) => {
                  if (i === 0) return ` ${code}, `
                  if (array[i] === array.last()) return `${code}.`
                  return `${code}, `
                })}
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer2" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer2">
                I certify that I am NEITHER on any of the U.S. Treasury Department’s Office of Foreign Asset Control’s sanctions lists, the U.S. Commerce Department's Consolidated Screening List, the EU consolidated list of persons, groups or entities subject to EU financial sanctions, NOR do I act on behalf of a person sanctioned thereunder or a U.S.-, EU- or UN-sanctioned state.
              </label>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer3" type="checkbox" onChange={() => this.setState({ termsOfUseAccepted: !this.state.termsOfUseAccepted })} required disabled={accepted || !termsOfUseScrolled} />
              <label htmlFor="disclaimer3">
                I have read, understood, and agree to the Disclaimer:
              </label>
            </div>

            <div className="disclaimerTextbox" onScroll={this.handleTermsScroll}>
              <span>
                <h4>Disclaimer:</h4>
                <ul className="scrollableDisclaimerList">
                  <li>The DutchX is a decentralized trading protocol for ERC20 tokens, governed by smart contracts that allow peer-to-peer trades between sellers and bidders without intermediary.</li>
                  <li>You are solely responsible to safekeep your wallet and private information.</li>
                  <li>Please bookmark https://dutchx-rinkeby.d.exchange as web address imitation by hackers is a risk!</li>
                  <li>ERC20 tokens are neither legal tender backed by governments nor by assets. The tokens’ value is highly volatile causing price fluctuations, as auctions typically run for some time and trades are not executed instantly.</li>
                  <li>Your jurisdiction allows you to trade on the DutchX.</li>
                  <li>Blockchain transactions are irreversible. The wallet address and your transaction is displayed permanently and publicly. You agree to relinquish any right of rectification or erasure of personal data, which is not possible on the blockchain.</li>
                  <li>You are not using the DutchX to trade tokens that are proceeds of criminal or fraudulent activity.</li>
                  <li>The DutchX and the underlying Ethereum blockchain are in an early development stage. We do not guarantee an error-free process and give no price or liquidity guarantee.</li>
                  <li>You recognize and agree to using the DutchX at your own risk.</li>
                  <li>In no event shall any initiator, programmer, auditor, auctioneer, participant, or other person (all, the “Initiators”) involved in the creation or other interaction with the DutchX be liable for any loss or damage arising out of or in connection with the DutchX. </li>
                  <li>You will indemnify the Initiators against any claims, actions, and costs that arise out of or in connection with you breaching this Disclaimer.</li>
                  <li>You are prohibited from interacting with the DutchX, where your jurisdiction disallows our exclusions of liability or applies mandatory laws overriding this Disclaimer.</li>
                  <li>This DutchX Version runs on the Rinkeby Test Network: Real funds are not at risk</li>
                </ul>
              </span>
            </div>

            <div className="disclaimerBox md-checkbox">
              <input id="disclaimer4" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
              <label htmlFor="disclaimer4">
                <b>
                  I have read and understood the <a href="docs/DutchX_Rinkeby_PrivacyPolicy.pdf" target="_blank">Privacy Policy</a>.
                </b>
              </label>
            </div>

            {/* COOKIE DISCLAIMER */}
            <div className="disclaimerCookiePolicy">
              <div>
                <div>
                    <div className="disclaimerBoxCookie md-checkbox">
                      <input id="disclaimer5" type="checkbox" required defaultChecked disabled/>
                      <label htmlFor="disclaimer5">Necessary</label>
                    </div>
                    <div className="disclaimerBoxCookie md-checkbox">
                      <input id="disclaimer6" type="checkbox" onChange={() => this.setState({ cookies_analytics_accepted: !this.state.cookies_analytics_accepted })} defaultChecked={cookies_analytics_accepted} disabled={accepted}/>
                      <label htmlFor="disclaimer6">Analytics</label>
                    </div>
                </div>
                <p>I agree to the storing of cookies on my device to enhance site navigation and analyze site usage. Please read the <Link to="/cookies">Cookie Policy</Link> for more information.</p>
              </div>
            </div>

            <p className="disclaimerError" style={disclaimerErrorStyle}>
              Please read and truly confirm all sections before you continue
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

  render() {
    const { network } = this.props, { loading } = this.state

    return loading ? null : network === 'MAIN' ? this.renderMainnetDisclaimer() : this.renderRinkebyDisclaimer()
  }
}
