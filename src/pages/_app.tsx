/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import { LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import PushNotification from 'src/views/notification/pushNotification'
import { CallTimerDuraionProvider } from 'src/context/CallTimerContext'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  // const getFirebaseToken = async () => {
  //   // Register Service Worker
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker
  //       .register('./firebase-messaging-sw.js')
  //       .then(registration => {
  //         console.log('Service Worker registered:', registration)
  //       })
  //       .catch(error => {
  //         console.error('Service Worker registration failed:', error)
  //       })
  //   })
  //   const messaging = getMessaging(app)
  //   const permission = await Notification.requestPermission()
  //   if (permission === 'granted') {
  //     // Generate Token
  //     await getToken(messaging, {
  //       vapidKey: process.env.FIREBASE_VAPID_KEY
  //     })
  //       .then(currentToken => {
  //         if (currentToken) {
  //           // console.log('current token for client: ', currentToken)
  //           // Track the token -> client mapping, by sending to backend server
  //           // show on the UI that permission is secured
  //           // store.dispatch(registerToken({ web_token: currentToken }))
  //         } else {
  //           console.log('No registration token available. Request permission to generate one.')

  //           console.log('No registration token available. Request permission to generate one.')
  //           // shows on the UI that permission is required
  //         }
  //       })
  //       .catch(err => {
  //         console.log('An error occurred while retrieving token. ', err)
  //         // catch error while creating client token
  //       })
  //   } else if (permission === 'denied') {
  //     console.log('You denied for the notification')
  //   }
  // }

  // useEffect(() => {
  //   // Req user for notification permission
  //   setTimeout(() => getFirebaseToken(), 5000)
  // }, [])

  const [show, setShow] = useState(false)
  const [notification, setNotification] = useState({
    title: '',
    body: {
      title: '',
      userId: '',
      description: '',
      url: '',
      notification_type: ''
    }
  })

  // useEffect(() => {
  //   onMessageListener()
  //     .then((payload: any) => {
  //       if (payload) {
  //         setShow(true)
  //         setNotification({ title: payload?.data?.title, body: payload?.data })
  //       }
  //     })
  //     .catch(err => console.log('failed: ', err))
  // }, [])

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{themeConfig.templateName}</title>
          <meta name='description' content={themeConfig.templateName} />
          <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <CallTimerDuraionProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                            {show && <PushNotification notification={notification} />}
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </LocalizationProvider>
          </CallTimerDuraionProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
