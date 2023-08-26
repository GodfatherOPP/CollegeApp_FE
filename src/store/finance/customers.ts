import { createSlice, Dispatch } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'

// -------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  customers: [],
  flags: [],
  total: 0,
  params: {
    sort: '',
    page: '',
    perPage: 10
  },
  selectedCustomer: null,
  status: true,
  selectedCall: []
}

const slice = createSlice({
  name: 'customers',
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
      state.customers = []
    },
    // GET CUSTOMERS
    getCustomersSuccess(state, action) {
      state.isLoading = false
      state.customers = action.payload.data
      state.total = action.payload.totalItems
      state.params = action.payload.params
      state.error = null
    },
    // GET Flags
    getFlagsSuccess(state, action) {
      state.isLoading = false
      state.flags = action.payload.data
      state.error = null
    },
    // CREATE CUSTOMERS
    createCustomerSuccess(state, action) {
      state.isLoading = false
      state.selectedCustomer = action.payload.data
      state.error = null
    },
    // GET CUSTOMERS BY ID
    getCustomerSuccess(state, action) {
      state.isLoading = false
      state.selectedCustomer = action.payload
      state.error = null
    },
    // UPDATE CUSTOMERS
    updateCustomerSuccess(state, action) {
      state.isLoading = false
      state.selectedCustomer = action.payload.data
      state.error = null
    },
    // ARCHIVE customers
    archiveCustomerSuccess(state, action) {
      state.isLoading = false
      state.selectedCustomer = action.payload.data
      state.error = null
    },
    // DND Update customers
    dndStatusUpdateSuccess(state, action) {
      state.isLoading = false
      state.selectedCustomer = action.payload.data
      state.error = null
    },
    // DELETE customers
    deleteCustomerSuccess(state) {
      state.isLoading = false
      state.selectedCustomer = null
      state.error = null
    },
    // UPDATE AUTOPAY
    updateAutoPaySuccess(state) {
      state.isLoading = false
      state.selectedCustomer = null
      state.error = null
    }
  }
})

// Reducer
export default slice.reducer

// ----------------------------------------------------------------------

export function getcustomers(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/ad-id/import', { params })
      dispatch(slice.actions.getCustomersSuccess(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getAllFlagsByadminId(id: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/flags/createdBy/${id}`)
      dispatch(slice.actions.getFlagsSuccess(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getcustomersPastDue(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/ad-id/import/past/due', { params })
      dispatch(slice.actions.getCustomersSuccess(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function createImport(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.post(`/ad-id/import`, data)
      if (response.data.statusCode === 200) dispatch(slice.actions.createCustomerSuccess(response.data))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function updateImport(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.put(`/ad-id/import/${data.id}`, data)
      if (response.data.statusCode === 200) dispatch(slice.actions.updateCustomerSuccess({ data: response.data }))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function archiveRecord(id: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.put(`/ad-id/import/archieve/${id}`)
      if (response.data.statusCode === 200) dispatch(slice.actions.archiveCustomerSuccess({ data: response.data }))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}
export function updateDndStatus(id: any, dndStatus: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.put(`/ad-id/import/dnd/${id}`, { dndStatus })
      if (response.data.statusCode === 200) dispatch(slice.actions.dndStatusUpdateSuccess({ data: response.data }))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}
export function getCustomerDetail(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/import/${id}`)
      if (response.data.statusCode === 200) dispatch(slice.actions.getCustomerSuccess(response.data))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function deleteImport(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.delete(`/ad-id/import/${id}`)
      if (response.data.statusCode === 201) dispatch(slice.actions.deleteCustomerSuccess(response.data))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}
export function updateAutoPay(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.post(`/ad-id/vt/transaction/autopay_edit`, data)
      if (response.data.statusCode === 201) dispatch(slice.actions.updateAutoPaySuccess(response.data))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function createPtp(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.post(`/ad-id/ptp`, data)
      if (response.data.statusCode === 200) dispatch(slice.actions.createCustomerSuccess(response.data))
      else dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getPtp(id: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/ptp/${id}`)
      if (response.data.statusCode !== 200) dispatch(slice.actions.hasError(response.data.message))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function updateAuthorizedPersonal(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.post(`/ad-id/import/authorized_person`, data)
      if (response.data.statusCode === 200) {
        await getCustomerDetail(data.customerId)
      }

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getCustomersDetailsByPhoneNumber(number: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/import/byPhone/${number}`)
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.getCustomerSuccess(response.data))
      } else {
        dispatch(slice.actions.hasError(response.data.message))
      }

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}
