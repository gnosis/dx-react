import React, { CSSProperties } from 'react'
import { BigNumber, Modal } from 'types'
import { closeModal } from 'actions'
import { network2URL, ETHEREUM_NETWORKS, FIXED_DECIMALS, COMPANY_NAME } from 'globals'

import Loader from 'components/Loader'
import { displayUserFriendlyError } from 'utils'

import { toDecimal } from 'web3/lib/utils/utils.js'

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
        <ul>
            <li>{`Total participation: ${txData.sellAmount}${txData.tokenA.symbol || txData.tokenA.name}`}</li>
            <li>{`Fee level: ${txData.feeRatio}%`}</li>
            {txData.useOWL && <li>{`Fees paid in OWL: ${(((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).div(2)).toFixed(FIXED_DECIMALS)}OWL (=${((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).toFixed(FIXED_DECIMALS)} ${txData.tokenA.symbol || txData.tokenA.name})`}</li>}
            <li>{`Fees paid in ${txData.tokenA.symbol || txData.tokenA.name}: ${txData.useOWL ? (((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).div(2)).toFixed(FIXED_DECIMALS) : ((txData.sellAmount as BigNumber).minus(txData.sellAmountAfterFee)).toFixed(FIXED_DECIMALS)}${txData.tokenA.symbol || txData.tokenA.name}`}</li>
            <li>{`Amount deposited into auction: ${txData.sellAmountAfterFee.toFixed(FIXED_DECIMALS)}${txData.tokenA.symbol || txData.tokenA.name}`}</li>
        </ul>
      </div>
    }
    {txData &&
      <>
        <p className="modalHeaderDescriptor">Processing the transaction may take a while.</p>
        <div className="modalTXDataDiv">
          <ul>
            <li>{`Amount deposited:    ${txData.sellAmount} (without fees applied)`}</li>
            {(txData.tokenA.symbol || txData.tokenA.name) &&
            <li>{`Token depositing:  ${txData.tokenA.symbol || txData.tokenA.name}${(txData.tokenA.name && txData.tokenA.symbol) && ' (' + txData.tokenA.name + ')'}`}</li>
            }
            <li>{`Deposit token address:  ${txData.tokenA.address}`}</li>
            <br />
            {(txData.tokenB.symbol || txData.tokenB.name) &&
            <li>{`Token receiving:  ${txData.tokenB.symbol || txData.tokenB.name}${(txData.tokenB.name && txData.tokenB.symbol) && ' (' + txData.tokenB.name + ')'}`}</li>
            }
            <li>{`Receiving token address:  ${txData.tokenB.address}`}</li>
            <li>Verify receiving token validity via EtherScan: <a target="_blank" href={`${network2URL[txData.network]}token/${txData.tokenB.address}`}>{`${network2URL[txData.network]}token/${txData.tokenB.address}`}</a></li>
          </ul>
        </div>
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
        <i>
          {footer.msg || null}
          <br/>
          <br/>
          For more information, read the <a href={footer.url || '#/content/FAQ/#approval'} target="_blank">{footer.urlMsg || ' linked'}</a>  or <a href="https://tokenallowance.io/" target="_blank">here</a> about token allowance.
        </i>
      </p>}
  </div>

export class PrivateKeyApproval extends React.Component<any> {
  state = {
    gasPrice: toDecimal(this.props.modalProps.txParams.gasPrice) as number,
    gasLimit: toDecimal(this.props.modalProps.txParams.gas) as number,
  }

  handleGasPriceChange = (e: any) => {
    return this.setState({
      gasPrice: e.target.value,
    })
  }

  handleGasChange = (e: any) => this.setState({ gasLimit: e.target.value })

  render() {
    const { modalProps: { header, body, buttons, onClick, txParams } } = this.props, { gasPrice, gasLimit } = this.state
    return (
      <div className="modalDivStyle">
        <h1 className="modalH1">{header || 'Please choose Token Approval amount'}</h1>
        <p className="modalP">
          { body || 'Please see below.' }
        </p>
        {txParams &&
          <>
            <div className="modalTXDataDiv">
              <ul>
                <li>From: {txParams.from}</li>
                <li>To: {txParams.to}</li>
                <li>Value: {toDecimal(txParams.value)}</li>
                <li>Data: {txParams.data}</li>

                <li>Gas Price:
                  <input
                    onChange={this.handleGasPriceChange}
                    value={gasPrice}
                    type="number"
                    name="gasPrice"
                    id="gasPrice"
                    min="0"
                    step="1"
                  />
                </li>
                <li>Gas Limit:
                  <input
                    onChange={this.handleGasChange}
                    value={gasLimit}
                    type="number"
                    name="gasLimit"
                    id="gasLimit"
                    min="0"
                    step="1"
                  />
                </li>
              </ul>
            </div>
            <p className="modalHeaderDescriptor">Processing the transaction may take a while.</p>
          </>
        }
        <div className="modalParentDiv">
          <div className="modalButtonDiv">
            <button
              className="modalButton"
              onClick={() => onClick('CANCEL')}
              >
              {buttons && buttons.button1.buttonTitle1 || 'Cancel'}
            </button>
            {buttons && buttons.button1.buttonDesc1 && <p className="modalButtonDescription">
              {buttons && buttons.button1.buttonDesc1 || `You\'ll allow ${COMPANY_NAME} to take just the amount of the current operation. Note that you\'ll have to sign a transfer confirmation and an order confirmation for future trades.`}
            </p>}
          </div>

          <div className="modalButtonDiv">
            <button
              className="modalButton"
              onClick={() => onClick({ gasPrice, gasLimit })}
              >
              {buttons && buttons.button2.buttonTitle2 || 'Confirm'}
            </button>
            {buttons && buttons.button2.buttonDesc2 && <p className="modalButtonDescription">
              {buttons && buttons.button2.buttonDesc2 || `You\'ll allow ${COMPANY_NAME} to also take your bidding token for future trades. ${COMPANY_NAME} won\'t take any tokens until also confirm your order. You will use the same amount of funds but save transaction cost on future trades.`}
            </p>}
          </div>
        </div>
      </div>
    )
  }
}

const blockModalStyle: CSSProperties = { fontSize: 16, fontWeight: 100 }

const disabledReasons = {
  geoblock: {
    title: `${COMPANY_NAME} is currently not available.`,
    render: () =>
      <div style={blockModalStyle}>
        <p>Please try again later. No funds are lost due to downtime.</p>
        <p>Still experiencing issues? You may be accessing {COMPANY_NAME} from a restricted country or region.</p>
        <br />
        <br />
        <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">Blog</a> to learn more about {COMPANY_NAME}.</i></small>
      </div>,
  },
  networkblock: {
    title: `${COMPANY_NAME} is not available on your network.`,
    render: (network = 'RINKEBY Test Network') =>
    <div style={blockModalStyle}>
      <p>{`Make sure you’re connected to the ${network}.`}</p>
      <br />
      <br />
      <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">Blog</a> to learn more about {COMPANY_NAME}.</i></small>
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
