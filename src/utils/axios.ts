import axios from 'axios'
import { isValidToken } from './utils'
// config
// import { HOST_API_KEY } from '../config-global'

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: process.env.HOST_API_KEY
  // baseURL: 'http://localhost:1607/api/v1/ad-id'
})

axiosInstance.interceptors.request.use(
  config => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken && isValidToken(storedToken)) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${storedToken}`
      } else {
        config.headers = { Authorization: `Bearer ${storedToken}` }
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject((error.response && error.response.data) || 'Something went wrong')
)

export default axiosInstance
