import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/auth';

// Load Vuex
Vue.use(Vuex);
// Create store
export default new Vuex.Store({
  modules: {
    auth
  },
  state: {
    loadingOverlayVisible: false
  },

  mutations: {
    showLoadingOverlay(state) {
      state.loadingOverlayVisible = true
    },

    hideLoadingOverlay(state) {
      state.loadingOverlayVisible = false
    }
  },

  actions: {
    showLoadingOverlay(context) {
      context.commit('showLoadingOverlay')
    },

    hideLoadingOverlay(context) {
      context.commit('hideLoadingOverlay')
    }
  },

  getters: {
    loadingOverlayVisible(state) {
      return state.loadingOverlayVisible
    }
  }
});
