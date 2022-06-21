import '../styles/globals.css'
import MainLayout from '../layout/main_layout'
import { NetworkProvider } from '../context/network_context'
import { AuthProvider } from '../context/auth_context'

function MyApp({ Component, pageProps }) {
  return (
    <NetworkProvider>
      <AuthProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthProvider>
    </NetworkProvider>
  )
}

export default MyApp
