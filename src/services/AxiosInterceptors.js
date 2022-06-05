import CookiesService from "./cookies.service"
import axios from 'axios';

const cookiesService = CookiesService.getService()
const baseUrl = process.env.VUE_APP_BASE_URL

axios.interceptors.request.use(
  config => {
    const token = cookiesService.getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

axios.interceptors.response.use((response) => {
  return response
},
  error => {
    const refresh_token = {
      'refresh_token': cookiesService.getRefreshToken()
    }
    const originalRequest = error.config
    if (error.response.config.url === `${baseUrl}/login`) {
      return Promise.reject(error);
    }
    if (error.response.config.url === `${baseUrl}/refresh`) {
      return Promise.reject(error);
    }
    if (error.response.config.url === `${baseUrl}/logout`) {
      return Promise.reject(error);
    }
    if (error.response.data.message === 'Token has expired' || error.response.data.message === 'Unauthenticated.') {
      originalRequest._retry = true
      try {
        axios.post('https://backend-laravel.herokuapp.com/api/auth/refresh', refresh_token, {})
          .then(res => {
            if (res.status === 200) {
              // 1. Put token to cookies
              cookiesService.setToken(res.data.access_token)
              cookiesService.setRefreshToken(res.data.refresh_token)
              //2. Change 'Authorization' header
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookiesService.getToken()
              //3. return originalRequest object with Axios
              return axios(originalRequest)
            }
          })
      } catch (error) {
        console.log(error.response)
      }
    }
    return Promise.reject(error);
  }
)
