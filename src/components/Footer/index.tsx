import React from 'react'
import appInfo from '../../../package.json'

// TODO: add content for footer
const Footer = () =>
    <footer>
        <p>
            Trading on DutchX carries a risk to your capital. Please read our full <a href="#">Risk Disclaimer</a>, <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> before trading. – <a href="#">Imprint</a>
        </p>
        <div>
          <i>DX-React: {appInfo.version}</i>
          <i>DX-Contracts: {appInfo.dependencies['@gnosis.pm/dx-contracts']}</i>
        </div>
    </footer>

export default Footer
