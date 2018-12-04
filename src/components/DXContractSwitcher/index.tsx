import React, { ChangeEvent } from 'react'
import localForage from 'localforage'
import { getNetwork } from 'integrations/provider'

interface DXContractPickerState {
  ALL_OLD_CONTRACT_ADDRESSES: {},
  CONTRACT_ADDRESSES_TO_USE: {
    version: string,
    networks: {
      '1': string,
      '4': string,
      '42': string,
    },
  },
  DX_ADDRESS_TO_USE: string,
  VERSION_TO_USE: string,
  network: string,
}

const flexContainers = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexFlow: 'row wrap',
  flex: '0 1 90%',

  margin: '5px 0',
}

export default class DXContractPicker extends React.Component<{}, DXContractPickerState> {
  state = {
    ALL_OLD_CONTRACT_ADDRESSES: undefined,
    CONTRACT_ADDRESSES_TO_USE: undefined,
    VERSION_TO_USE: undefined,
    network: undefined,
  } as DXContractPickerState

  async componentDidMount() {
    const [ALL_OLD_CONTRACT_ADDRESSES, CONTRACT_ADDRESSES_TO_USE, network] = await Promise.all([
      localForage.getItem<any>('ALL_OLD_CONTRACT_ADDRESSES'),
      localForage.getItem<any>('CONTRACT_ADDRESSES_TO_USE'),
      getNetwork(window as any, true),
    ])

    return this.setState({
      ALL_OLD_CONTRACT_ADDRESSES,
      CONTRACT_ADDRESSES_TO_USE,
      DX_ADDRESS_TO_USE: CONTRACT_ADDRESSES_TO_USE['DutchExchangeProxy'][network].address,
      VERSION_TO_USE: CONTRACT_ADDRESSES_TO_USE['DutchExchangeProxy'].version,
      network,
    })
  }

  changeDXAddress = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { ALL_OLD_CONTRACT_ADDRESSES, network } = this.state
        // value here = network-list-version e.g 1.0.9 or 1.1.0
    const { value: version } = e.target

    const OLD_CONTRACT_OBJECT_TO_USE = ALL_OLD_CONTRACT_ADDRESSES[version]

    this.setState({
      VERSION_TO_USE: version,
      CONTRACT_ADDRESSES_TO_USE: OLD_CONTRACT_OBJECT_TO_USE,
      DX_ADDRESS_TO_USE: OLD_CONTRACT_OBJECT_TO_USE['DutchExchangeProxy'][network].address,
    })
    await localForage.setItem('CONTRACT_ADDRESSES_TO_USE', OLD_CONTRACT_OBJECT_TO_USE)

    return location.reload()
  }

  render() {
    const { ALL_OLD_CONTRACT_ADDRESSES, DX_ADDRESS_TO_USE, VERSION_TO_USE } = this.state

    if (!ALL_OLD_CONTRACT_ADDRESSES) return null

    return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'row wrap', background: '#fbf8e3' }}>
                <div style={flexContainers}>
                    <h3 style={{ margin: '0 5px' }}>DutchX Version: </h3>
                    <select
                        onChange={this.changeDXAddress}
                        title={DX_ADDRESS_TO_USE}
                        value={VERSION_TO_USE}
                    >
                        {Object.keys(ALL_OLD_CONTRACT_ADDRESSES).map((version: string, i: number) =>
                            <option
                                key={i + version}
                                value={version}
                            >
                                {version}
                            </option>,
                        )}
                    </select>
                </div>
                <div style={flexContainers}>
                    <h3 style={{ margin: '0 5px' }}>DutchX Address: </h3><p>{DX_ADDRESS_TO_USE}</p>
                </div>
            </div>
    )
  }
}
