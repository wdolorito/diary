import '../styles/globals.css'
import MainLayout from '../layout/main_layout'
import { NetworkProvider } from '../context/network_context'
import { AuthProvider } from '../context/auth_context'
import { PostProvider } from '../context/post_context'

function MyApp({ Component, pageProps }) {
  return (
    <NetworkProvider>
      <AuthProvider>
      <PostProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        </PostProvider>
      </AuthProvider>
    </NetworkProvider>
  )
}

export default MyApp
