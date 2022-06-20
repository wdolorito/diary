import '../styles/globals.css'
import MainLayout from '../layout/main_layout'
import { NetworkProvider } from '../context/network_context'

function MyApp({ Component, pageProps }) {
  return (
    <NetworkProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NetworkProvider>
  )
}

export default MyApp
