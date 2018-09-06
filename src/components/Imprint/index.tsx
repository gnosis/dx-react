import React from 'react'

import gnosisLogoSVG from 'assets/img/gnosis_logo.svg'

const Imprint = () =>
    <div className="contentPage">
        <article>
            <h1 >IMPRINT</h1>
            <img src={gnosisLogoSVG} height="24" width="140" alt="Gnosis" />
            <p><br/><strong>Gnosis Ltd.</strong><br/>
            Gnosis Ltd.<br/>
            World Trade Center<br/>
            6 Bayside Rd, GX111AA Gibraltar<br/>
            E-Mail: <a href="mailto:info@gnosis.pm">info@gnosis.pm</a><br/><br/>
            <strong>Directors:</strong><br/>
            Stefan George, Martin Köppelmann, Joseph Lubin, Jeremy Millar<br/><br/>
            Company registered in Gibraltar<br/>
            Company Nr. 115571</p>
            <p></p>
        </article>
    </div>

export default Imprint
