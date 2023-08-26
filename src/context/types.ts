export type ErrCallbackType = (err: { [key: string]: string }) => void

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export type AuthUserType = null | Record<string, any>

export type AuthStateType = {
  isAuthenticated: boolean
  isInitialized: boolean
  user: AuthUserType
  dashboard?: any
}

// ----------------------------------------------------------------------

export type JWTContextType = {
  isAuthenticated: boolean
  isInitialized: boolean
  user: AuthUserType
  dashboard: any
  login: (email: string, password: string) => Promise<void>
  loginAsKey: (email: string, token: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
}

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type LoginOTPParams = {
  phone: string
  otp: string
  rememberMe?: boolean
}

export type ResendOTPParams = {
  phone: string
}

export type UserDataType = {
  id: number
  _id: string
  role: string
  roles: {
    id?: number
    name: string
    role: string
  }
  email: string
  fullName: string
  username: string
  password: string
  name?: string
  phone: string
  avatar?: string | null
  timeZone?: string
  createdBy: {
    _id: string
    phone?: string
    name?: string
  }
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loginOTP: (params: LoginOTPParams, errorCallback?: ErrCallbackType) => void
  resendOTP: (params: ResendOTPParams, errorCallback?: ErrCallbackType) => void
  loginToAccount: (email: string, errorCallback?: ErrCallbackType) => void
}
