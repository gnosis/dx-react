import React from 'react'
import disclaimerSVG from 'assets/404.svg'
import { COMPANY_NAME } from 'globals'

const PageNotFound: React.SFC = () =>
  <section className="pageNotFound">
    <img src={disclaimerSVG} />
    <h1>Oops!</h1>
    <h2>404: Page Not Found</h2>
    <p>We couldn't find the page you were looking for or the page is currently not available. Please try again later.
      <br />
      <br />
      If you continue experiencing issues you may be trying to access the exchange from a restricted country or region.
      If you would like to know more about {COMPANY_NAME} and/or the DutchX Protocol, please <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">visit this blog</a>.
      <br />
      <br />
      Funds are not lost due to a downtime of the frontend.
    </p>
  </section>

export default PageNotFound
