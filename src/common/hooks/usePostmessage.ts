import pm from 'postmessage'

const usePostmessage = () => {
  const openTab = ({ id, label, url }: { id: string, label: string, url: string }) => {
    pm.send('openTab', window.top, {
      id,
      label,
      url
    })
  }

  const closeTab = ({ id }: { id: string }) => {
    pm.send('closeTab', window.top, {
      id
    })
  }

  const sendMessage = ({ id, data }: { id: string, data: any }) => {
    pm.send('releaseMsg', window.top, {
      id,
      data
    })
  }

  const watchMessage = (fn: (data: any) => void) => {
    pm.bind('subscribeMsg', (params) => {
      fn(params.data)
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