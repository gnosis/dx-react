import React from 'react'

const Imprint = ({ noTitle, cssClass = 'disclaimer' }: { noTitle?: boolean, cssClass?: string }) =>
    <div className={cssClass}>
        <article>
            {!noTitle && <h1 >IMPRINT</h1>}
            <p>
                <strong>d.ex OÜ</strong><br/><br/>
                Ahtri 12, <br/>
                Tallinn 10151<br/>
                Estonia
            </p>
            <p>
                E-Mail: <a href="mailTo: info@slow.trade">info@slow.trade</a>
            </p>
            <p>
                Company registration No. 14553524
            </p>

        </article>
    </div>

export default Imprint
