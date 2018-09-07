import React from 'react'
import appInfo from '../../../package.json'
import { connect } from 'react-redux'
import { State } from 'types'

import 'assets/pdf/DutchX_Rinkeby_PrivacyPolicy.pdf'
import { getActiveProviderObject } from 'selectors'
import gnosisLogoSVG from 'assets/img/gnosis_logo.svg'

import { Link } from 'react-router-dom'

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
                    This DutchX Version runs on the Rinkeby Test Network: Real funds are not at risk. Please read the <a href="./DutchX_Rinkeby_PrivacyPolicy.pdf" target="_blank">Privacy Policy</a>.
                </>
                    :
                <>
                    <Link to="/privacy">Privacy Policy</Link><Link to="/cookies">Cookies</Link><Link to="/terms">Terms of Use</Link><Link to="/imprint">Imprint</Link> <p> Protocol built by <img src={gnosisLogoSVG} className="footerLogo"/></p>
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
