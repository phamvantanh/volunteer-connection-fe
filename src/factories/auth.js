import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const AuthApis = {
  LOGIN: `${baseUrl}/login`,

  REGISTER: `${baseUrl}/register`,

  USER_PROFILE: `${baseUrl}/user-profile`,

  UPDATE_USER: `${baseUrl}/update`,

  LOGOUT: `${baseUrl}/logout`,

  SEND_VERIFY_LINK: `${baseUrl}/email/resend`,

  getUserProfile () {
    return new Promise((resolve, reject) => {
      axios.get(this.USER_PROFILE)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },

  registerUser (info) {
    return new Promise((resolve, reject) => {
      axios.post(this.REGISTER, info)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },

  sendVerifyLink(email){
    return new Promise((resolve, reject) => {
      axios.post(this.SEND_VERIFY_LINK, email)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },

  updateUser (userInfo) {
    return new Promise((resolve, reject) => {
      axios.put(this.UPDATE_USER, userInfo)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },

}
export default AuthApis
