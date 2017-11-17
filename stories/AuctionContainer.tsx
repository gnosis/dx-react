import React from 'react'
import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-router'
import { makeProviderDecorator, storeInit } from './helpers'

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

import { action } from '@storybook/addon-actions'
import { boolean, number, text } from '@storybook/addon-knobs'

import { TokenCode } from 'types'
import { AuctionStatus as Status } from 'globals'

const Provider = makeProviderDecorator(storeInit())

storiesOf('AuctionContainer', module)
  .addDecorator(StoryRouter())
  .addDecorator(Provider)
  .addWithJSX('PAGE 2', () =>
    <AuctionContainer auctionDataScreen="amount">
      <AuctionHeader
        backTo="/"
        children="Token Auction ETH/GNO"
      />
      <TokenPair />
      <AuctionPriceBar header="Closing Price" />
      <AuctionSellingGetting
        sellTokenBalance={number('balance', 0, {
          range: true,
          min: 0,
          max: 5000,
          step: 0.1,
        }).toString()}
        buyToken={text('buyToken', 'GNO') as TokenCode}
        sellToken={text('sellToken', 'ETH') as TokenCode}
        sellAmount={number('sellAmount', 0).toString()}
        buyAmount={number('sellAmount', 0).toString()}
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
      <TokenPair />
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
        sellToken={text('sellToken', 'ETH') as TokenCode}
        buyToken={text('buyToken', 'GNO') as TokenCode}
        buyAmount={text('buyAmt', '100')}
        status={Status.ENDED}
        timeLeft={number('timeLeft', 5, {
          range: true,
          min: 0,
          max: (3600 * 6),
          step: 5,
        }).toString()}
      />
      <AuctionProgress progress={4} />
      <AuctionFooter
        sellToken={text('sellToken', 'ETH') as TokenCode}
        buyToken={text('buyToken', 'GNO') as TokenCode}
        sellAmount={text('sellAmt', '100')}
        buyAmount={text('buyAmt', '100')}
        auctionEnded={boolean('auctionEnded', false)}
      />
    </AuctionContainer>,
)
