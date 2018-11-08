import { shallowDifferent } from 'utils'

interface StatefulSubBaseInterface {
  getState(): any,
  _getNewState(): any,
  subscribe(cb: Function): StatefulSubBaseInterface['unsubscribe'],
  unsubscribe(cb: Function): void,
  _shouldUpdate(prevState: any, nextState: any): Boolean,
  update(...args: any[]): void
}
interface StatefulSubInterface<T = Object> extends StatefulSubBaseInterface {
  _state: T,
  _subscriptions: Function[],
  getState(): T,
  subscribe(cb: (newState: T) => any): StatefulSubBaseInterface['unsubscribe'],
  _getNewState(...args: any[]): T | Promise<T>,
  _shouldUpdate(prevState: T, nextState: T): Boolean,
}

const StatefulSubBase: StatefulSubBaseInterface = {
  getState(this: StatefulSubInterface) {
    return this._state
  },
  _getNewState() {
    return {}
  },
  subscribe(this: StatefulSubInterface, cb) {
    this._subscriptions.push(cb)
    return () => this.unsubscribe(cb)
  },
  unsubscribe(this: StatefulSubInterface, cb) {
    this._subscriptions = this._subscriptions.filter(func => func !== cb)
  },
  _shouldUpdate(prevState, nextState) {
    return shallowDifferent(prevState, nextState)
  },
  async update(this: StatefulSubInterface, ...args) {
    const nextState = await this._getNewState(...args)

    if (this._shouldUpdate(this._state, nextState)) {
      this._state = nextState
      this._subscriptions.forEach(cb => {
        cb(nextState)
      })
    }
  },
}

// interface StatefulChildSubProps<T = {}> {
//   initialState?: T,
//   getNewState(): T,
//   shouldUpdate?(prevState: T, nextState: T): Boolean,
//   [P: string]: any,
// }

const createStatefulSub = <T = {}>(
  getNewState: StatefulSubInterface<T>['_getNewState'],
  initialState: T = {} as T,
  mixin: Partial<StatefulSubInterface<T>> = {},
): StatefulSubInterface<T> => {
  const statefulChildSub = Object.create(StatefulSubBase)

  return Object.assign(statefulChildSub, {
    _getNewState: getNewState,
    _state: initialState,
    _subscriptions: [],
  }, mixin)
}

export default createStatefulSub

export const createMultiSub = (...subs: StatefulSubInterface<any>[]) => {
  const getAllStates = () => subs.map(sub => sub.getState())

  const multiSub = createStatefulSub(getAllStates, getAllStates(), {
    _shouldUpdate: () => true,
  })

  const updateMultiSub = () => multiSub.update()

  subs.forEach(sub => sub.subscribe(updateMultiSub))

  return multiSub
}

// class StatefulSub implements StatefulSubInterface {
//   constructor(getNewState: Function, initialState = {}) {
//     this._getNewState = getNewState
//     this._state = initialState
//   }

//   getState(this: StatefulSubInterface) {
//     return this._state
//   }
//   _getNewState() {
//     return {}
//   }
//   subscribe(this: StatefulSubInterface, cb) {
//     this._subscriptions.push(cb)
//     return () => this.unsubscribe(cb)
//   }
//   unsubscribe(this: StatefulSubInterface, cb) {
//     this._subscriptions = this._subscriptions.filter(func => func !== cb)
//   }
//   _shouldUpdate(prevState, nextState) {
//     return shallowDifferent(prevState, nextState)
//   }
//   async update(this: StatefulSubInterface, ...args) {
//     const nextState = await this._getNewState(...args)

//     if (this._shouldUpdate(this._state, nextState)) {
//       this._state = nextState
//       this._subscriptions.forEach(cb => {
//         cb(nextState)
//       })
//     }
//   }
// }
