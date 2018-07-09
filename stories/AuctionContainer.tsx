import React from 'react'
import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-router'
import { makeProviderDecorator, storeInit } from './helpers'

import { toBigNumber } from 'web3/lib/utils/utils.js'

import AuctionContainer from 'components/AuctionContainer'
import AuctionFooter from 'components/AuctionFooter'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionProgress from 'components/AuctionProgress'
import AuctionSellingGetting from 'components/AuctionSellingGetting'
import AuctionStatus from 'components/AuctionStatus'
import AuctionWalletSummary from 'components/AuctionWalletSummary'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'
import AuctionAmountSummary from 'containers/AuctionAmountSummary'
import TokenOverlay from 'containers/TokenOverlay'

import { action } from '@storybook/addon-actions'
import { boolean, number, object, text } from '@storybook/addon-knobs'

import { DefaultTokenObject } from 'types'
import { AuctionStatus as Status } from 'globals'

const Provider = makeProviderDecorator(storeInit())

storiesOf('AuctionContainer', module)
  .addDecorator(StoryRouter())
  .addDecorator(Provider)
  .addWithJSX('PAGE 2', () =>
    <AuctionContainer auctionDataScreen="amount">
      <TokenOverlay />
      <AuctionHeader
        backTo="/"
        children="Token Auction ETH/GNO"
      />
      <TokenPair />
      <AuctionPriceBar header="Closing Price" />
      <AuctionSellingGetting
        maxSellAmount={toBigNumber(number('balance', 0, {
          range: true,
          min: 0,
          max: 5000,
          step: 0.1,
        }))}
        buyTokenSymbol={text('buyTokenSymbol', 'GNO')}
        sellTokenSymbol={text('sellTokenSymbol', 'ETH')}
        sellAmount={number('sellAmount', 0).toString()}
        buyAmount={number('buyAmount', 0).toString()}
        setSellTokenAmount={action('Set sellTokenAmount')}
      />
      <ButtonCTA
        children="Continue to wallet details"
        onClick={action('Continuing to Wallet Details')}
      />
    </AuctionContainer>,
)
  .addWithJSX('PAGE 3', () =>
    <AuctionContainer auctionDataScreen="details">
      <AuctionHeader
        backTo="/"
        children="Confirm Order Details"
      />
      <AuctionAmountSummary />
      <AuctionPriceBar header="Price" />
      <AuctionWalletSummary
        address={text('Wallet Addr.', '0x67a8s8ff687asd6a8s9d8fa')}
        provider={text('Provider', 'METAMASK')}
        network={text('Provider', 'MAIN-NET')}
        connected={boolean('connectStatus', false)}
      />
      <p>
        When submitting the order and signing with MetaMask,
        your deposit will be added to the next (scheduled) auction. Every auction takes approx. 5 hours.
      </p>
      <ButtonCTA onClick={action('Order Submitted')}>
        Submit Order <i className="icon icon-walletOK"></i>
      </ButtonCTA>
    </AuctionContainer>,
)
  .addDecorator(StoryRouter())
  .addWithJSX('PAGE 4', () =>
    <AuctionContainer auctionDataScreen="status">
      <AuctionHeader
        backTo="/"
        children={['Auction URL: ', <a href="#" key="0">https://www.dutchx.pm/auction/0x03494929349594/</a>]}
      />
      <AuctionStatus
        buyToken={object('buyToken', { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 }) as DefaultTokenObject}
        sellToken={object('sellToken', { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 }) as DefaultTokenObject}
        buyAmount={toBigNumber(number('buyAmt', 100))}
        sellAmount={toBigNumber(number('sellAmt', 100))}
        status={Status.ENDED}
        timeLeft={number('timeLeft', 5, {
          range: true,
          min: 0,
          max: (3600 * 6),
          step: 5,
        })}
        completed={boolean('comleted', true)}
        theoreticallyCompleted={boolean('comleted', true)}
        claimSellerFunds={() => {}}
      />
      <AuctionProgress progress={4} marks={[true, true, true]} />
      <AuctionFooter
        buyTokenSymbol={text('buyTokenSymbol', 'GNO')}
        sellTokenSymbol={text('sellTokenSymbol', 'ETH')}
        sellAmount={toBigNumber(number('sellAmt', 100))}
        sellDecimal={number('sellDecimal', 18)}
        buyDecimal={number('buyDecimal', 18)}
        buyAmount={toBigNumber(number('buyAmt', 100))}
        auctionEnded={boolean('auctionEnded', false)}
        status={Status.ENDED}
      />
    </AuctionContainer>,
)
