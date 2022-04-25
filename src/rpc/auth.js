import { addCalledTime } from '../redux/reducers/rpc/rpc.actions';
import store from '../redux/store';
var blake2b = require('blake2b')

export const getValidityKey = (data) => {
  // Get current time
  let time = new Date().valueOf();
  const state = store.getState()

  // Avoid potential conflicts with current time
  while (state.rpc.calledTimes.includes(time)) time++

  const token = state.rpc.password

  var hash = blake2b(64)

  // Create validity key according to spec
  hash.update(Buffer.from(time.toString()))
  hash.update(Buffer.from(token))
  hash.update(Buffer.from(data))
  hash.update(Buffer.from(state.rpc.appId))

  // Store time used to avoid conflicts
  addCalledTime(time)

  // Return validity key and time used
  return {
    hash: hash.digest('hex'),
    time: time.toString()
  }
}