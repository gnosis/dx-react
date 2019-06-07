import React from 'react'
import Countdown from './Countdown'
import { MGNbalances } from './helpers'
import { BigNumber } from 'types'

const addressRexp = '^\\s*0x[0-9A-Fa-f]{40}\\s*$'

interface AccountBalanceProps {
  balances: MGNbalances;
  now: number;
  account?: string,
}

const toMGNnumber = (bn: BigNumber | null) => bn && bn.div(10 ** 18).toFixed(4)

const YourBalance: React.SFC<AccountBalanceProps> = ({ balances, now }) => {
  const { locked, unlocking, unlocked, whenUnlocked } = balances
  return (
    <div className="display-balance">
      <span>
        <strong>Your balances</strong>
      </span>
      <span>Your locked MGN: {toMGNnumber(locked)}</span>
      <span>
        Your unlocking* MGN: {toMGNnumber(unlocking)}
      </span>
      {whenUnlocked &&
        <Countdown now={now} then={whenUnlocked.toNumber()} />
      }
      <span>Your unlocked (tradable) MGN: {toMGNnumber(unlocked)}</span>
      <span>To see this amount in your wallet, add the MGN token address</span>
    </div>
  )
}

interface AccountBalancePropsEx extends AccountBalanceProps {
  setAccount(acc: string): void;
}

const AccountBalance: React.SFC<AccountBalancePropsEx> = ({
  balances,
  now,
  setAccount,
}) => {
  const { locked, unlocking, unlocked, whenUnlocked } = balances
  const changeAccount = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    if (input.checkValidity()) {
      setAccount(input.value)
    }
  }
  return (
    <div className="display-balance">
      <span>
        <strong>Check Balance for another address</strong>
      </span>
      <span>
        Enter address:{' '}
        <input
          type="text"
          pattern={addressRexp}
          title="address 0x1234..."
          placeholder="address"
          size={40}
          autoCorrect="off"
          spellCheck={false}
          onChange={changeAccount}
        />
      </span>
      <span>Locked MGN: {toMGNnumber(locked)}</span>
      <span>
        Unlocking* MGN: {toMGNnumber(unlocking)}
      </span>
      {whenUnlocked &&
        <Countdown now={now} then={whenUnlocked.toNumber()} />
      }
      <span>Unlocked (tradable) MGN: {toMGNnumber(unlocked)}</span>
    </div>
  )
}

export { YourBalance, AccountBalance }
