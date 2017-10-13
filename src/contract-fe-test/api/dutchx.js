import dutchX from './initialisition'

let dutchXInst

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchX = async (DUTCHX_OPTIONS) => {
  console.log(' ===> FIRING initDutchX ACTION') //eslint-disable-line
  try {
    dutchXInst = await dutchX.init(DUTCHX_OPTIONS)
    console.log('SUCCESS CONNECTING TO DUTCHX INSTANCE', dutchXInst) // eslint-disable-line no-console
  } catch (e) {
    console.log('ERROR CONNECTING TO DUTCHX INSTANCE', e.message) // eslint-disable-line no-console
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection = async () => dutchXInst
