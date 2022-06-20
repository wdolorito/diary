import { createContext } from 'react'
import Axios from 'axios'

const NetworkContext = createContext()

const NetworkProvider = props => {
  const callAxios = (config, success, fail) => {
    Axios(config)
      .then(
        res => {
          success(res)
        },
        err => {
          fail(err)
        })
  }

  const value = {
    callAxios
  }

  return (
    <NetworkContext.Provider value={ value }>
      {props.children}
    </NetworkContext.Provider>
  )
}

export { NetworkContext as default, NetworkProvider }
