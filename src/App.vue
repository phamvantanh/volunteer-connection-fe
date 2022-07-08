<template>
  <v-app>
    <!-- <v-main> -->
    <div id="app">
      <!-- <h1>TEST</h1> -->
      <router-view></router-view>
    </div>
    <!-- </v-main> -->
    <loading-overlay :loading-overlay-visible="loadingOverlayVisible" />
  </v-app>
</template>

<script>
import CookiesService from "./services/cookies.service";
const cookiesService = CookiesService.getService();
import { mapActions, mapGetters } from "vuex";
import AuthApis from "./factories/auth";
const LoadingOverlay = () => import("./components/LoadingOverlay");

export default {
  name: "App",
  components: { LoadingOverlay },
  methods: {
    ...mapActions(["getUserProfile"]),
  },
  computed: {
    ...mapGetters({
      loadingOverlayVisible: "loadingOverlayVisible",
    }),
  },

  beforeMount() {
    const token = cookiesService.getToken();
    if (token) {
      AuthApis.getUserProfile()
        .then((response) => {
          this.getUserProfile(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("user");
        });
    } else {
      localStorage.removeItem("user");
    }
  },
};
</script>

<style>
#app {
  font-family: "Montserrat", Arial, Helvetica, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
</style>
