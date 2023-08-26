import { createSlice, Dispatch } from '@reduxjs/toolkit'
import axios from 'src/@core/utils/axios'

// -------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  selectedUserPermission: null,
  AgentPermission: null
}

const slice = createSlice({
  name: 'siderBar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false
      state.error = action.payload
      state.selectedUserPermission = null
      state.AgentPermission = null
    },
    // GET Permissions For Admin
    setAdminPermissions(state, action) {
      state.isLoading = false
      state.selectedUserPermission = action.payload.data
      state.error = null
    },
    // GET Permissions For Agent
    setAgentPermissions(state, action) {
      state.isLoading = false
      state.AgentPermission = action.payload.data
      state.error = null
    }
  }
})

// Reducer
export default slice.reducer

// ----------------------------------------------------------------------

export function getSideBarPermission(id: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/users/permission/${id}`)
      if (response.data?.data?.roles?.id === 3) {
        dispatch(slice.actions.setAgentPermissions(response.data))

        return response.data
      } else if (response.data?.data?.roles?.id === 2) {
        dispatch(slice.actions.setAdminPermissions(response.data))

        return response.data
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}
