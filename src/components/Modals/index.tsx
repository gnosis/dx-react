import React, { CSSProperties } from 'react'
import { BigNumber, Modal } from 'types'
import { closeModal } from 'actions'
import { network2URL, ETHEREUM_NETWORKS, FIXED_DECIMALS, COMPANY_NAME, BLOCKED_COUNTRIES } from 'globals'

import Loader from 'components/Loader'
import { displayUserFriendlyError, lastArrVal } from 'utils'

interface TransactionModalProps {
  activeProvider?: string,
  closeModal?: typeof closeModal,
  modalProps: Modal['modalProps'],
  error?: string,
}

interface ApprovalModalProps extends TransactionModalProps {
  approvalButton: any,
}

interface BlockModalProps extends TransactionModalProps {
  disabledReason: string,
  networkAllowed?: Partial<ETHEREUM_NETWORKS>,
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({
  modalProps: {
    header,
    body,
    txData,
    button,
    error,
    loader,
  },
  activeProvider,
  closeModal,
}) =>
  <div className="modalDivStyle">
    {loader &&
      <Loader
        hasData={false}
        render={() => <div>Loading...</div>}
        SVGChoice="ETHLogo"
      />
    }
    <h1>{header || 'Approving Tokens and Transferring'}</h1>
    <p className="modalHeaderDescriptor">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    {txData &&
      <div className="modalTXDataDiv">
        <span>Total participation:<hr /><strong>{`${txData.sellAmount} ${txData.tokenA.symbol || txData.tokenA.name}`}</strong></span>
        <span>Fee level:<hr /><strong>{`${txData.feeRatio}%`}</strong></span>
        {txData.useOWL && <span>Fees paid in OWL:<hr /><strong>{`${(((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).div(2)).toFixed(FIXED_DECIMALS)}OWL (=${((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).toFixed(FIXED_DECIMALS)} ${txData.tokenA.symbol || txData.tokenA.name})`}</strong></span>}
        <span>Fees paid in {`${txData.tokenA.symbol || txData.tokenA.name}`}:<hr /><strong>{`${txData.useOWL ? (((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).div(2)).toFixed(FIXED_DECIMALS) : ((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).toFixed(FIXED_DECIMALS)} ${txData.tokenA.symbol || txData.tokenA.name}`}</strong></span>
        <span>Amount deposited into auction:<hr /><strong>{`${txData.sellAmountAfterFee.toFixed(FIXED_DECIMALS)} ${txData.tokenA.symbol || txData.tokenA.name}`}</strong></span>
            {(txData.tokenA.symbol || txData.tokenA.name) &&
            <span>Token depositing:<hr /><strong>{`${txData.tokenA.symbol || txData.tokenA.name}${(txData.tokenA.name && txData.tokenA.symbol) && ' (' + txData.tokenA.name + ')'}`}</strong></span>
            }
            <span>Deposit token address:<hr /><strong>{`${txData.tokenA.address}`}</strong></span>
            {(txData.tokenB.symbol || txData.tokenB.name) &&
            <span>Token receiving:<hr /><strong>{`${txData.tokenB.symbol || txData.tokenB.name}${(txData.tokenB.name && txData.tokenB.symbol) && ' (' + txData.tokenB.name + ')'}`}</strong></span>
            }
            <span>Receiving token address:<hr /><strong>{`${txData.tokenB.address}`}</strong></span>
      </div>
    }
    {txData &&
      <>
        <p className="modalHeaderDescriptor">Processing the transaction may take a while.</p>
        <p>Verify receiving token validity via EtherScan:<br/><a target="_blank" rel="noopener noreferrer" href={`${network2URL[txData.network]}token/${txData.tokenB.address}`}>{`${network2URL[txData.network]}token/${txData.tokenB.address}`}</a></p>
      </>
    }
    {error &&
    <p className="modalError">
      {displayUserFriendlyError(error)}
    </p>}
    {button &&
    <button
      className="modalButton"
      onClick={closeModal}
    >
      CLOSE
    </button>
    }
  </div>

export const ApprovalModal: React.SFC<ApprovalModalProps> = ({
  modalProps: {
    header,
    body,
    footer,
    onClick,
    buttons,
  },
  activeProvider,
}) =>
  <div className="modalDivStyle">
    <h1 className="modalH1">{header || 'Please choose Token Approval amount'}</h1>
    <p className="modalP">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    <div className="modalParentDiv">

      <div className="modalButtonDiv">
        <button
          className="modalButton"
          onClick={() => onClick('MIN')}
          >
          {buttons && buttons.button1.buttonTitle1 || 'Approve Min'}
        </button>
        {buttons && buttons.button1.buttonDesc1 && <p className="modalButtonDescription">
          {buttons && buttons.button1.buttonDesc1 || `You\'ll allow ${COMPANY_NAME} to take just the amount of the current operation. Note that you\'ll have to sign a transfer confirmation and an order confirmation for future trades.`}
        </p>}
      </div>

      <div className="modalButtonDiv">
        <button
          className="modalButton"
          onClick={() => onClick('MAX')}
          >
          {buttons && buttons.button2.buttonTitle2 || 'Approve Max'}
        </button>
        {buttons && buttons.button2.buttonDesc2 && <p className="modalButtonDescription">
          {buttons && buttons.button2.buttonDesc2 || `You\'ll allow ${COMPANY_NAME} to also take your bidding token for future trades. ${COMPANY_NAME} won\'t take any tokens until also confirm your order. You will use the same amount of funds but save transaction cost on future trades.`}
        </p>}
      </div>
    </div>
    {footer &&
      <p className="modalFooter">
        {footer.msg || null}
        <br/>
        For more information, read the <a href={footer.url || '#/content/FAQ/#approval'} target="_blank" rel="noopener noreferrer">{footer.urlMsg || ' linked'}</a>  or <a href="https://tokenallowance.io/" target="_blank" rel="noopener noreferrer">here</a> about token allowance.
      </p>}
  </div>

const blockModalStyle: CSSProperties = { fontSize: 16, fontWeight: 100 }

const disabledReasons = {
  geoblock: {
    title: `${COMPANY_NAME} is currently not available.`,
    render: () =>
      <div style={blockModalStyle}>
        <p>Please try again later. No funds are lost due to downtime.</p>
        <p>Still experiencing issues? You may be accessing {COMPANY_NAME} from a restricted country or region. The following countries are geo-blocked:</p>
        <p className="offlineBanner" style={{ margin: 'auto', padding: 20, width: '57%' }}>
          {Object.values(BLOCKED_COUNTRIES).map((code, i, array) => {
            if (i === 0) return ` ${code}, `
            if (array[i] === lastArrVal(array)) return `${code}.`
            return `${code}, `
          })}
        </p>
        <br />
        <br />
        <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank" rel="noopener noreferrer">Blog</a> to learn more about {COMPANY_NAME}.</i></small>
      </div>,
  },
  networkblock: {
    title: `${COMPANY_NAME} is not available on your network.`,
    render: (network = 'RINKEBY Test Network') =>
    <div style={blockModalStyle}>
      <p>{`Make sure you’re connected to the ${network}.`}</p>
      <br />
      <br />
      <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank" rel="noopener noreferrer">Blog</a> to learn more about {COMPANY_NAME}.</i></small>
    </div>,
  },
}

export const BlockModal: React.SFC<BlockModalProps> = ({
  disabledReason,
  networkAllowed,
}) =>
  <div className="modalDivStyle">
    <h1 className="modalH1">{disabledReasons[disabledReason].title}</h1>
    {disabledReasons[disabledReason].render && disabledReasons[disabledReason].render(networkAllowed)}
  </div>
