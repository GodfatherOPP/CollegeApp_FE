// ** React Imports
import { createContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from '../@core/utils/axios'
import { jwtSignEnmail } from 'src/@core/utils/jwt'

// ** Config
import { isValidToken, setSession } from '../@core/utils/utils'

// ** Types
import { AuthValuesType, LoginParams, LoginOTPParams, ResendOTPParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginOTP: () => Promise.resolve(),
  resendOTP: () => Promise.resolve(),
  loginToAccount: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const initAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      const invitePage = router.pathname.includes('invite')

      if (user === null && storedToken && !invitePage) {
        if (isValidToken(storedToken)) {
          setLoading(true)
          setSession(storedToken)
          const response = await axios.get(`/auth/my-account`)
          const { dashboard, user } = response.data
          if (dashboard) {
            localStorage.setItem('userDashboard', JSON.stringify(dashboard))
          }

          setUser({ ...user })
          setLoading(false)
        } else {
          throw new Error('Invalid Token')
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      localStorage.removeItem('userData')
      localStorage.removeItem('userRoles')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userDashboard')
      setUser(null)
      setLoading(false)
      if (!router.pathname.includes('login')) {
        router.replace('/login')
      }
    }
  }, [user, router])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/auth/login', params)
      .then(async response => {
        if (response.data.status === 'success') {
          const { user, accessToken, dashboard } = response.data
          localStorage.setItem('userData', JSON.stringify(user))
          if (accessToken) {
            if (dashboard) {
              localStorage.setItem('userDashboard', JSON.stringify(dashboard))
            }
            const { roles } = user
            localStorage.setItem('userRoles', JSON.stringify(roles))
            localStorage.setItem('accessToken', accessToken)
            router.replace('/dashboards/')
          } else {
            router.replace('/two-steps-v1')
          }
        } else {
          throw new Error('Something went wrong')
        }
      })
      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = async () => {
    await axios.get('/auth/logout')
    setUser(null)
    localStorage.removeItem('userData')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userDashboard')
    router.push('/login')
  }

  const handleLoginOTP = (params: LoginOTPParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/auth/login_with_otp', params)
      .then(async response => {
        if (response.data.status === 'success') {
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/dashboards/'
          const { user, accessToken, dashboard } = response.data
          localStorage.setItem('userData', JSON.stringify(user))
          if (dashboard) {
            localStorage.setItem('userDashboard', JSON.stringify(dashboard))
          }
          const { roles } = user
          localStorage.setItem('userRoles', JSON.stringify(roles))
          localStorage.setItem('accessToken', accessToken)
          router.replace(redirectURL as string)
        } else {
          throw new Error('Something went wrong')
        }
      })
      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleResendOTP = (params: ResendOTPParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/auth/resend_otp', params)
      .then(async response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLoginToAccount = async (email: string, errorCallback?: ErrCallbackType) => {
    const token = await jwtSignEnmail(email)
    axios
      .post('/auth/master-login', { email, token })
      .then(async response => {
        if (response.data.status === 'success') {
          const { user, accessToken, dashboard } = response.data
          localStorage.setItem('userData', JSON.stringify(user))
          if (accessToken) {
            if (dashboard) {
              localStorage.setItem('userDashboard', JSON.stringify(dashboard))
            }
            const { roles } = user
            setUser(null)
            localStorage.setItem('userRoles', JSON.stringify(roles))
            localStorage.setItem('accessToken', accessToken)
            router.replace('/dashboards/')
          }
        } else {
          throw new Error('Something went wrong')
        }
      })
      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err)
      })
  }

  const memoizedValue = useMemo(
    () => ({
      user,
      loading,
      setUser,
      setLoading,
      login: handleLogin,
      logout: handleLogout,
      loginOTP: handleLoginOTP,
      resendOTP: handleResendOTP,
      loginToAccount: handleLoginToAccount
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, handleLogin, handleLogout, handleLoginOTP, handleResendOTP, handleLoginToAccount]
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
