import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { router } from "./routers";
import Vuex from "vuex";
import store from "./store";
import mixin from "./mixins/alert-mixins";
import './services/AxiosInterceptors'

Vue.use(VueToast, {
  position: "top-right",
  duration: 3000,
  queue: true,
});
Vue.component(
  "verify-dialog",
  require("./components/VerifyDialog.vue").default
);

Vue.use(Vuex);
Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.mixin(mixin);

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App),
}).$mount('#app')
