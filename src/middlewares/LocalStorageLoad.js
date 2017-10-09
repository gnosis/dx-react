const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

export default store => next => (action) => {
  const { type } = action

  if (type !== 'INIT') return next(action)

  try {
    const storedState = JSON.parse(
      // eslint-disable-next-line
      window.localStorage.getItem(`GNOSIS_${process.env.VERSION}`)
    )

    if (storedState) {
      store.dispatch({
        type: LOAD_LOCALSTORAGE,
        payload: storedState,
      })
    }

    return next(action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }

  return null
}
