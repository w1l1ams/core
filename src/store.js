const createListener = require('./listeners')
const store = {}

const remove = triggerId => {
  const listener = store[triggerId]
  if (listener) {
    try {
      listener.stopWatching()
    } catch (e) { }
  }
  delete store[triggerId]
}

const add = (trigger, onEvent) => {
  remove(trigger.id)
  store[trigger.id] = createListener(trigger)
    .watch((err, event) => onEvent(err, {
      event,
      trigger
    }))
}

module.exports = ({
  add,
  remove
})
