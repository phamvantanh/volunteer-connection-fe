import axios from 'axios';
import AuthApis from "../../factories/auth";
import CookiesService from "../../services/cookies.service";
const cookiesService = CookiesService.getService();

const state = {
  user: null,
};


const getters = {
  StateUser: state => state.user,
  role: state => state.user.role,
};

const actions = {
  async logIn ({ commit }, User) {
    await axios.post(AuthApis.LOGIN, User)
      .then(response => {
        cookiesService.setToken(response.data.access_token);
        cookiesService.setRefreshToken(response.data.refresh_token);
        commit('setUser', response.data.user);
        var userInfo = {
          'email': response.data.user.email,
          'name': response.data.user.name,
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
      })

  },

  async logOut ({ commit }, header) {
    localStorage.removeItem('user')
    var refresh_token = {
      'refresh_token': cookiesService.getRefreshToken()
    }
    if (!refresh_token) {
      await axios.post(AuthApis.LOGOUT, refresh_token, {
        headers: header
      })
    }
    cookiesService.clearToken();
    cookiesService.clearRefreshToken();
    commit('setUser', null);
  },

  getUserProfile ({ commit }, user) {
    commit('setUser', user);
  }

};
const mutations = {
  setUser (state, user) {
    state.user = user
  },

};
export default {
  state,
  getters,
  actions,
  mutations
};
