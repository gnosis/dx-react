import React from 'react'
import appInfo from '../../../package.json'
import { connect } from 'react-redux'
import { State } from 'types'

import 'assets/pdf/PrivacyPolicy.pdf'
import { getActiveProviderObject } from 'selectors'
import gnosisLogoSVG from 'assets/img/gnosis_logo.svg'

import { Link } from 'react-router-dom'
import { COMPANY_NAME, URLS } from 'globals'

interface FooterProps {
  network: string;
}

// TODO: add content for footer
const Footer = ({ network }: FooterProps) =>
    <footer>
        <p>
            {
                network === 'RINKEBY'
                    ?
                <>
                    This {COMPANY_NAME} version runs on the Rinkeby Test Network: Real funds are not at risk. <a href="./PrivacyPolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </>
                    :
                <>
                    <a href="./PrivacyPolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    <Link to="/cookies">Cookies</Link>
                    <Link to="/terms">Terms and Conditions</Link>
                    <Link to="/imprint">Imprint</Link>
                    <Link to="/">Home</Link>
                    <span className="footerLogo"><i>Protocol built by</i><a href={URLS.FOOTER_LOGO_URL} target="_blank"><img src={gnosisLogoSVG} /></a></span>
                </>
            }
        </p>
        <div>
            <i>{network}</i>
            <i>DX-React: {appInfo.version}</i>
            <i>DX-Contracts: {appInfo.dependencies['@gnosis.pm/dx-contracts']}</i>
        </div>
    </footer>

const mapState = (state: State) => {
  const provider = getActiveProviderObject(state)

  return { network: provider ? provider.network : 'UNKNOWN NETWORK' }
}

export default connect(mapState)(Footer)
