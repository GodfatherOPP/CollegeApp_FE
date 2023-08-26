// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import customers from 'src/store/finance/customers'
import sideBarPermission from 'src/store/sideBarPermission'

export const store = configureStore({
  reducer: {
    sideBarPermission,
    customers
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
