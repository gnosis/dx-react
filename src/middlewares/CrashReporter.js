/**
 * Sends crash reports as state is updated and listeners are notified.
 */
const CrashReporter = () => next => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    throw err
  }
}

export default CrashReporter
