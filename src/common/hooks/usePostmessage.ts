import pm from 'postMessage'

const usePostmessage = () => {
  const openTab = ({ id, label, url }) => {
    pm.send('openTab', window.top, {
      id,
      label,
      url
    })
  }

  const closeTab = ({ id }) => {
    pm.send('closeTab', window.top, {
      id
    })
  }

  const sendMessage = ({ id, payload }) => {
    pm.send('releaseMsg', window.top, {
      id,
      payload
    })
  }

  const watchMessage = (fn) => {
    pm.bind('subscribeMsg', (payload) => {
      fn(payload.data)
    })
  }

  return {
    openTab,
    closeTab,
    sendMessage,
    watchMessage,
  }
}

export default usePostmessage