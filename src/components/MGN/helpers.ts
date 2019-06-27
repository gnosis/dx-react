import { MGNInterface, TransactionObject } from 'api/types'
import { BigNumber } from 'types'

export const getMGNapi = ({ mgn }: { mgn: MGNInterface }) => {
  const lockTokens: typeof mgn.lockTokens = (amount, tx) =>
    mgn.lockTokens(amount, tx)
  const unlockTokens: typeof mgn.unlockTokens = (tx) =>
    (console.log('unlocking', tx), mgn.unlockTokens(tx))
  const withdrawUnlockedTokens: typeof mgn.withdrawUnlockedTokens = tx =>
    mgn.withdrawUnlockedTokens(tx)

  return {
    lockTokens,
    unlockTokens,
    withdrawUnlockedTokens,
  }
}

export interface UseMGNBalances {
  mgn: MGNInterface;
  account: string;
  now: number;
}

export interface MGNbalances {
  locked: BigNumber;
  unlocking: BigNumber;
  unlocked: BigNumber;
  whenUnlocked: BigNumber;
}

export type TxName = 'lockTokens' | 'unlockTokens' | 'withdrawUnlockedTokens'

export interface UseMGNbalancesForCondsAndApi {
  balances: MGNbalances;
  now: number;
}
export type MGN_API = Pick<MGNInterface, TxName>

interface API {
  lockTokens: () => any;
  unlockTokens: () => any;
  withdrawUnlockedTokens: () => any;
}

export interface Conditions {
  canLock: boolean;
  canUnlock: boolean;
  canWithdraw: boolean;
  canReUnlock: boolean;
}

export type Wrap = <
  T extends (tx?: TransactionObject) => ReturnType<MGN_API[keyof MGN_API]>
  >(
  cb: T,
  name: TxName,
) => API[keyof API]

export const getConditions = ({ balances, now }: UseMGNbalancesForCondsAndApi): Conditions => {
  const { locked, unlocked, unlocking, whenUnlocked } = balances

  const canUnlock = locked && locked.greaterThan(0)
  const canLock = unlocked && unlocked.greaterThan(0)
  const canWithdraw =
    whenUnlocked && unlocking &&
    (whenUnlocked.lessThan(now) && unlocking.greaterThan(0))

  const canReUnlock = canUnlock && unlocking && unlocking.greaterThan(0)

  return {
    canUnlock,
    canLock,
    canWithdraw,
    canReUnlock,
  }
}

export async function getMGNbalances({
  mgn,
  account,
}: Pick<UseMGNBalances, 'mgn' | 'account'>): Promise<MGNbalances> {
  const [locked, [unlocking, whenUnlocked], unlocked] = await Promise.all([
    mgn.lockedTokenBalances(account),
    mgn.unlockedTokens(account),
    mgn.balanceOf(account),
  ])

  return {
    locked,
    unlocking,
    whenUnlocked,
    unlocked,
  }
}
