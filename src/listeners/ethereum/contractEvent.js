const EthereumConnector = require('../../connectors/ethereum')

const match = trigger => trigger.contract && trigger.eventName

const createListener = trigger => {
  const connector = EthereumConnector(trigger.contract.chain)
  const onEvent = connector
    .contract(trigger.contract.abi)
    .at(trigger.contract.address)[trigger.eventName]
  if (!onEvent) { return null }
  const listener = onEvent(null, {
    fromBlock: 'latest',
    toBlock: 'latest'
  })
  return {
    watch: callback => listener.watch((error, data) => error
      ? callback(error)
      : Promise.all([
        Promise.resolve(data),
        connector.getTransactionReceiptPromise(data.transactionHash),
        connector.getTransactionPromise(data.transactionHash)
      ])
        .then(results => results.reduce((acc, value) => Object.assign(acc, value), {}))
        .then(data => callback(null, data))
        .catch(error => callback(error))
    ),
    stopWatching: listener.stopWatching
  }
}

module.exports = { match, createListener }