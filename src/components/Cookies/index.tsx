import React, { SyntheticEvent } from 'react'

import dutchXLogo from 'assets/dutchx.png'

import { Link } from 'react-router-dom'
import ScrollToLink from 'components/ScrollToLink'

import localForage from 'localforage'
import { COMPANY_NAME } from 'globals'

interface CookiesState {
  settingsOpen: boolean,
  cookieSettings: {
    necessary: boolean,
    analytics: boolean,
  },
  loading: boolean,
  error: string,
}

interface CookiesProps {
  dateUpdated: string;
}

class Cookies extends React.Component<CookiesProps, CookiesState> {
  state = {
    settingsOpen: false,
    cookieSettings: {
      necessary: true,
      analytics: false,
    },
    loading: true,
    error: '',
  }

  async componentDidMount() {
    try {
      const cookieData: { analytics?: boolean, necessary?: boolean } = await localForage.getItem('cookieSettings')

      if (!cookieData) return this.setState({ loading: false })

      const { necessary, analytics } = cookieData

      this.setState({
        cookieSettings: {
            necessary,
            analytics,
          },
        loading: false,
      })
    } catch (err) {
      console.error(err)
      this.setState({ error: err, loading: false })
    }
  }

  handleSubmit = () => {
    const {
        cookieSettings: {
          necessary,
          analytics,
        },
      } = this.state
    this.setState({ settingsOpen: false })
    return localForage.setItem('cookieSettings', { necessary, analytics })
  }

  handleClick = (e: SyntheticEvent) => (e.preventDefault(), this.setState({ settingsOpen: !this.state.settingsOpen }))

