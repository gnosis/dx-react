import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import localForage from 'localforage'

import disclaimerSVG from 'assets/disclaimer.svg'

import { web3CompatibleNetwork, geoBlockedCitiesToString } from 'utils'

import Imprint from 'components/Imprint'
import { TermsText } from '../Terms'

import 'assets/pdf/PrivacyPolicy.pdf'

export interface DisclaimerProps extends RouteComponentProps<any> {
  accepted: boolean,
  network: string,
  acceptDisclaimer: (network: string) => any,
}

export interface DisclaimerState {
  cookies_analytics_accepted: boolean,
  formInvalid: boolean,
  loading: boolean,
  network: string,
  // termsOfUseScrolled: boolean, <-- Scroll check removed. See handleScroll method.
  // termsOfUseAccepted: boolean, <-- Scroll check removed. See handleScroll method.
}

const GEO_BLOCKED_COUNTRIES_LIST = geoBlockedCitiesToString()

export default class Disclaimer extends React.Component<DisclaimerProps, DisclaimerState> {
  state = {
    formInvalid: !this.props.accepted,
    cookies_analytics_accepted: true,
    loading: true,
    network: undefined as any,
    // termsOfUseScrolled: this.props.accepted, <-- Scroll check removed. See handleScroll method.
    // termsOfUseAccepted: this.props.accepted, <-- Scroll check removed. See handleScroll method.
  }

  form: HTMLFormElement = null

  async componentDidMount() {
    try {
      const [cookieData, network] = await Promise.all<{ analytics: boolean }, string>([
        localForage.getItem('cookieSettings'),
        web3CompatibleNetwork(),
      ])

      return this.setState({
        cookies_analytics_accepted: cookieData ? cookieData.analytics : this.state.cookies_analytics_accepted,
        loading: false,
        network,
      })
    } catch (err) {
      console.error(err)
    }
  }

  onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    // const accepted = this.form.checkValidity() && this.state.termsOfUseAccepted <-- Scroll check removed. See handleScroll method.
    const accepted = this.form.checkValidity()
    this.setState({
      formInvalid: !accepted,
      ...this.state,
    })
    // redirect to /
    if (accepted) {
      this.props.acceptDisclaimer(this.state.network)
    }
    return localForage.setItem('cookieSettings', { necessary: true, analytics: !!(this.state.cookies_analytics_accepted) })
  }

  onChange = () =>
    this.setState({
      formInvalid: !this.form.checkValidity(),
    })

  // Requested removal of scroll requirement (1.11.2018)
  // handleTermsScroll = ({ target }: any) => {
  //   const bottom = Math.ceil(target.scrollHeight - target.scrollTop - 50) <= target.clientHeight

  //   if (bottom) return this.setState({ termsOfUseScrolled: true })
  // }

  renderVerification() {
    const {
      cookies_analytics_accepted,
      formInvalid,
      network,
      // termsOfUseScrolled, termsOfUseAccepted <-- Scroll check removed. See handleScroll method.
    } = this.state
    const { accepted } = this.props

    let disclaimerConfirmClasses = 'buttonCTA'
    let disclaimerErrorStyle: React.CSSProperties = {
      height: '20px',
      overflow: 'hidden',
      transition: 'all 0.4s ease-in-out',
    }

    if (
      formInvalid
      // || !termsOfUseAccepted <-- Scroll check removed. See handleScroll method.
      ) {
      disclaimerConfirmClasses += ' buttonCTA-disabled'
    } else {
      disclaimerErrorStyle = {
        ...disclaimerErrorStyle,
        height: '0px',
        // margin: '0 auto 5px auto',
      }
    }

    return (
      <>
        <section className="disclaimer">

          <span>
            <img src={disclaimerSVG} />
            <h1>Verification and Terms</h1>
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
                  {' ' + GEO_BLOCKED_COUNTRIES_LIST}
                </label>
              </div>

              <div className="disclaimerBox md-checkbox">
                <input id="disclaimer2" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
                <label htmlFor="disclaimer2">
                  I certify that I am NEITHER on any of the U.S. Treasury Department’s Office of Foreign Asset Control’s sanctions lists, the U.S. Commerce Department's Consolidated Screening List, the EU consolidated list of persons, groups or entities subject to EU financial sanctions, NOR do I act on behalf of a person sanctioned thereunder or a U.S.-, EU- or UN-sanctioned state.
                </label>
              </div>

              <div className="disclaimerBox md-checkbox">
                <input
                  id="disclaimer3"
                  type="checkbox"
                  // onChange={() => this.setState({ termsOfUseAccepted: !this.state.termsOfUseAccepted })} <-- Scroll check removed. See handleScroll method.
                  required
                  defaultChecked={accepted}
                  disabled={accepted/*  || !termsOfUseScrolled <-- Scroll check removed. See handleScroll method. */}
                />
                <label htmlFor="disclaimer3">
                  I have read, understood, and agree to the full Terms and Conditions:
                </label>
              </div>

              {network
                ?
              <TermsText
                className="disclaimerTextbox"
                // onScroll={this.handleTermsScroll} <-- Scroll check removed. See handleScroll method.
                // network={network}
              />
                :
              null}

              <div className="disclaimerBox md-checkbox">
                <input id="disclaimer4" type="checkbox" required defaultChecked={accepted} disabled={accepted} />
                <label htmlFor="disclaimer4">
                  I have read and understood the <a href="./PrivacyPolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </label>
              </div>

              {/* COOKIE DISCLAIMER */}
              <div className="disclaimerCookiePolicy">
                <div>
                  <p>I agree to the storing of cookies on my device to enhance site navigation and analyze site usage. Please read the <Link to="/cookies">Cookie Policy</Link> for more information.</p>
                  <div>
                      <div className="disclaimerBoxCookie md-checkbox">
                        <input id="disclaimer5" type="checkbox" required defaultChecked disabled/>
                        <label htmlFor="disclaimer5">Necessary</label>
                      </div>
                      <div className="disclaimerBoxCookie md-checkbox">
                        <input id="disclaimer6" type="checkbox" onChange={() => this.setState({ cookies_analytics_accepted: !cookies_analytics_accepted })} defaultChecked disabled={accepted}/>
                        <label htmlFor="disclaimer6">Analytics</label>
                      </div>
                  </div>
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
                type="submit"
                className={disclaimerConfirmClasses}
              >
                Continue
              </button>
            </span>

          </div>
        </section>
        <Imprint cssClass="modalDisclaimer" noTitle={true} />
      </>
    )
  }

  render() {
    const { loading } = this.state

    return loading ? null : this.renderVerification()
  }
}
