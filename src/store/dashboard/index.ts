import { createSlice, Dispatch } from '@reduxjs/toolkit'
import axios from 'src/@core/utils/axios'

// -------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  analytic: {},
  routeTracker: null,
  monthlyCollection: null,
  transcationMethod: null,
  campaignDetail: null,
  agentOverview: null,
  dailyAgentOverview: null,
  weeklyAgentOverview: null,
  dailyAnalyticsOverview: null,
  monthlyAnalyticsOverview: null,
  dailyAgentReport: null,
  weeklyAgentReport: null,
  cityList: [],
  cityData: [],
  routeList: [],
  routeDetail: [],
  agentData: []
}

const slice = createSlice({
  name: 'dashboard',
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
      state.analytic = {}
    },
    // GET Dashboard Analytics Info for User
    setAnalytic(state, action) {
      state.isLoading = false
      state.analytic = action.payload.data
    },
    // GET Dashboard Route Tracker Info for User
    setRouteTracker(state, action) {
      state.isLoading = false
      state.routeTracker = action.payload.data
    },

    // GET Dashboard Route Tracker Info for User
    setMonthlyCollection(state, action) {
      state.isLoading = false
      state.monthlyCollection = action.payload.data
    },
    // GET Dashboard Tran. Method Info for User
    setTranscationMethod(state, action) {
      state.isLoading = false
      state.transcationMethod = action.payload.data
    },
    // GET Dashboard Campain Method Info for User
    setCampaignDetail(state, action) {
      state.isLoading = false
      state.campaignDetail = action.payload.data
    },
    // GET Dashboard Agent Overview Method Info for User
    setAgentOverview(state, action) {
      state.isLoading = false
      state.agentOverview = action.payload.data
    },
    // GET Dashboard City for User
    setCityList(state, action) {
      state.isLoading = false
      state.cityList = action.payload.data
    },
    // GET Dashboard City Data
    setCityData(state, action) {
      state.isLoading = false
      state.cityData = action.payload.data
    },
    setRouteList(state, action) {
      state.isLoading = false
      state.routeList = action.payload.data
    },
    setRouteDetail(state, action) {
      state.isLoading = false
      state.routeDetail = action.payload.data
    },
    setAgentData(state, action) {
      state.isLoading = false
      state.agentData = action.payload.data
    },
    setDailyAgentOverview(state, action) {
      state.isLoading = false
      state.dailyAgentOverview = action.payload.data
    },
    setWeeklyAgentOverview(state, action) {
      state.isLoading = false
      state.weeklyAgentOverview = action.payload.data
    },
    setDailyAnalyticsOverview(state, action) {
      state.isLoading = false
      state.dailyAnalyticsOverview = action.payload.data
    },
    setMonthlyAnalyticsOverview(state, action) {
      state.isLoading = false
      state.monthlyAnalyticsOverview = action.payload.data
    },
    setDailyAgentReport(state, action) {
      state.isLoading = false
      state.dailyAgentReport = action.payload.data
    },
    setWeeklyAgentReport(state, action) {
      state.isLoading = false
      state.weeklyAgentReport = action.payload.data
    },
  }
})

// Reducer
export default slice.reducer

// ----------------------------------------------------------------------

export function getDashboardAnalytics() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/analytics`)
      dispatch(slice.actions.setAnalytic(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardRouteTracker(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/route_tracker`, { params })

      dispatch(slice.actions.setRouteTracker(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardMonthlyCollection() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/transaction`)

      dispatch(slice.actions.setMonthlyCollection(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardTranscationMethod() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/transaction_method`)

      dispatch(slice.actions.setTranscationMethod(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardCampaignDetail(filterDate: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/campaign?filterDate=${filterDate}`)

      dispatch(slice.actions.setCampaignDetail(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardAgentOverview(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_overview`, { params })

      dispatch(slice.actions.setAgentOverview(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardCities() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/city`)
      dispatch(slice.actions.setCityList(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardCityData(city: string, filter: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/customerdetails?city=${city}&filterData=${filter}`)
      dispatch(slice.actions.setCityData(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardRoutes() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_routes`)
      dispatch(slice.actions.setRouteList(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDashboardRouteDetails(from: string, end: string, color: string, filter: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(
        `/ad-id/dashboard/routesDetail?selectFrom=${from}&selectEnd=${end}&selectedColor=${color}&filterDate=${filter}`
      )
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.setRouteDetail(response.data))
      }
    } catch (error) {
      dispatch(
        slice.actions.setRouteDetail({
          totalUser: 0,
          lastSixmonthUser: 0,
          DisabledUser: 0,
          RtcUser: 0,
          OfrUser: 0,
          InserviceUser: 0
        })
      )
    }
  }
}

export function getAgentCreatedBy(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/createdBy/${id}`)
      dispatch(slice.actions.setAgentData(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}


export function getDailyAgentOverview() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_overview_daily`,)

      dispatch(slice.actions.setDailyAgentOverview(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getWeeklyAgentOverview() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_overview_weekly`)

      dispatch(slice.actions.setWeeklyAgentOverview(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}



export function getDailyAnalyticsOverview() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/location_daily`)

      dispatch(slice.actions.setDailyAnalyticsOverview(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getMonthlyAnalyticsOverview() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/location_monthly`)

      dispatch(slice.actions.setMonthlyAnalyticsOverview(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getDailyAgentReport() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_daily_report`,)

      dispatch(slice.actions.setDailyAgentReport(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}

export function getWeeklyAgentReport() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get(`/ad-id/dashboard/agent_weekly_report`,)

      dispatch(slice.actions.setWeeklyAgentReport(response.data))

      return response.data
    } catch (error) {
      dispatch(slice.actions.hasError(error))

      return error
    }
  }
}