  render() {
    const { dateUpdated = 'September 2018' } = this.props, { settingsOpen, cookieSettings: { necessary, analytics }, loading } = this.state
    return (
        loading ? null
          : (
            <div className="contentPage">
              <article id="cookiesArticle">
                <div className="cookiePageLogo"><img src={dutchXLogo} /></div>
                <br />

                <h1 style={{ whiteSpace: 'pre-line' }}>
                  {`${COMPANY_NAME}
                  Cookie Policy`}
                </h1>
                <button
                  className={`buttonCTA ${settingsOpen ? 'light-orange' : 'alt-blue'}`}
                  onClick={this.handleClick}
                >
                  {settingsOpen ? 'Close' : 'Open'}
                  {' '}
Cookie Preferences
                </button>
                <h4>{`Last updated: ${dateUpdated}`}</h4>

                <div className={`cookieSettings${settingsOpen ? ' open' : ' closed'}`}>
                  <div>
                    <div className="disclaimerBox md-checkbox">
                      <input id="disclaimer1" type="checkbox" required defaultChecked={necessary} disabled={necessary} />
                      <label htmlFor="disclaimer1">Necessary</label>
                    </div>

                    <div className="disclaimerBox md-checkbox">
                      <input
                        id="disclaimer2"
                        type="checkbox"
                        required
                        defaultChecked={analytics}

                        onChange={() => this.setState({ cookieSettings: { analytics: !analytics, necessary } })}
                      />
                      <label htmlFor="disclaimer2">Analytics</label>
                    </div>
                  </div>
                  <button
                    className="buttonCTA alt-blue"
                    onClick={this.handleSubmit}
                  >
Change Cookie Preferences
                  </button>
                </div>

                <span>
                  <p>
                As described in our
                    {' '}
                    <Link to="/privacy">Privacy Policy</Link>
, For general web-browsing of this website, your personal data is not revealed to us, although certain statistical information is available to us via our internet service provider as well as through the use of special tracking technologies. Such information tells us about the pages you are clicking on or the hardware you are using, but not your name, age, address or anything we can use to identify you personally.
                This Cookie Policy sets out some further detail on how and why we use these technologies on our website. The terms "we", "us", and "our" includes d.ex OÜ and any affiliates. The terms “you” and “your” includes our clients, business partners and users of this website. By using our website, you consent to storage and access to cookies and other technologies on your device, in accordance with this Cookie Policy.
                  <br />
                  <br />
                  Capitalized terms used but not defined here have the respective meanings given to them in the <a href="./PrivacyPolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <Link to="/terms">Terms and Conditions</Link>.
                  </p>
                  <p>
                    <strong>What are cookies?</strong>
                    <br />
              Cookies are a feature of web browser software that allows web servers to recognize the computer or device used to access a website. A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
              What are the different types of cookies?
              A cookie can be classified by its lifespan and the domain to which it belongs.
                    <br />
                    <br />
              By lifespan, a cookie is either a:
                  </p>
                  <ol>
                    <li>session cookie which is erased when the user closes the browser; or</li>
                    <li>persistent cookie which is saved to the hard drive and remains on the user's computer/device for a pre-defined period of time.</li>
                  </ol>
                  <p>As for the domain to which it belongs, cookies are either:</p>
                  <ol>
                    <li>first-party cookies which are set by the web server of the visited page and share the same domain (i.e. set by us); or</li>
                    <li>third-party cookies stored by a different domain to the visited page's domain.</li>
                  </ol>

                  <p>
                    <strong>What cookies do we use and why?</strong>
                    <br />
              We list all the cookies we use on this website in the
                    {' '}
                    <ScrollToLink to="./cookies#appendix" hash="#appendix">APPENDIX</ScrollToLink>
                    {' '}
below.
              We do not use cookies set by ourselves via our web developers (first-party cookies). We only have those set by others (third-party cookies).
              Cookies are also sometimes classified by reference to their purpose. We use the following cookies for the following purposes:
                  </p>
                  <p>
                    <strong>Analytical/performance cookies:</strong>
                    <br />
                They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it, as well as dates and times they visit. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.
                  </p>
                  <p>
                    <strong>Targeting cookies:</strong>
                These cookies record your visit to our website, the pages you have visited and the links you have followed, as well as time spent on our website, and the websites visited just before and just after our website. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.
                    <br />
                    <br />
                In general, we use cookies and other technologies (such as web server logs) on our website to enhance your experience and to collect information about how our website is used. This information is put together (‘aggregated’) and provides general and not individually specific information. None of this information is therefore associated with you as an individual and the cookie-related information is not used to identify you personally. It is therefore anonymized and ‘de-identified’. The pattern data is fully under our control and these cookies are not used for any purpose other than those described here.
                    <br />
                    <br />
                We will retain and evaluate information on your recent visits to our website and how you move around different sections of our website for analytics purposes to understand how people use our website so that we can make it more intuitive. The information also helps us to understand which parts of this website are most popular and generally to assess user behaviour and characteristics to measure interest in and use of the various areas of our website. This then allows us to improve our website and the way we market our business.
                    <br />
                    <br />
                This information may also be used to help us to improve, administer and diagnose problems with our server and website. The information also helps us monitor traffic on our website so that we can manage our website's capacity and efficiency.
                  </p>
                  <p>
                    <strong>Other Technologies</strong>
                    <br />
                We may allow others to provide analytics services and serve advertisements on our behalf. In addition to the uses of cookies described above, these entities may use other methods, such as the technologies described below, to collect information about your use of our website and other websites and online services.
                    <br />
                    <br />
                Pixels tags. Pixel tags (which are also called clear GIFs, web beacons, or pixels), are small pieces of code that can be embedded on websites and emails. Pixels tags may be used to learn how you interact with our website pages and emails, and this information helps us, and our partners provide you with a more tailored experience.
                    <br />
                    <br />
                Device Identifiers. A device identifier is a unique label can be used to identify a mobile device. Device identifiers may be used to track, analyze and improve the performance of the website and ads delivered.
                  </p>
                  <p>
                    <strong>What data are collected by cookies and other technologies on our website?</strong>
                    <br />
                This information may include:
                  </p>
                  <ol>
                    <li>the IP and logical address of the server you are using (but the last digits are anonymized so we cannot identify you).</li>
                    <li>the top level domain name from which you access the internet (for example .ie, .com, etc)</li>
                    <li>the type of browser you are using,</li>
                    <li>the date and time you access our website</li>
                    <li>the internet address linking to our website.</li>
                  </ol>
                  <p><strong>This website also uses cookies to:</strong></p>
                  <ol>
                    <li>remember you and your actions while navigating between pages;</li>
                    <li>remember if you have agreed (or not) to our use of cookies on our website;</li>
                    <li>ensure the security of the website;</li>
                    <li>monitor and improve the performance of servers hosting the site;</li>
                    <li>distinguish users and sessions;</li>
                    <li>improving the speed of the site when you access content repeatedly;</li>
                    <li>determine new sessions and visits;</li>
                    <li>show the traffic source or campaign that explains how you may have reached our website; and</li>
                    <li>allow us to store any customization preferences where our website allows this</li>
                  </ol>
                  <p>
                We may also use other services, such as Google Analytics (described below) or other third-party cookies, to assist with analyzing performance on our website. As part of providing these services, these service providers may use cookies and the technologies described below to collect and store information about your device, such as time of visit, pages visited, time spent on each page of our website, links clicked and conversion information, IP address, browser, mobile network information, and type of operating system used.
                  </p>
                  <p>
                    <strong>Google Analytics Cookies</strong>
                    <br />
                This website uses Google Analytics, a web analytics service provided by Google, Inc. ("Google").
                We use Google Analytics to track your preferences and also to identify popular sections of our website. Use of Google Analytics in this way, enables us to adapt the content of our website more specifically to your needs and thereby improve what we can offer to you.
                Google will use this information for the purpose of evaluating your use of our website, compiling reports on website activity for website operators and providing other services relating to website activity and internet usage. Google may also transfer this information to third parties where required to do so by law, or where such third parties process the information on Google's behalf. Google will not associate your IP address with any other data held by Google.
                In particular Google Analytics tells us:
                  </p>
                  <ol>
                    <li>your IP address (last 3 digits are masked);</li>
                    <li>the number of pages visited;</li>
                    <li>the time and duration of the visit;</li>
                    <li>your location;</li>
                    <li>the website you came from (if any);</li>
                    <li>the type of hardware you use (i.e. whether you are browsing from a desktop or a mobile device);</li>
                    <li>the software used (type of browser); and</li>
                    <li>your general interaction with our website.</li>
                  </ol>
                  <p>
                    <br />
As stated above, cookie-related information is not used to identify you personally, and what is compiled is only aggregate data that tells us, for example, what countries we are most popular in, but not that you live in a particular country or your precise location when you visited our website (this is because we have only half the information- we know the country the person is browsing from, but not the name of person who is browsing). In such an example Google will analyze the number of users for us, but the relevant cookies do not reveal their identities.
                  </p>
                  <p>
By using this website, you consent to the processing of data about you by Google in the manner and for the purposes set out above. Google Analytics, its purpose and function is further explained on the Google Analytics website.
                    <br />
                    <br />
                For more information about Google Analytics cookies, please see Google's help pages and privacy policy: Google's Privacy Policy and Google Analytics Help pages. For further information about the use of these cookies by Google click here.
                  </p>
                  <p>
                    <strong>What if you don’t agree to us monitoring your use of our website (even we don’t collect your personal data)?</strong>
                    <br />
              Enabling these cookies is not strictly necessary for our website to work but it will provide you with a better browsing experience. You can delete or block the cookies we set, but if you do that, some features of this website may not work as intended.
                    <br />
                    <br />
              Most browsers are initially set to accept cookies. If you prefer, you can set your browser to refuse cookies and control and/or delete cookies as you wish – for details, see
                    {' '}
                    <a href="https://aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>
. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. You should be aware that if you do this, you may have to manually adjust some preferences every time you visit an Internet site and some services and functionalities may not work if you do not accept the cookies they send.
              Advertisers and business partners that you access on or through our website may also send you cookies. We do not control any cookies outside of our website.
                    <br />
                    <br />
              If you have any further questions regarding disabling cookies you should consult with your preferred browser’s provider or manufacturer.
              In order to implement your objection it may be necessary to install an opt-out cookie on your browser. This cookie will only indicate that you have opted out. It is important to note, that for technical reasons, the opt-out cookie will only affect the browser from which you actively object from. If you delete the cookies in your browser or use a different end device or browser, you will need to opt out again.
              To opt out of being tracked by Google Analytics across all websites, Google has developed the Google Analytics opt-out browser add-on. If you would like to opt out of Google Analytics, you have the option of downloading and installing this browser add-on which can be found under the link:
                    {' '}
                    <a href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">http://tools.google.com/dlpage/gaoptout</a>
.
                  </p>
                  <p>
                    <strong>Revisions to this Cookie Policy</strong>
                    <br />
                On this website, you can always view the latest version of our
                    {' '}
                    <Link to="/privacy">Privacy Policy</Link>
                    {' '}
and our Cookie Policy. We may modify this Cookie Policy from time to time. If we make changes to this Cookie Policy, we will provide notice of such changes, such as by sending an email notification, providing notice through the our website or updating the ‘Last Updated’ date at the beginning of this Cookie Policy. The amended Cookie Policy will be effective immediately after the date it is posted. By continuing to access or use our website after the effective date, you confirm your acceptance of the revised Cookie Policy and all of the terms incorporated therein by reference. We encourage you to review our
                    {' '}
                    <Link to="/privacy">Privacy Policy</Link>
                    {' '}
and our Cookie Policy whenever you access or use our website to stay informed about our information practices and the choices available to you.
                If you do not accept changes which are made to this Cookie Policy, or take any measures described above to opt-out by removing or rejecting cookies, you may continue to use this website but accept that it may not display and/or function as intended by us. Any social media channels connected to d.ex OÜ and third party applications will be subject to the privacy and cookie policies and practices of the relevant platform providers which, unless otherwise indicated, are not affiliated or associated with d.ex. OÜ. Your exercise of any rights to opt-out may also impact how our information and content is displayed and/or accessible to you on this website and on other websites.
                  </p>

                </span>
                <h3>APPENDIX</h3>
                <span id="appendix">
                  <p>Table: Overview of cookies placed and the consequences if the cookies are not placed</p>
                  <table>
                    <tbody>
                      <tr>
                        <td>Name of cookie</td>
                        <td>Purpose(s) of cookie</td>
                        <td>Storage period of cookie</td>
                        <td>Consequences if cookie is not accepted</td>
                      </tr>
                      <tr>
                        <td>__utma</td>
                        <td>Used to distinguish users and sessions. The cookie is created when the javascript library executes and no existing __utma cookies exists. The cookie is updated every time data is sent to Google Analytics.</td>
                        <td>2 years from set/update</td>
                        <td>User activity won't be tracked</td>
                      </tr>
                      <tr>
                        <td>__utmt</td>
                        <td>Used to throttle request rate.</td>
                        <td>10 minutes</td>
                        <td>User activity won't be tracked</td>
                      </tr>
                      <tr>
                        <td>__utmb</td>
                        <td>Used to determine new sessions/visits. The cookie is created when the javascript library executes and no existing __utmb cookies exists. The cookie is updated every time data is sent to Google Analytics.</td>
                        <td>30 mins from set/update</td>
                        <td>User activity won't be tracked</td>
                      </tr>
                      <tr>
                        <td>__utmv</td>
                        <td>Used to store visitor-level custom variable data. This cookie is created when a developer uses the _setCustomVar method with a visitor level custom variable. This cookie was also used for the deprecated _setVar method. The cookie is updated every time data is sent to Google Analytics.</td>
                        <td>2 years from set/update</td>
                        <td>User activity won't be tracked</td>
                      </tr>
                      <tr>
                        <td>__utmc</td>
                        <td>Not used in ga.js. Set for interoperability with urchin.js. Historically, this cookie operated in conjunction with the __utmb cookie to determine whether the user was in a new session/visit.</td>
                        <td>End of browser session</td>
                        <td>User activity won't be tracked</td>
                      </tr>
                    </tbody>
                  </table>
                </span>
              </article>
            </div>
          )
    )
  }
}

export default Cookies
