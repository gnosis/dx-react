// Visual component to be wrapped by Subscription
// that recieves Account, ETH Balance (web3), Token Balances?
// or Display all props

import React from 'react'

const VisualComp = (props: any) => {
  <pre>
        {JSON.stringify(props, null, 2)}
    </pre>
}

export default VisualComp
