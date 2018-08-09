import React from 'react'
import appInfo from '../../../package.json'
import { connect } from 'react-redux'
import { State } from 'types'

import 'assets/pdf/DutchX_Rinkeby_PrivacyPolicy.pdf'
import { getActiveProviderObject } from 'selectors'

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
                    Trading on DutchX carries a risk to your capital. Please read our full <a href="#">Risk Disclaimer</a>, <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> before trading. – <a href="#">Imprint</a>
                </>
            }
        </p>
        <div>
          <i>DX-React: {appInfo.version}</i>
          <i>DX-Contracts: {appInfo.dependencies['@gnosis.pm/dx-contracts']}</i>
        </div>
    </footer>

const mapState = (state: State) => {
  const provider = getActiveProviderObject(state)

  return { network: provider ? provider.network : 'UNKNOWN NETWORK' }
}

export default connect(mapState)(Footer)
